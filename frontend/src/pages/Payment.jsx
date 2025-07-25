import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const luhnCheck = (num) => {
  let arr = (num + '').split('').reverse().map(x => parseInt(x));
  let sum = arr.reduce((acc, val, idx) => {
    if (idx % 2) {
      val *= 2;
      if (val > 9) val -= 9;
    }
    return acc + val;
  }, 0);
  return sum % 10 === 0;
};

const Payment = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const cleanCard = cardNumber.replace(/\D/g, '');
    if (!/^\d{13,19}$/.test(cleanCard) || !luhnCheck(cleanCard)) {
      errs.cardNumber = 'Invalid card number';
    }
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) {
      errs.expiry = 'Invalid expiry (MM/YY)';
    } else {
      const [mm, yy] = expiry.split('/').map(Number);
      const now = new Date();
      const expDate = new Date(2000 + yy, mm);
      if (expDate < now) {
        errs.expiry = 'Card expired';
      }
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      errs.cvc = 'Invalid CVC';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Make API call to backend to process payment
      const paymentData = {
        cardNumber,
        expiry,
        cvc,
        email: localStorage.getItem('userEmail') || 'test@example.com', // Example fallback
        // Add other required fields as needed
      };
      fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      })
        .then(async res => {
          if (!res.ok) throw new Error((await res.json()).error || 'Payment failed');
          return res.json();
        })
        .then(() => {
          navigate('/confirmation');
        })
        .catch(err => {
          setErrors({ api: err.message });
        });
    }
  };

  return (
    <div className="payment">
      <h2>Payment Information</h2>
      <p>Secure payment via Stripe or PayPal (integration placeholder).</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}
          required
        />
        {errors.cardNumber && <div style={{color:'#ff5252', marginBottom:8}}>{errors.cardNumber}</div>}
        <input
          type="text"
          placeholder="Expiry Date (MM/YY)"
          value={expiry}
          onChange={e => setExpiry(e.target.value)}
          required
        />
        {errors.expiry && <div style={{color:'#ff5252', marginBottom:8}}>{errors.expiry}</div>}
        <input
          type="text"
          placeholder="CVC"
          value={cvc}
          onChange={e => setCvc(e.target.value)}
          required
        />
        {errors.cvc && <div style={{color:'#ff5252', marginBottom:8}}>{errors.cvc}</div>}
        <button type="submit">Pay</button>
      {errors.api && <div style={{color:'#ff5252', marginBottom:8}}>{errors.api}</div>}
      </form>
    </div>
  );
};

export default Payment;
