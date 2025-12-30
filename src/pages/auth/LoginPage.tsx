import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Footer } from '../../components/ui/Footer';
import { Favorite, Email, Lock, ArrowForward, AdminPanelSettings, Person, Check } from '@mui/icons-material';

// Development credentials - Remove in production!
const DEV_CREDENTIALS = {
  superadmin: {
    email: 'superadmin@vivahgmc.com',
    password: 'SuperAdmin@123',
    role: 'superadmin'
  },
  admin: {
    email: 'admin@vivahgmc.com',
    password: 'Admin@123',
    role: 'admin'
  },
  user: {
    email: 'user@vivahgmc.com',
    password: 'User@123',
    role: 'user'
  }
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const { error: signInError } = await signIn(formData.email, formData.password);

      if (signInError) throw signInError;

      setSuccess('Login successful!');
      setTimeout(() => {
        navigate('/browse');
      }, 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (credType: 'superadmin' | 'admin' | 'user') => {
    const creds = DEV_CREDENTIALS[credType];
    setFormData({ email: creds.email, password: creds.password });

    try {
      setLoading(true);
      setError('');
      const { error: signInError } = await signIn(creds.email, creds.password);

      if (signInError) {
        // If account doesn't exist, show info to create it
        setError(`${creds.role.toUpperCase()} account not found. Please create it at /signup with email: ${creds.email} and password: ${creds.password}`);
      } else {
        setSuccess(`Logged in as ${creds.role.toUpperCase()}!`);
        setTimeout(() => {
          navigate(credType === 'superadmin' || credType === 'admin' ? '/admin' : '/browse');
        }, 1000);
      }
    } catch (err: any) {
      console.error('Quick login error:', err);
      setError(`Account not found. Create at /signup: ${creds.email}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
        <div style={{ maxWidth: '512px', width: '100%' }}>
          {/* Logo and Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Favorite style={{ fontSize: 64, color: '#7C3AED' }} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Welcome Back</h1>
            <p style={{ color: '#6B7280' }}>Sign in to your GMC Alumni account</p>
          </div>

          {/* Login Form */}
          <div style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px', border: '1px solid #E5E7EB' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Email */}
              <div>
                <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Email style={{ fontSize: 20, color: '#9CA3AF' }} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
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
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Lock style={{ fontSize: 20, color: '#9CA3AF' }} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    id="remember"
                    type="checkbox"
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="remember" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" style={{ fontSize: '14px', color: '#7C3AED', fontWeight: 500, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  padding: '12px 16px',
                  background: '#FEE2E2',
                  border: '1px solid #F87171',
                  borderRadius: '8px',
                  color: '#991B1B',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div style={{
                  padding: '12px 16px',
                  background: '#D1FAE5',
                  border: '1px solid #34D399',
                  borderRadius: '8px',
                  color: '#065F46',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Check style={{ fontSize: 20, color: '#065F46' }} />
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: 600,
                  background: loading ? '#9CA3AF' : 'linear-gradient(to right, #7C3AED, #6D28D9)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: loading ? 'none' : '0 10px 25px rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(124, 58, 237, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.3)';
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'} <ArrowForward style={{ fontSize: 20 }} />
              </button>
            </form>

            {/* Development Quick Login - Remove in Production */}
            <div style={{ marginTop: '24px', padding: '16px', background: '#FEF3C7', borderRadius: '12px', border: '2px solid #F59E0B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AdminPanelSettings style={{ fontSize: 20, color: '#D97706' }} />
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#92400E', margin: 0 }}>
                  Development Mode - Quick Login
                </p>
              </div>

              <p style={{ fontSize: '12px', color: '#78350F', marginBottom: '16px' }}>
                Test accounts for development. Remove this section in production!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* SuperAdmin Quick Login */}
                <button
                  onClick={() => handleQuickLogin('superadmin')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: loading ? '#D1D5DB' : 'linear-gradient(to right, #DC2626, #B91C1C)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AdminPanelSettings style={{ fontSize: 18 }} />
                    SuperAdmin Login
                  </span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    {DEV_CREDENTIALS.superadmin.email}
                  </span>
                </button>

                {/* Admin Quick Login */}
                <button
                  onClick={() => handleQuickLogin('admin')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: loading ? '#D1D5DB' : 'linear-gradient(to right, #2563EB, #1D4ED8)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AdminPanelSettings style={{ fontSize: 18 }} />
                    Admin Login
                  </span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    {DEV_CREDENTIALS.admin.email}
                  </span>
                </button>

                {/* User Quick Login */}
                <button
                  onClick={() => handleQuickLogin('user')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: loading ? '#D1D5DB' : 'linear-gradient(to right, #059669, #047857)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Person style={{ fontSize: 18 }} />
                    User Login
                  </span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    {DEV_CREDENTIALS.user.email}
                  </span>
                </button>
              </div>

              {/* Credentials Reference */}
              <details style={{ marginTop: '12px' }}>
                <summary style={{ fontSize: '12px', color: '#92400E', cursor: 'pointer', fontWeight: 600 }}>
                  View Credentials
                </summary>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#78350F', fontFamily: 'monospace', background: '#FFFBEB', padding: '8px', borderRadius: '4px' }}>
                  <div style={{ marginBottom: '4px' }}><strong>SuperAdmin:</strong> {DEV_CREDENTIALS.superadmin.email} / {DEV_CREDENTIALS.superadmin.password}</div>
                  <div style={{ marginBottom: '4px' }}><strong>Admin:</strong> {DEV_CREDENTIALS.admin.email} / {DEV_CREDENTIALS.admin.password}</div>
                  <div><strong>User:</strong> {DEV_CREDENTIALS.user.email} / {DEV_CREDENTIALS.user.password}</div>
                </div>
              </details>
            </div>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '24px 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#E5E7EB' }}></div>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <span style={{ background: '#ffffff', padding: '0 16px', fontSize: '14px', color: '#6B7280' }}>
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Signup Link */}
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: 600,
                  background: '#ffffff',
                  color: '#7C3AED',
                  border: '2px solid #7C3AED',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#7C3AED';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#7C3AED';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create Account
              </button>
            </Link>
          </div>

          {/* Back to Home */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
