import React, { useState } from 'react';
import { Footer } from '../../components/ui/Footer';
import {
  Search,
  FilterList,
  Favorite,
  FavoriteBorder,
  Work,
  LocationOn,
  School,
  VerifiedUser,
  ArrowForward,
} from '@mui/icons-material';

// Mock data for profiles
const mockProfiles = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    age: 28,
    profession: 'Cardiologist',
    education: 'MD Cardiology, AIIMS Delhi',
    location: 'Mumbai, Maharashtra',
    height: '5\'6"',
    batchYear: 2015,
    photo: 'https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Dr.+Priya',
    verified: true,
  },
  {
    id: 2,
    name: 'Dr. Rahul Mehta',
    age: 30,
    profession: 'Surgeon',
    education: 'MS General Surgery',
    location: 'Pune, Maharashtra',
    height: '5\'10"',
    batchYear: 2013,
    photo: 'https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Dr.+Rahul',
    verified: true,
  },
  {
    id: 3,
    name: 'Dr. Anjali Deshmukh',
    age: 27,
    profession: 'Pediatrician',
    education: 'MD Pediatrics',
    location: 'Nagpur, Maharashtra',
    height: '5\'5"',
    batchYear: 2016,
    photo: 'https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Dr.+Anjali',
    verified: true,
  },
  {
    id: 4,
    name: 'Dr. Vikram Patil',
    age: 32,
    profession: 'Orthopedic Surgeon',
    education: 'MS Orthopedics',
    location: 'Bangalore, Karnataka',
    height: '6\'0"',
    batchYear: 2011,
    photo: 'https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Dr.+Vikram',
    verified: true,
  },
  {
    id: 5,
    name: 'Dr. Meera Kulkarni',
    age: 29,
    profession: 'Dermatologist',
    education: 'MD Dermatology',
    location: 'Chennai, Tamil Nadu',
    height: '5\'4"',
    batchYear: 2014,
    photo: 'https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Dr.+Meera',
    verified: true,
  },
  {
    id: 6,
    name: 'Dr. Arjun Nair',
    age: 31,
    profession: 'Neurologist',
    education: 'DM Neurology',
    location: 'Hyderabad, Telangana',
    height: '5\'11"',
    batchYear: 2012,
    photo: 'https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Dr.+Arjun',
    verified: true,
  },
];

export const BrowseProfilesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    profession: '',
    location: '',
  });
  const [likedProfiles, setLikedProfiles] = useState<Set<number>>(new Set());

  const toggleLike = (profileId: number) => {
    setLikedProfiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Favorite style={{ fontSize: 32, color: '#7C3AED' }} />
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Browse Profiles</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 600,
                background: '#ffffff',
                color: '#7C3AED',
                border: '2px solid #7C3AED',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
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
              <FilterList style={{ fontSize: 20 }} />
              Filters
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Search style={{ fontSize: 24, color: '#9CA3AF' }} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '12px',
                paddingBottom: '12px',
                border: '1px solid #D1D5DB',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7C3AED';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="Search by name, profession, location..."
            />
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div style={{ marginTop: '16px', padding: '24px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Min Age
                  </label>
                  <input
                    type="number"
                    value={filters.minAge}
                    onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                    placeholder="25"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Max Age
                  </label>
                  <input
                    type="number"
                    value={filters.maxAge}
                    onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                    placeholder="35"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Profession
                  </label>
                  <input
                    type="text"
                    value={filters.profession}
                    onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                    placeholder="e.g., Surgeon"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                    placeholder="e.g., Mumbai"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: 'linear-gradient(to right, #7C3AED, #6D28D9)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => setFilters({ minAge: '', maxAge: '', profession: '', location: '' })}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: '#ffffff',
                    color: '#7C3AED',
                    border: '2px solid #7C3AED',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Profiles Grid */}
      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', padding: '32px 16px', width: '100%' }}>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: '#6B7280' }}>
            Showing <span style={{ fontWeight: 600, color: '#111827' }}>{mockProfiles.length}</span> verified profiles
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {mockProfiles.map((profile) => (
            <div
              key={profile.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              {/* Profile Image */}
              <div style={{ position: 'relative', height: '256px', overflow: 'hidden', background: '#E5E7EB' }}>
                <img
                  src={profile.photo}
                  alt={profile.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {profile.verified && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10B981', color: '#ffffff', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                    <VerifiedUser style={{ fontSize: 14 }} />
                    Verified
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(profile.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  }}
                >
                  {likedProfiles.has(profile.id) ? (
                    <Favorite style={{ fontSize: 24, color: '#EF4444' }} />
                  ) : (
                    <FavoriteBorder style={{ fontSize: 24, color: '#6B7280' }} />
                  )}
                </button>
              </div>

              {/* Profile Info */}
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{profile.name}</h3>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>
                    {profile.age} years, {profile.height}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '14px', color: '#6B7280' }}>
                    <Work style={{ fontSize: 18, color: '#7C3AED', flexShrink: 0 }} />
                    <span>{profile.profession}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '14px', color: '#6B7280' }}>
                    <School style={{ fontSize: 18, color: '#7C3AED', flexShrink: 0 }} />
                    <span>{profile.education}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '14px', color: '#6B7280' }}>
                    <LocationOn style={{ fontSize: 18, color: '#7C3AED', flexShrink: 0 }} />
                    <span>{profile.location}</span>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#7C3AED', fontWeight: 600, textAlign: 'center' }}>
                    Class of {profile.batchYear}
                  </p>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: 'linear-gradient(to right, #7C3AED, #6D28D9)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(124, 58, 237, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View Profile <ArrowForward style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
