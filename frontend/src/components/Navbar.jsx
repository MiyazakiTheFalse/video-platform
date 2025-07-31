import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or a spinner if you want

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem', backgroundColor: '#222', color: 'white' 
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          MyVideoPlatform
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <Link to="/upload" style={{ color: 'white', textDecoration: 'none' }}>
              Upload
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
