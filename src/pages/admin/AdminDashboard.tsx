import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../lib/supabase';
import { Footer } from '../../components/ui/Footer';
import {
  Dashboard,
  People,
  PendingActions,
  CheckCircle,
  Favorite,
  Search,
  Visibility,
  Check,
  Close,
} from '@mui/icons-material';

interface Stats {
  totalProfiles: number;
  pendingApprovals: number;
  approvedProfiles: number;
  rejectedProfiles: number;
  totalConnections: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProfiles: 0,
    pendingApprovals: 0,
    approvedProfiles: 0,
    rejectedProfiles: 0,
    totalConnections: 0,
  });
  const [pendingProfiles, setPendingProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load stats
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('status');

      if (allProfiles) {
        setStats({
          totalProfiles: allProfiles.length,
          pendingApprovals: allProfiles.filter(p => p.status === 'pending').length,
          approvedProfiles: allProfiles.filter(p => p.status === 'approved').length,
          rejectedProfiles: allProfiles.filter(p => p.status === 'rejected').length,
          totalConnections: 0, // Will be implemented with connections feature
        });
      }

      // Load pending profiles
      const { data: pending } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingProfiles(pending || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (profileId: string) => {
    try {
      setError('');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', profileId);

      if (updateError) throw updateError;

      setSuccess('Profile approved successfully!');
      setSelectedProfile(null);
      await loadDashboardData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error approving profile:', err);
      setError('Failed to approve profile');
    }
  };

  const handleReject = async (profileId: string, reason: string) => {
    try {
      setError('');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', profileId);

      if (updateError) throw updateError;

      setSuccess('Profile rejected');
      setSelectedProfile(null);
      await loadDashboardData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error rejecting profile:', err);
      setError('Failed to reject profile');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)' }}>
        <div style={{ textAlign: 'center' }}>
          <Dashboard style={{ fontSize: 64, color: '#7C3AED' }} />
          <p style={{ fontSize: '18px', color: '#6B7280', marginTop: '16px' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Dashboard style={{ fontSize: 32, color: '#7C3AED' }} />
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Admin Dashboard</h1>
            </div>
            <button
              onClick={() => navigate('/browse')}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 600,
                background: '#14B8A6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0D9488';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#14B8A6';
              }}
            >
              Browse Profiles
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1440px', margin: '0 auto', padding: '32px 16px', width: '100%' }}>
        {/* Success/Error Messages */}
        {success && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#D1FAE5', border: '1px solid #10B981', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Check style={{ fontSize: 24, color: '#10B981' }} />
            <p style={{ color: '#065F46', fontWeight: 600, margin: 0 }}>{success}</p>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px' }}>
            <p style={{ color: '#991B1B', fontWeight: 600, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <People style={{ fontSize: 40, color: '#7C3AED' }} />
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{stats.totalProfiles}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600 }}>Total Profiles</p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <PendingActions style={{ fontSize: 40, color: '#F59E0B' }} />
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{stats.pendingApprovals}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600 }}>Pending Approvals</p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <CheckCircle style={{ fontSize: 40, color: '#10B981' }} />
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{stats.approvedProfiles}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600 }}>Approved Profiles</p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Favorite style={{ fontSize: 40, color: '#EF4444' }} />
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{stats.totalConnections}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600 }}>Total Connections</p>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
            Pending Approvals ({pendingProfiles.length})
          </h2>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Search style={{ fontSize: 20, color: '#9CA3AF' }} />
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
              }}
              placeholder="Search by name, batch year..."
            />
          </div>

          {/* Profiles List */}
          {pendingProfiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
              <PendingActions style={{ fontSize: 64, opacity: 0.3, marginBottom: '16px' }} />
              <p style={{ fontSize: '16px' }}>No pending approvals</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {pendingProfiles
                .filter(profile =>
                  searchQuery === '' ||
                  profile.child_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  profile.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  profile.batch_year.toString().includes(searchQuery)
                )
                .map((profile) => (
                  <div
                    key={profile.id}
                    style={{
                      background: '#F9FAFB',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #E5E7EB',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                        {profile.child_name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6B7280' }}>
                        {profile.child_age} years, {profile.child_profession}
                      </p>
                    </div>

                    <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
                      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                        <strong>Parent:</strong> {profile.parent_name}
                      </p>
                      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                        <strong>Batch Year:</strong> {profile.batch_year}
                      </p>
                      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                        <strong>Education:</strong> {profile.child_education}
                      </p>
                      <p style={{ fontSize: '14px', color: '#6B7280' }}>
                        <strong>Location:</strong> {profile.child_location}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => setSelectedProfile(profile)}
                        style={{
                          flex: 1,
                          padding: '10px',
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
                        }}
                      >
                        <Visibility style={{ fontSize: 16 }} />
                        View
                      </button>
                      <button
                        onClick={() => handleApprove(profile.id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: 600,
                          background: '#10B981',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Check style={{ fontSize: 16 }} />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection:');
                          if (reason) handleReject(profile.id, reason);
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: 600,
                          background: '#EF4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Close style={{ fontSize: 16 }} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Profile Detail Modal */}
        {selectedProfile && (
          <div
            onClick={() => setSelectedProfile(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '20px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '32px',
              }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>
                Profile Details
              </h2>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '12px' }}>
                  Child Information
                </h3>
                <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {selectedProfile.child_name}</p>
                  <p style={{ marginBottom: '8px' }}><strong>Age:</strong> {selectedProfile.child_age} years</p>
                  <p style={{ marginBottom: '8px' }}><strong>Height:</strong> {selectedProfile.child_height}</p>
                  <p style={{ marginBottom: '8px' }}><strong>Profession:</strong> {selectedProfile.child_profession}</p>
                  <p style={{ marginBottom: '8px' }}><strong>Workplace:</strong> {selectedProfile.child_workplace}</p>
                  <p style={{ marginBottom: '8px' }}><strong>Education:</strong> {selectedProfile.child_education}</p>
                  <p style={{ marginBottom: 0 }}><strong>Location:</strong> {selectedProfile.child_location}</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '12px' }}>
                  Parent/Alumni Information
                </h3>
                <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ marginBottom: '8px' }}><strong>Parent Name:</strong> {selectedProfile.parent_name}</p>
                  <p style={{ marginBottom: '8px' }}><strong>Batch Year:</strong> {selectedProfile.batch_year}</p>
                  <p style={{ marginBottom: 0 }}><strong>City:</strong> {selectedProfile.parent_city}</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', marginBottom: '12px' }}>
                  Preferences
                </h3>
                <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>Age Range:</strong> {selectedProfile.pref_age_min || 'Any'} - {selectedProfile.pref_age_max || 'Any'}
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    <strong>Profession:</strong> {selectedProfile.pref_profession || 'Any'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedProfile(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: '#ffffff',
                    color: '#6B7280',
                    border: '2px solid #D1D5DB',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleApprove(selectedProfile.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: '#10B981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Reason for rejection:');
                    if (reason) handleReject(selectedProfile.id, reason);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    background: '#EF4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
