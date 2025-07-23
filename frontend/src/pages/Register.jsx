import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally handle registration logic (API call)
    // For now, just navigate to the next step
    navigate('/vehicle-shipping-info');
  };

  return (
    <div className="register">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <div style={{ marginTop: 16 }}>
        <button>Sign up with Google</button>
        <button style={{ marginLeft: 8 }}>Sign up with Facebook</button>
      </div>
    </div>
  );
};

export default Register;
