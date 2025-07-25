import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const firstName = form[0].value;
    const lastName = form[1].value;
    const email = form[2].value;
    const password = form[3].value;
    // Make API call to backend to register user
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password })
    })
      .then(async res => {
        if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
        return res.json();
      })
      .then(() => {
        localStorage.setItem('userEmail', email);
        navigate('/vehicle-shipping-info');
      })
      .catch(err => {
        setErrors({ api: err.message });
      });
  };

  return (
    <div className="register">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="First Name" required />
        <input type="text" placeholder="Last Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
        {errors.api && <div style={{color:'#ff5252', marginTop:8}}>{errors.api}</div>}
      </form>
      <div style={{ marginTop: 16 }}>
        <button>Sign up with Google</button>
        <button style={{ marginLeft: 8 }}>Sign up with Facebook</button>
      </div>
    </div>
  );
};

export default Register;
