import React from 'react';
import { useNavigate } from 'react-router-dom';

const VehicleShippingInfo = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally handle vehicle info logic (API call)
    // For now, just navigate to the next step
    navigate('/payment');
  };

  return (
    <div className="vehicle-shipping-info">
      <h2>Vehicle & Shipping Information</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Vehicle Make" required />
        <input type="text" placeholder="Vehicle Model" required />
        <input type="number" placeholder="Year" required />
        <input type="text" placeholder="Pickup Location" required />
        <input type="text" placeholder="Drop-off Location" required />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default VehicleShippingInfo;
