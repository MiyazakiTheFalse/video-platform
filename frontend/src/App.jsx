import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import UploadForm from './components/UploadForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import { AuthProvider, AuthContext } from './AuthContext';

// A wrapper to protect routes based on real auth state
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;

  return (
    <>
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
          path="/"
          element={user ? <Navigate to="/upload" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
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
