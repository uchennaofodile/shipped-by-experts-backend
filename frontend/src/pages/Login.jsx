import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const form = e.target;
    const email = form[0].value;
    const password = form[1].value;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Unexpected server response. Please try again later.');
      }
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ api: err.message || 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
        {errors.api && <div style={{color:'#ff5252', marginTop:8}}>{errors.api}</div>}
      </form>
      <div style={{ marginTop: 16 }}>
        <button>Log in with Google</button>
        <button style={{ marginLeft: 8 }}>Log in with Facebook</button>
      </div>
    </div>
  );
};

export default Login;
