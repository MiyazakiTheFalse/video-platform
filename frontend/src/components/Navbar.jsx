import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setLoggedIn(!!token);
  }, []);

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
        {loggedIn ? (
          <>
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
