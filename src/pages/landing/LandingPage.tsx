import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Footer } from '../../components/ui/Footer';
import {
  Favorite,
  VerifiedUser,
  Security,
  Groups,
  ChatBubble,
  CheckCircle,
  ArrowForward,
  Star,
} from '@mui/icons-material';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #ffffff, #faf5ff, #ffffff)' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 16px 128px' }}>
          <div style={{ textAlign: 'center' }}>
            {/* Logo */}
            <div style={{ marginBottom: '32px' }}>
              <Favorite style={{ fontSize: 96, color: '#7C3AED' }} />
            </div>

            {/* Main heading */}
            <h1 style={{ fontSize: '60px', fontWeight: 800, marginBottom: '24px', color: '#111827' }}>
              GMC Nagpur Alumni Matrimony
            </h1>

            <p style={{ fontSize: '24px', color: '#6B7280', marginBottom: '40px', maxWidth: '768px', margin: '0 auto 40px' }}>
              Find your perfect match within our trusted alumni network.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  padding: '20px 40px',
                  fontSize: '18px',
                  fontWeight: 600,
                  background: 'linear-gradient(to right, #7C3AED, #6D28D9)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Get Started <ArrowForward style={{ fontSize: 20 }} />
              </button>
              <button
                onClick={() => navigate('/browse')}
                style={{
                  padding: '20px 40px',
                  fontSize: '18px',
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
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#7C3AED';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Browse Profiles
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <VerifiedUser style={{ fontSize: 20, color: '#10B981' }} />
                <span style={{ fontWeight: 500, color: '#374151' }}>100% Verified Profiles</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Security style={{ fontSize: 20, color: '#7C3AED' }} />
                <span style={{ fontWeight: 500, color: '#374151' }}>Secure & Private</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star style={{ fontSize: 20, color: '#14B8A6' }} />
                <span style={{ fontWeight: 500, color: '#374151' }}>500+ Success Stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '96px 16px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Why Choose Us?
            </h2>
            <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '672px', margin: '0 auto' }}>
              Experience the perfect blend of tradition and technology in your search for the perfect life partner
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            <FeatureCard
              icon={<VerifiedUser style={{ fontSize: 56, color: '#10B981' }} />}
              title="Verified Profiles"
              description="Every profile manually verified by batch year for complete authenticity"
            />
            <FeatureCard
              icon={<Security style={{ fontSize: 56, color: '#7C3AED' }} />}
              title="Safe & Secure"
              description="Private communication with alumni families only in a protected environment"
            />
            <FeatureCard
              icon={<Groups style={{ fontSize: 56, color: '#14B8A6' }} />}
              title="Trusted Community"
              description="Connect exclusively with verified Government Medical College Nagpur alumni"
            />
            <FeatureCard
              icon={<ChatBubble style={{ fontSize: 56, color: '#10B981' }} />}
              title="Easy Communication"
              description="In-app chat system before sharing personal contact details"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '96px 16px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '672px', margin: '0 auto' }}>
              Your journey to finding the perfect match in three simple steps
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
            <StepCard
              number="1"
              title="Sign Up & Verify"
              description="Create your profile and verify your alumni status with batch year for instant credibility"
            />
            <StepCard
              number="2"
              title="Browse & Connect"
              description="Search verified profiles using smart filters and send connection requests to your matches"
            />
            <StepCard
              number="3"
              title="Chat & Meet"
              description="Communicate through our secure chat system and exchange contact details when ready"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '96px 16px', background: 'linear-gradient(135deg, #7C3AED, #6D28D9, #5B21B6)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Our Success in Numbers
            </h2>
            <p style={{ fontSize: '18px', color: '#ffffff', opacity: 0.9 }}>
              Trusted by hundreds of alumni families
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
            <StatCard number="500+" label="Active Profiles" />
            <StatCard number="200+" label="Successful Matches" />
            <StatCard number="50+" label="Batch Years" />
            <StatCard number="95%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section style={{ padding: '96px 16px', background: 'linear-gradient(to bottom, #ffffff, #faf5ff)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Success Stories
            </h2>
            <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '672px', margin: '0 auto' }}>
              Real stories from real couples who found their perfect match through our platform
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <TestimonialCard
              name="Dr. Priya & Dr. Rahul"
              batch="Class of 2010 & 2012"
              testimonial="We found each other through this platform and couldn't be happier. The verified alumni network made us feel secure throughout the process."
            />
            <TestimonialCard
              name="Dr. Anjali & Dr. Vikram"
              batch="Class of 2008 & 2009"
              testimonial="Being part of the same GMC family made our connection special. We're grateful for this wonderful platform."
            />
            <TestimonialCard
              name="Dr. Sneha & Dr. Amit"
              batch="Class of 2015 & 2014"
              testimonial="The trust factor of alumni verification made all the difference. Highly recommend this service!"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '96px 16px', background: 'linear-gradient(135deg, #7C3AED, #14B8A6)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ marginBottom: '32px' }}>
            <Favorite style={{ fontSize: 64, color: '#ffffff' }} />
          </div>
          <h2 style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff', marginBottom: '24px' }}>
            Ready to Find Your Perfect Match?
          </h2>
          <p style={{ fontSize: '24px', color: '#ffffff', opacity: 0.95, marginBottom: '40px', maxWidth: '672px', margin: '0 auto 40px' }}>
            Join hundreds of GMC Nagpur alumni who have found their life partners through our trusted platform
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/signup')}
              style={{
                padding: '20px 40px',
                fontSize: '18px',
                fontWeight: 600,
                background: '#ffffff',
                color: '#7C3AED',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
              }}
            >
              Create Your Profile <ArrowForward style={{ fontSize: 20 }} />
            </button>
            <button
              onClick={() => navigate('/browse')}
              style={{
                padding: '20px 40px',
                fontSize: '18px',
                fontWeight: 600,
                background: 'transparent',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#7C3AED';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Browse Profiles
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Helper Components
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div
    style={{
      background: '#ffffff',
      padding: '32px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      border: '1px solid #E5E7EB',
      transition: 'all 0.3s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}
  >
    <div style={{ marginBottom: '24px' }}>{icon}</div>
    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>{title}</h3>
    <p style={{ color: '#6B7280', lineHeight: '1.6' }}>{description}</p>
  </div>
);

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #7C3AED, #14B8A6)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 700,
        color: '#ffffff',
        margin: '0 auto 24px',
        boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
      }}
    >
      {number}
    </div>
    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>{title}</h3>
    <p style={{ color: '#6B7280', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto' }}>{description}</p>
  </div>
);

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <div style={{ transition: 'transform 0.3s', cursor: 'pointer' }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
    }}
  >
    <div style={{ fontSize: '64px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>{number}</div>
    <div style={{ fontSize: '20px', color: '#ffffff', opacity: 0.95, fontWeight: 500 }}>{label}</div>
  </div>
);

interface TestimonialCardProps {
  name: string;
  batch: string;
  testimonial: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, batch, testimonial }) => (
  <div
    style={{
      background: '#ffffff',
      padding: '32px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #E5E7EB',
      transition: 'all 0.3s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}
  >
    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
      <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%', display: 'inline-block' }}>
        <CheckCircle style={{ fontSize: 40, color: '#10B981' }} />
      </div>
    </div>
    <p style={{ color: '#374151', marginBottom: '24px', fontStyle: 'italic', fontSize: '18px', lineHeight: '1.6' }}>
      "{testimonial}"
    </p>
    <div style={{ textAlign: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
      <p style={{ fontWeight: 700, color: '#111827', fontSize: '18px' }}>{name}</p>
      <p style={{ fontSize: '14px', color: '#7C3AED', fontWeight: 500, marginTop: '4px' }}>{batch}</p>
    </div>
  </div>
);
