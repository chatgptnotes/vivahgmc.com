import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { BrowseProfilesPage } from './pages/profiles/BrowseProfilesPage';
import { ProfileManagementPage } from './pages/profiles/ProfileManagementPage';
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
          {/* More routes will be added */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
