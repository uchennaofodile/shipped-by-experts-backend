import React from 'react';

const Login = () => (
  <div className="login">
    <h2>Log In</h2>
    <form>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Log In</button>
    </form>
    <div style={{ marginTop: 16 }}>
      <button>Log in with Google</button>
      <button style={{ marginLeft: 8 }}>Log in with Facebook</button>
    </div>
  </div>
);

export default Login;
