import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
