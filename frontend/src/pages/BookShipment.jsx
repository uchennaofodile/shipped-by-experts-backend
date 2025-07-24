import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookShipment = () => {
  const navigate = useNavigate();
  const handleBegin = () => {
    navigate('/vehicle-shipping-info');
  };

  return (
    <div className="book-shipment">
      <h2>Book New Shipment</h2>
      <p>Start a new shipment request by entering your vehicle and shipping details.</p>
      <button onClick={handleBegin}>Begin</button>
    </div>
  );
};

export default BookShipment;
