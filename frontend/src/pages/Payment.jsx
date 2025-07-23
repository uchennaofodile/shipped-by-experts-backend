import React from 'react';

const Payment = () => (
  <div className="payment">
    <h2>Payment Information</h2>
    <p>Secure payment via Stripe or PayPal (integration placeholder).</p>
    <form>
      <input type="text" placeholder="Card Number" required />
      <input type="text" placeholder="Expiry Date (MM/YY)" required />
      <input type="text" placeholder="CVC" required />
      <button type="submit">Pay</button>
    </form>
  </div>
);

export default Payment;
