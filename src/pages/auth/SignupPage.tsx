import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Footer } from '../../components/ui/Footer';
import { Favorite, Email, Lock, Person, Phone, ArrowForward, School, Check, AdminPanelSettings, Verified, Send } from '@mui/icons-material';

// Development credentials - Remove in production!
const DEV_CREDENTIALS = {
  superadmin: {
    fullName: 'Super Admin',
    email: 'superadmin@vivahgmc.com',
    phone: '+91 9999999999',
    batchYear: '2000',
    password: 'SuperAdmin@123',
    userType: 'parent' as 'parent' | 'child'
  },
  admin: {
    fullName: 'Admin User',
    email: 'admin@vivahgmc.com',
    phone: '+91 9999999998',
    batchYear: '2005',
    password: 'Admin@123',
    userType: 'parent' as 'parent' | 'child'
  },
  user: {
    fullName: 'Regular User',
    email: 'user@vivahgmc.com',
    phone: '+91 9999999997',
    batchYear: '2010',
    password: 'User@123',
    userType: 'child' as 'parent' | 'child'
  }
};

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    batchYear: '',
    password: '',
    confirmPassword: '',
    userType: 'parent' as 'parent' | 'child',
  });

  const [verification, setVerification] = useState({
    emailVerified: false,
    phoneVerified: false,
    emailOtp: '',
    phoneOtp: '',
    emailOtpSent: false,
    phoneOtpSent: false,
    emailOtpLoading: false,
    phoneOtpLoading: false,
  });

  const [otpInputs, setOtpInputs] = useState({
    emailOtp: '',
    phoneOtp: '',
  });

  // Popular country codes
  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  ];

  const sendEmailOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setVerification(prev => ({ ...prev, emailOtpLoading: true }));
    setError('');

    try {
      // Simulate OTP sending (in production, use Supabase or email service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      setVerification(prev => ({
        ...prev,
        emailOtp: otp,
        emailOtpSent: true,
        emailOtpLoading: false,
      }));

      setSuccess(`OTP sent to ${formData.email}. Check your inbox! (Dev: ${otp})`);

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      setVerification(prev => ({ ...prev, emailOtpLoading: false }));
    }
  };

  const sendPhoneOtp = async () => {
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }

    setVerification(prev => ({ ...prev, phoneOtpLoading: true }));
    setError('');

    try {
      // Simulate OTP sending (in production, use Twilio or SMS service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      setVerification(prev => ({
        ...prev,
        phoneOtp: otp,
        phoneOtpSent: true,
        phoneOtpLoading: false,
      }));

      setSuccess(`OTP sent to ${formData.countryCode} ${formData.phone}. (Dev: ${otp})`);

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      setVerification(prev => ({ ...prev, phoneOtpLoading: false }));
    }
  };

  const verifyEmailOtp = () => {
    if (otpInputs.emailOtp === verification.emailOtp) {
      setVerification(prev => ({ ...prev, emailVerified: true }));
      setSuccess('Email verified successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Invalid OTP. Please check and try again.');
    }
  };

  const verifyPhoneOtp = () => {
    if (otpInputs.phoneOtp === verification.phoneOtp) {
      setVerification(prev => ({ ...prev, phoneVerified: true }));
      setSuccess('Phone number verified successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Invalid OTP. Please check and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!verification.emailVerified) {
      setError('Please verify your email address');
      return;
    }

    if (!verification.phoneVerified) {
      setError('Please verify your phone number');
      return;
    }

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

  const handleQuickSignup = async (credType: 'superadmin' | 'admin' | 'user') => {
    const creds = DEV_CREDENTIALS[credType];
    setFormData({
      fullName: creds.fullName,
      email: creds.email,
      countryCode: '+91',
      phone: creds.phone.replace('+91 ', ''),
      batchYear: creds.batchYear,
      password: creds.password,
      confirmPassword: creds.password,
      userType: creds.userType
    });

    // Auto-verify for quick signup in development
    setVerification({
      emailVerified: true,
      phoneVerified: true,
      emailOtp: '',
      phoneOtp: '',
      emailOtpSent: false,
      phoneOtpSent: false,
      emailOtpLoading: false,
      phoneOtpLoading: false,
    });

    try {
      setLoading(true);
      setError('');

      const { error: signUpError } = await signUp(creds.email, creds.password, {
        full_name: creds.fullName,
        phone: `+91 ${creds.phone.replace('+91 ', '')}`,
        batch_year: creds.batchYear,
        user_type: creds.userType,
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError(`${credType.toUpperCase()} account already exists. Please login instead.`);
        } else {
          throw signUpError;
        }
      } else {
        setSuccess(`${credType.toUpperCase()} account created successfully!`);
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Quick signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
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
                    Email Address {verification.emailVerified && <Verified style={{ fontSize: 16, color: '#10B981', marginLeft: '4px' }} />}
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
                      disabled={verification.emailVerified}
                      style={{
                        width: '100%',
                        paddingLeft: '48px',
                        paddingRight: verification.emailVerified ? '16px' : '90px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        border: verification.emailVerified ? '2px solid #10B981' : '1px solid #D1D5DB',
                        borderRadius: '12px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        background: verification.emailVerified ? '#D1FAE5' : '#ffffff',
                        opacity: verification.emailVerified ? 0.8 : 1,
                      }}
                      onFocus={(e) => {
                        if (!verification.emailVerified) {
                          e.currentTarget.style.borderColor = '#7C3AED';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        if (!verification.emailVerified) {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                      placeholder="your@email.com"
                      required
                    />
                    {!verification.emailVerified && (
                      <button
                        type="button"
                        onClick={sendEmailOtp}
                        disabled={verification.emailOtpLoading || !formData.email}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: verification.emailOtpLoading ? '#D1D5DB' : '#7C3AED',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: verification.emailOtpLoading || !formData.email ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Send style={{ fontSize: 14 }} />
                        {verification.emailOtpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    )}
                  </div>

                  {/* Email OTP Input */}
                  {verification.emailOtpSent && !verification.emailVerified && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={otpInputs.emailOtp}
                          onChange={(e) => setOtpInputs(prev => ({ ...prev, emailOtp: e.target.value }))}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#7C3AED';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#D1D5DB';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={verifyEmailOtp}
                          disabled={otpInputs.emailOtp.length !== 6}
                          style={{
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: 600,
                            background: otpInputs.emailOtp.length === 6 ? '#10B981' : '#D1D5DB',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: otpInputs.emailOtp.length === 6 ? 'pointer' : 'not-allowed',
                          }}
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Phone Number {verification.phoneVerified && <Verified style={{ fontSize: 16, color: '#10B981', marginLeft: '4px' }} />}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Country Code Dropdown */}
                    <select
                      value={formData.countryCode}
                      onChange={(e) => handleChange('countryCode', e.target.value)}
                      disabled={verification.phoneVerified}
                      style={{
                        width: '120px',
                        padding: '12px',
                        border: verification.phoneVerified ? '2px solid #10B981' : '1px solid #D1D5DB',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        background: verification.phoneVerified ? '#D1FAE5' : '#ffffff',
                        cursor: verification.phoneVerified ? 'not-allowed' : 'pointer',
                      }}
                      onFocus={(e) => {
                        if (!verification.phoneVerified) {
                          e.currentTarget.style.borderColor = '#7C3AED';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        if (!verification.phoneVerified) {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {countryCodes.map((cc) => (
                        <option key={cc.code} value={cc.code}>
                          {cc.flag} {cc.code}
                        </option>
                      ))}
                    </select>

                    {/* Phone Input */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <Phone style={{ fontSize: 20, color: '#9CA3AF' }} />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        disabled={verification.phoneVerified}
                        style={{
                          width: '100%',
                          paddingLeft: '48px',
                          paddingRight: verification.phoneVerified ? '16px' : '90px',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          border: verification.phoneVerified ? '2px solid #10B981' : '1px solid #D1D5DB',
                          borderRadius: '12px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          background: verification.phoneVerified ? '#D1FAE5' : '#ffffff',
                          opacity: verification.phoneVerified ? 0.8 : 1,
                        }}
                        onFocus={(e) => {
                          if (!verification.phoneVerified) {
                            e.currentTarget.style.borderColor = '#7C3AED';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          if (!verification.phoneVerified) {
                            e.currentTarget.style.borderColor = '#D1D5DB';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                        placeholder="9999999999"
                        required
                      />
                      {!verification.phoneVerified && (
                        <button
                          type="button"
                          onClick={sendPhoneOtp}
                          disabled={verification.phoneOtpLoading || !formData.phone}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: verification.phoneOtpLoading ? '#D1D5DB' : '#7C3AED',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: verification.phoneOtpLoading || !formData.phone ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Send style={{ fontSize: 14 }} />
                          {verification.phoneOtpSent ? 'Resend' : 'Send OTP'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Phone OTP Input */}
                  {verification.phoneOtpSent && !verification.phoneVerified && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={otpInputs.phoneOtp}
                          onChange={(e) => setOtpInputs(prev => ({ ...prev, phoneOtp: e.target.value }))}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#7C3AED';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#D1D5DB';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={verifyPhoneOtp}
                          disabled={otpInputs.phoneOtp.length !== 6}
                          style={{
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: 600,
                            background: otpInputs.phoneOtp.length === 6 ? '#10B981' : '#D1D5DB',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: otpInputs.phoneOtp.length === 6 ? 'pointer' : 'not-allowed',
                          }}
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}
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

            {/* Development Quick Signup - Remove in Production */}
            <div style={{ marginTop: '24px', padding: '16px', background: '#FEF3C7', borderRadius: '12px', border: '2px solid #F59E0B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AdminPanelSettings style={{ fontSize: 20, color: '#D97706' }} />
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#92400E', margin: 0 }}>
                  Development Mode - Quick Account Creation
                </p>
              </div>

              <p style={{ fontSize: '12px', color: '#78350F', marginBottom: '16px' }}>
                Create test accounts instantly for development. Remove this section in production!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* SuperAdmin Quick Signup */}
                <button
                  onClick={() => handleQuickSignup('superadmin')}
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
                    Create SuperAdmin Account
                  </span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    {DEV_CREDENTIALS.superadmin.email}
                  </span>
                </button>

                {/* Admin Quick Signup */}
                <button
                  onClick={() => handleQuickSignup('admin')}
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
                    Create Admin Account
                  </span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    {DEV_CREDENTIALS.admin.email}
                  </span>
                </button>

                {/* User Quick Signup */}
                <button
                  onClick={() => handleQuickSignup('user')}
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
                    Create User Account
                  </span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    {DEV_CREDENTIALS.user.email}
                  </span>
                </button>
              </div>

              {/* Credentials Reference */}
              <details style={{ marginTop: '12px' }}>
                <summary style={{ fontSize: '12px', color: '#92400E', cursor: 'pointer', fontWeight: 600 }}>
                  View All Account Details
                </summary>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#78350F', fontFamily: 'monospace', background: '#FFFBEB', padding: '8px', borderRadius: '4px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>SuperAdmin:</strong><br />
                    Email: {DEV_CREDENTIALS.superadmin.email}<br />
                    Password: {DEV_CREDENTIALS.superadmin.password}<br />
                    Name: {DEV_CREDENTIALS.superadmin.fullName}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Admin:</strong><br />
                    Email: {DEV_CREDENTIALS.admin.email}<br />
                    Password: {DEV_CREDENTIALS.admin.password}<br />
                    Name: {DEV_CREDENTIALS.admin.fullName}
                  </div>
                  <div>
                    <strong>User:</strong><br />
                    Email: {DEV_CREDENTIALS.user.email}<br />
                    Password: {DEV_CREDENTIALS.user.password}<br />
                    Name: {DEV_CREDENTIALS.user.fullName}
                  </div>
                </div>
              </details>
            </div>

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
