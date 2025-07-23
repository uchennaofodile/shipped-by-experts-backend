import React from 'react';

const VehicleShippingInfo = () => (
  <div className="vehicle-shipping-info">
    <h2>Vehicle & Shipping Information</h2>
    <form>
      <input type="text" placeholder="Vehicle Make" required />
      <input type="text" placeholder="Vehicle Model" required />
      <input type="number" placeholder="Year" required />
      <input type="text" placeholder="Pickup Location" required />
      <input type="text" placeholder="Drop-off Location" required />
      <button type="submit">Continue</button>
    </form>
  </div>
);

export default VehicleShippingInfo;
