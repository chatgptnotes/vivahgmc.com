import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Footer } from '../../components/ui/Footer';
import {
  Person,
  School,
  Favorite,
  Edit,
  Check,
  ArrowBack,
  CameraAlt,
} from '@mui/icons-material';

export const ProfileManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    user_type: 'parent' as 'parent' | 'child',
    child_name: '',
    child_age: '',
    child_height: '',
    child_profession: '',
    child_workplace: '',
    child_education: '',
    child_location: '',
    parent_name: '',
    batch_year: '',
    parent_city: '',
    pref_age_min: '',
    pref_age_max: '',
    pref_profession: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          user_type: data.user_type,
          child_name: data.child_name || '',
          child_age: data.child_age?.toString() || '',
          child_height: data.child_height || '',
          child_profession: data.child_profession || '',
          child_workplace: data.child_workplace || '',
          child_education: data.child_education || '',
          child_location: data.child_location || '',
          parent_name: data.parent_name || '',
          batch_year: data.batch_year?.toString() || '',
          parent_city: data.parent_city || '',
          pref_age_min: data.pref_age_min?.toString() || '',
          pref_age_max: data.pref_age_max?.toString() || '',
          pref_profession: data.pref_profession || '',
        });
        setEditMode(false);
      } else {
        setEditMode(true);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.child_name.trim()) {
      setError('Child name is required');
      return false;
    }
    if (!formData.child_age || parseInt(formData.child_age) < 18) {
      setError('Child must be at least 18 years old');
      return false;
    }
    if (!formData.child_profession.trim()) {
      setError('Profession is required');
      return false;
    }
    if (!formData.child_education.trim()) {
      setError('Education is required');
      return false;
    }
    if (!formData.child_location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!formData.parent_name.trim()) {
      setError('Parent/Alumni name is required');
      return false;
    }
    if (!formData.batch_year || parseInt(formData.batch_year) < 1950 || parseInt(formData.batch_year) > new Date().getFullYear()) {
      setError('Valid batch year is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      const profileData = {
        user_id: user?.id,
        user_type: formData.user_type,
        child_name: formData.child_name,
        child_age: parseInt(formData.child_age),
        child_height: formData.child_height,
        child_profession: formData.child_profession,
        child_workplace: formData.child_workplace,
        child_education: formData.child_education,
        child_location: formData.child_location,
        parent_name: formData.parent_name,
        batch_year: parseInt(formData.batch_year),
        parent_city: formData.parent_city,
        pref_age_min: formData.pref_age_min ? parseInt(formData.pref_age_min) : null,
        pref_age_max: formData.pref_age_max ? parseInt(formData.pref_age_max) : null,
        pref_profession: formData.pref_profession,
        status: 'pending',
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;

      setSuccess('Profile saved successfully! Awaiting admin approval.');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            <Favorite style={{ fontSize: 64, color: '#7C3AED' }} />
          </div>
          <p style={{ fontSize: '18px', color: '#6B7280' }}>Loading profile...</p>
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
                onClick={() => navigate('/browse')}
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
              <Favorite style={{ fontSize: 32, color: '#7C3AED' }} />
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                {editMode ? 'Edit Profile' : 'My Profile'}
              </h1>
            </div>
            {!editMode && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => navigate('/photos')}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: '#14B8A6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0D9488';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#14B8A6';
                  }}
                >
                  <CameraAlt style={{ fontSize: 20 }} />
                  Manage Photos
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: '#7C3AED',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#6D28D9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#7C3AED';
                  }}
                >
                  <Edit style={{ fontSize: 20 }} />
                  Edit Profile
                </button>
              </div>
            )}
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

        <form onSubmit={handleSubmit}>
          {/* User Type Selection */}
          <div style={{ marginBottom: '32px', padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              I am
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button
                type="button"
                onClick={() => handleChange('user_type', 'parent')}
                disabled={!editMode}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: formData.user_type === 'parent' ? '2px solid #7C3AED' : '2px solid #E5E7EB',
                  background: formData.user_type === 'parent' ? '#7C3AED' : '#ffffff',
                  color: formData.user_type === 'parent' ? '#ffffff' : '#111827',
                  fontWeight: 600,
                  fontSize: '16px',
                  textAlign: 'center',
                  cursor: editMode ? 'pointer' : 'default',
                  opacity: editMode ? 1 : 0.6,
                  transition: 'all 0.2s',
                }}
              >
                Alumni Parent
              </button>
              <button
                type="button"
                onClick={() => handleChange('user_type', 'child')}
                disabled={!editMode}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: formData.user_type === 'child' ? '2px solid #7C3AED' : '2px solid #E5E7EB',
                  background: formData.user_type === 'child' ? '#7C3AED' : '#ffffff',
                  color: formData.user_type === 'child' ? '#ffffff' : '#111827',
                  fontWeight: 600,
                  fontSize: '16px',
                  textAlign: 'center',
                  cursor: editMode ? 'pointer' : 'default',
                  opacity: editMode ? 1 : 0.6,
                  transition: 'all 0.2s',
                }}
              >
                Adult Child
              </button>
            </div>
          </div>

          {/* Child Information */}
          <div style={{ marginBottom: '32px', padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Person style={{ fontSize: 24, color: '#7C3AED' }} />
              {formData.user_type === 'parent' ? "Child's Information" : 'Your Information'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.child_name}
                  onChange={(e) => handleChange('child_name', e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    opacity: editMode ? 1 : 0.6,
                  }}
                  placeholder="Enter full name"
                />
              </div>

              {/* Age and Height */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Age *
                  </label>
                  <input
                    type="number"
                    value={formData.child_age}
                    onChange={(e) => handleChange('child_age', e.target.value)}
                    disabled={!editMode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: editMode ? 1 : 0.6,
                    }}
                    placeholder="25"
                    min="18"
                    max="100"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Height
                  </label>
                  <input
                    type="text"
                    value={formData.child_height}
                    onChange={(e) => handleChange('child_height', e.target.value)}
                    disabled={!editMode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: editMode ? 1 : 0.6,
                    }}
                    placeholder="5'6&quot;"
                  />
                </div>
              </div>

              {/* Profession */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Profession *
                </label>
                <input
                  type="text"
                  value={formData.child_profession}
                  onChange={(e) => handleChange('child_profession', e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    opacity: editMode ? 1 : 0.6,
                  }}
                  placeholder="e.g., Cardiologist, Software Engineer"
                />
              </div>

              {/* Workplace */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Workplace
                </label>
                <input
                  type="text"
                  value={formData.child_workplace}
                  onChange={(e) => handleChange('child_workplace', e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    opacity: editMode ? 1 : 0.6,
                  }}
                  placeholder="Company/Hospital name"
                />
              </div>

              {/* Education */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Education *
                </label>
                <input
                  type="text"
                  value={formData.child_education}
                  onChange={(e) => handleChange('child_education', e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    opacity: editMode ? 1 : 0.6,
                  }}
                  placeholder="e.g., MD Cardiology, BTech Computer Science"
                />
              </div>

              {/* Location */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Current Location *
                </label>
                <input
                  type="text"
                  value={formData.child_location}
                  onChange={(e) => handleChange('child_location', e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    opacity: editMode ? 1 : 0.6,
                  }}
                  placeholder="City, State/Country"
                />
              </div>
            </div>
          </div>

          {/* Parent/Alumni Information */}
          <div style={{ marginBottom: '32px', padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <School style={{ fontSize: 24, color: '#14B8A6' }} />
              {formData.user_type === 'parent' ? 'Your Alumni Information' : 'Parent Alumni Information'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {/* Parent Name */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  {formData.user_type === 'parent' ? 'Your Name' : "Parent's Name"} *
                </label>
                <input
                  type="text"
                  value={formData.parent_name}
                  onChange={(e) => handleChange('parent_name', e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    opacity: editMode ? 1 : 0.6,
                  }}
                  placeholder="Alumni name"
                />
              </div>

              {/* Batch Year and City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    GMC Batch Year (MBBS Entry) *
                  </label>
                  <input
                    type="number"
                    value={formData.batch_year}
                    onChange={(e) => handleChange('batch_year', e.target.value)}
                    disabled={!editMode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: editMode ? 1 : 0.6,
                    }}
                    placeholder="2010"
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Current City
                  </label>
                  <input
                    type="text"
                    value={formData.parent_city}
                    onChange={(e) => handleChange('parent_city', e.target.value)}
                    disabled={!editMode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: editMode ? 1 : 0.6,
                    }}
                    placeholder="City name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div style={{ marginBottom: '32px', padding: '24px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Favorite style={{ fontSize: 24, color: '#EF4444' }} />
              Partner Preferences
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {/* Age Range */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Preferred Min Age
                  </label>
                  <input
                    type="number"
                    value={formData.pref_age_min}
                    onChange={(e) => handleChange('pref_age_min', e.target.value)}
                    disabled={!editMode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: editMode ? 1 : 0.6,
                    }}
                    placeholder="25"
                    min="18"
                    max="100"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Preferred Max Age
                  </label>
                  <input
                    type="number"
                    value={formData.pref_age_max}
                    onChange={(e) => handleChange('pref_age_max', e.target.value)}
                    disabled={!editMode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      opacity: editMode ? 1 : 0.6,
                    }}
                    placeholder="35"
                    min="18"
                    max="100"
                  />
                </div>
              </div>

              {/* Preferred Profession */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Preferred Profession
                </label>
                <input
                  type="text"
                  value={formData.pref_profession}
                  onChange={(e) => handleChange('pref_profession', e.target.value)}
                  disabled={!editMode}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    opacity: editMode ? 1 : 0.6,
                  }}
                  placeholder="Any specific profession preference"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {editMode && (
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  loadProfile();
                }}
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: '#ffffff',
                  color: '#6B7280',
                  border: '2px solid #D1D5DB',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#9CA3AF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: saving ? '#9CA3AF' : 'linear-gradient(to right, #7C3AED, #6D28D9)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(124, 58, 237, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Check style={{ fontSize: 20 }} />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}
        </form>

        {/* Info Box */}
        <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '12px' }}>
          <p style={{ fontSize: '14px', color: '#6D28D9', lineHeight: '1.6' }}>
            <strong>Note:</strong> Your profile will be reviewed by our admin team for verification.
            Once approved, it will be visible to other verified GMC Nagpur alumni in the matrimony network.
            Please ensure all information is accurate.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
