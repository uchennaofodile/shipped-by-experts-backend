import React from 'react';

const Profile = () => (
  <div className="profile">
    <h2>Profile & Settings</h2>
    <form>
      <input type="text" placeholder="Full Name" />
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Phone Number" />
      <input type="text" placeholder="Address" />
      <button type="submit">Update Profile</button>
    </form>
    <h3>Payment Methods</h3>
    <ul>
      <li>No payment methods added.</li>
    </ul>
    <button>Add Payment Method</button>
  </div>
);

export default Profile;
