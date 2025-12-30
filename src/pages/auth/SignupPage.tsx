import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Footer } from '../../components/ui/Footer';
import { Favorite, Email, Lock, Person, Phone, ArrowForward, School, Check } from '@mui/icons-material';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    batchYear: '',
    password: '',
    confirmPassword: '',
    userType: 'parent' as 'parent' | 'child',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      // Sign up with Supabase
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        batch_year: formData.batchYear,
        user_type: formData.userType,
      });

      if (signUpError) throw signUpError;

      setSuccess('Account created successfully! Please check your email to verify your account.');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
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
        <div style={{ maxWidth: '768px', width: '100%' }}>
          {/* Logo and Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Favorite style={{ fontSize: 64, color: '#7C3AED' }} />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Create Your Account</h1>
            <p style={{ color: '#6B7280' }}>Join the trusted GMC Nagpur alumni network</p>
          </div>

          {/* Signup Form */}
          <div style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', padding: '32px', border: '1px solid #E5E7EB' }}>
            {/* Success Message */}
            {success && (
              <div style={{ marginBottom: '24px', padding: '16px', background: '#D1FAE5', border: '1px solid #10B981', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Check style={{ fontSize: 24, color: '#10B981' }} />
                <p style={{ color: '#065F46', fontWeight: 600, margin: 0 }}>{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{ marginBottom: '24px', padding: '16px', background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px' }}>
                <p style={{ color: '#991B1B', fontWeight: 600, margin: 0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* User Type Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                  I am a
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={() => handleChange('userType', 'parent')}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: formData.userType === 'parent' ? '2px solid #7C3AED' : '2px solid #E5E7EB',
                      background: formData.userType === 'parent' ? '#7C3AED' : '#ffffff',
                      color: formData.userType === 'parent' ? '#ffffff' : '#111827',
                      fontWeight: 600,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (formData.userType !== 'parent') {
                        e.currentTarget.style.borderColor = '#7C3AED';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.userType !== 'parent') {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }
                    }}
                  >
                    Alumni Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('userType', 'child')}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: formData.userType === 'child' ? '2px solid #7C3AED' : '2px solid #E5E7EB',
                      background: formData.userType === 'child' ? '#7C3AED' : '#ffffff',
                      color: formData.userType === 'child' ? '#ffffff' : '#111827',
                      fontWeight: 600,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (formData.userType !== 'child') {
                        e.currentTarget.style.borderColor = '#7C3AED';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.userType !== 'child') {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }
                    }}
                  >
                    Adult Child
                  </button>
                </div>
              </div>

              {/* Full Name & Batch Year */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label htmlFor="fullName" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Person style={{ fontSize: 20, color: '#9CA3AF' }} />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
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
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="batchYear" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Batch Year (MBBS Entry)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <School style={{ fontSize: 20, color: '#9CA3AF' }} />
                    </div>
                    <input
                      id="batchYear"
                      type="number"
                      value={formData.batchYear}
                      onChange={(e) => handleChange('batchYear', e.target.value)}
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
                      placeholder="e.g., 2010"
                      min="1950"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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

                <div>
                  <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Phone style={{ fontSize: 20, color: '#9CA3AF' }} />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
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
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <Lock style={{ fontSize: 20, color: '#9CA3AF' }} />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
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
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                <input
                  id="terms"
                  type="checkbox"
                  style={{ width: '16px', height: '16px', marginTop: '4px', cursor: 'pointer' }}
                  required
                />
                <label htmlFor="terms" style={{ fontSize: '14px', color: '#374151' }}>
                  I agree to the{' '}
                  <Link to="/terms" style={{ color: '#7C3AED', fontWeight: 500, textDecoration: 'none' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ color: '#7C3AED', fontWeight: 500, textDecoration: 'none' }}>
                    Privacy Policy
                  </Link>
                </label>
              </div>

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
                  boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.2s',
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
                {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowForward style={{ fontSize: 20 }} />}
              </button>
            </form>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '24px 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#E5E7EB' }}></div>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <span style={{ background: '#ffffff', padding: '0 16px', fontSize: '14px', color: '#6B7280' }}>
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link to="/login" style={{ textDecoration: 'none' }}>
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
                Sign In
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
