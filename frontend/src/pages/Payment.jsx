import React from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally handle payment logic (API call)
    // For now, just navigate to the next step
    navigate('/confirmation');
  };

  return (
    <div className="payment">
      <h2>Payment Information</h2>
      <p>Secure payment via Stripe or PayPal (integration placeholder).</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Card Number" required />
        <input type="text" placeholder="Expiry Date (MM/YY)" required />
        <input type="text" placeholder="CVC" required />
        <button type="submit">Pay</button>
      </form>
    </div>
  );
};

export default Payment;
