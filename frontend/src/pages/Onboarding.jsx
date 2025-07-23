import React from 'react';
import { Link } from 'react-router-dom';

const Onboarding = () => (
  <div className="onboarding">
    <h1>Welcome to Shipped By Experts</h1>
    <p>Ship your car with ease. Fast, secure, and reliable vehicle shipping for individuals and dealerships.</p>
    <div style={{ marginTop: 32 }}>
      <Link to="/register"><button>Create Account</button></Link>
      <Link to="/login" style={{ marginLeft: 16 }}><button>Log In</button></Link>
    </div>
  </div>
);

export default Onboarding;
