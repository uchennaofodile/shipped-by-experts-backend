import React from 'react';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const navigate = useNavigate();
  return (
    <div className="confirmation">
      <h2>Booking Confirmed!</h2>
      <p>Your shipment has been booked. You will receive an email with the estimated shipping cost, pickup details, and confirmation.</p>
      <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
    </div>
  );
};

export default Confirmation;
