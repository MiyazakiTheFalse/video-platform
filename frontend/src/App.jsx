import React, { useContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import UploadForm from './components/UploadForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VideoPlayer from './components/VideoPlayer';

import { AuthProvider, AuthContext } from './context/AuthContext';

// Set axios defaults at the very top:
axios.defaults.baseURL = 'https://localhost:5000';
axios.defaults.withCredentials = true; // send cookies with requests

// PrivateRoute wrapper based on auth state
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

      <Route
        path="/videos/:videoId"
        element={
          <PrivateRoute>
            <VideoPlayer />
          </PrivateRoute>
        }
      />

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
