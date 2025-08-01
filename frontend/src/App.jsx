import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import UploadForm from './components/UploadForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VideoPlayer from './components/VideoPlayer'; // ✅ NEW component for dynamic video route

import { AuthProvider, AuthContext } from './context/AuthContext';

// Optional: Home component if you plan to show a landing page or feed
// import Home from './components/Home'; 

// ✅ A wrapper to protect routes based on real auth state
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/upload" replace />} />
      <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/upload" replace />} />

      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <UploadForm />
          </PrivateRoute>
        }
      />

      {/* ✅ NEW: Route for dynamic video playback */}
      <Route
        path="/videos/:videoId"
        element={
          <PrivateRoute>
            <VideoPlayer />
          </PrivateRoute>
        }
      />

      {/* Default fallback route */}
      <Route
        path="/"
        element={user ? <Navigate to="/upload" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
