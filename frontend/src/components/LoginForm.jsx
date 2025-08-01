// LoginForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// Debug all Axios requests
axios.interceptors.request.use(config => {
  console.log('[Axios Request]', config.method.toUpperCase(), config.url, config.data);
  return config;
}, error => Promise.reject(error));

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Optional: check session on mount
  useEffect(() => {
    axios.get('https://localhost:5000/me', {
      withCredentials: true,
    })
    .then(res => {
      console.log("Already logged in as:", res.data);
      navigate('/upload');
    })
    .catch(err => {
      console.warn("Not logged in:", err.response?.status || err.message);
    });
  }, [navigate]);

  const getCSRFToken = () => {
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    return match ? match[1] : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const csrfToken = getCSRFToken();

      // Step 1: Login request
      await axios.post(
        'https://localhost:5000/login',
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );

      // Step 2: Wait briefly to allow session cookie to propagate
      setTimeout(async () => {
        try {
          const meResponse = await axios.get('https://localhost:5000/me', {
            withCredentials: true,
          });

          console.log("Logged in as:", meResponse.data);
          localStorage.setItem('authToken', 'true');
          navigate('/upload');
        } catch (verifyErr) {
          console.error("Login succeeded but session not recognized:", verifyErr);
          setError("Login succeeded, but session check failed.");
        }
      }, 300); // 300ms delay often resolves propagation issues
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      setError(msg);
      console.warn("Login error:", err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Login</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don’t have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
}

export default LoginForm;
