import React from 'react';
import { Link } from 'react-router-dom';

const Onboarding = () => (
  <div className="onboarding">
    <h1>Welcome to Shipped By Experts</h1>
    <p>Ship your car with ease. Fast, secure, and reliable vehicle shipping for individuals and dealerships.</p>
    <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3>Individual User</h3>
        <Link to="/login"><button>Login as Individual</button></Link>
        <Link to="/register" style={{ marginLeft: 8 }}><button>Sign Up as Individual</button></Link>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3>Dealership</h3>
        <Link to="/dealership-login"><button>Login as Dealership</button></Link>
        <Link to="/dealership-register" style={{ marginLeft: 8 }}><button>Sign Up as Dealership</button></Link>
      </div>
    </div>
  </div>
);

export default Onboarding;
