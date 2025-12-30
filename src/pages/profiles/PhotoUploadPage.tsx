import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Footer } from '../../components/ui/Footer';
import {
  CloudUpload,
  Delete,
  Check,
  ArrowBack,
  CameraAlt,
  Star,
  StarBorder,
} from '@mui/icons-material';

interface PhotoItem {
  id: string;
  photo_url: string;
  is_primary: boolean;
  uploaded_at: string;
}

export const PhotoUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadPhotos();
  }, [user, navigate]);

  const loadPhotos = async () => {
    try {
      setLoading(true);

      // First get the profile ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setError('Please create your profile first');
          setTimeout(() => navigate('/profile'), 2000);
          return;
        }
        throw profileError;
      }

      setProfileId(profileData.id);

      // Load photos
      const { data: photosData, error: photosError } = await supabase
        .from('profile_photos')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('uploaded_at', { ascending: false });

      if (photosError) throw photosError;

      setPhotos(photosData || []);
    } catch (err) {
      console.error('Error loading photos:', err);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        // Save to database
        const { error: dbError } = await supabase
          .from('profile_photos')
          .insert({
            profile_id: profileId,
            photo_url: publicUrl,
            is_primary: photos.length === 0, // First photo is primary
          });

        if (dbError) throw dbError;
      }

      setSuccess('Photos uploaded successfully!');
      await loadPhotos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error uploading photos:', err);
      setError('Failed to upload photos. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const setPrimaryPhoto = async (photoId: string) => {
    try {
      setError('');

      // Unset all primary flags
      await supabase
        .from('profile_photos')
        .update({ is_primary: false })
        .eq('profile_id', profileId);

      // Set new primary
      const { error } = await supabase
        .from('profile_photos')
        .update({ is_primary: true })
        .eq('id', photoId);

      if (error) throw error;

      setSuccess('Primary photo updated!');
      await loadPhotos();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error setting primary photo:', err);
      setError('Failed to update primary photo');
    }
  };

  const deletePhoto = async (photoId: string, photoUrl: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      setError('');

      // Extract file path from URL
      const urlParts = photoUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get last two parts: userId/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('profile-photos')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('profile_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      setSuccess('Photo deleted successfully!');
      await loadPhotos();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Failed to delete photo');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <CameraAlt style={{ fontSize: 64, color: '#7C3AED' }} />
          </div>
          <p style={{ fontSize: '18px', color: '#6B7280' }}>Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6B7280',
                }}
              >
                <ArrowBack style={{ fontSize: 24 }} />
              </button>
              <CameraAlt style={{ fontSize: 32, color: '#7C3AED' }} />
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Manage Photos</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1024px', margin: '0 auto', padding: '32px 16px', width: '100%' }}>
        {/* Success Message */}
        {success && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#D1FAE5', border: '1px solid #10B981', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Check style={{ fontSize: 24, color: '#10B981' }} />
            <p style={{ color: '#065F46', fontWeight: 600 }}>{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px' }}>
            <p style={{ color: '#991B1B', fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {/* Upload Section */}
        <div style={{ marginBottom: '32px', padding: '32px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <CloudUpload style={{ fontSize: 64, color: '#7C3AED' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
            Upload Your Photos
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
            Add up to 5 photos. First photo will be your profile picture. Maximum file size: 5MB per photo.
          </p>

          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || photos.length >= 5}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="photo-upload"
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: 600,
              background: uploading || photos.length >= 5 ? '#9CA3AF' : 'linear-gradient(to right, #7C3AED, #6D28D9)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: uploading || photos.length >= 5 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <CloudUpload style={{ fontSize: 20 }} />
            {uploading ? 'Uploading...' : photos.length >= 5 ? 'Maximum Photos Reached' : 'Choose Photos'}
          </label>

          <div style={{ marginTop: '16px', fontSize: '14px', color: '#6B7280' }}>
            {photos.length} / 5 photos uploaded
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length > 0 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Your Photos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    position: 'relative',
                    background: '#ffffff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: photo.is_primary ? '3px solid #7C3AED' : '1px solid #E5E7EB',
                  }}
                >
                  {/* Photo */}
                  <div style={{ position: 'relative', paddingTop: '133.33%', background: '#E5E7EB' }}>
                    <img
                      src={photo.photo_url}
                      alt="Profile"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {photo.is_primary && (
                      <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#7C3AED', color: '#ffffff', padding: '4px 10px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                        <Star style={{ fontSize: 14 }} />
                        Primary
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                    {!photo.is_primary && (
                      <button
                        onClick={() => setPrimaryPhoto(photo.id)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          fontSize: '14px',
                          fontWeight: 600,
                          background: '#ffffff',
                          color: '#7C3AED',
                          border: '2px solid #7C3AED',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#7C3AED';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.color = '#7C3AED';
                        }}
                      >
                        <StarBorder style={{ fontSize: 16 }} />
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => deletePhoto(photo.id, photo.photo_url)}
                      style={{
                        flex: photo.is_primary ? 1 : 0,
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        background: '#ffffff',
                        color: '#EF4444',
                        border: '2px solid #EF4444',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#EF4444';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#EF4444';
                      }}
                    >
                      <Delete style={{ fontSize: 16 }} />
                      {photo.is_primary ? 'Delete' : ''}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '12px' }}>
          <p style={{ fontSize: '14px', color: '#6D28D9', lineHeight: '1.6' }}>
            <strong>Photo Guidelines:</strong>
          </p>
          <ul style={{ fontSize: '14px', color: '#6D28D9', lineHeight: '1.6', marginTop: '8px', paddingLeft: '20px' }}>
            <li>Upload clear, recent photos</li>
            <li>First photo will be displayed as your profile picture</li>
            <li>Avoid group photos or photos with filters</li>
            <li>Photos must be appropriate and respectful</li>
            <li>Admin will review all photos before approval</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};
