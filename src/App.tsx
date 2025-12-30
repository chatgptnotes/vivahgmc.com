import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { BrowseProfilesPage } from './pages/profiles/BrowseProfilesPage';
import { ProfileManagementPage } from './pages/profiles/ProfileManagementPage';
import { PhotoUploadPage } from './pages/profiles/PhotoUploadPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MessagesPage } from './pages/messaging/MessagesPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/browse" element={<BrowseProfilesPage />} />
          <Route path="/profile" element={<ProfileManagementPage />} />
          <Route path="/photos" element={<PhotoUploadPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
