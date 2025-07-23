import React from 'react';

const Register = () => (
  <div className="register">
    <h2>Create Your Account</h2>
    <form>
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

export default Register;
