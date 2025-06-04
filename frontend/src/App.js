import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Placeholder pages
const Welcome = () => <div>Welcome to Shipped By Experts</div>;
const Register = () => <div>Registration Page</div>;
const Login = () => <div>Login Page</div>;
const Dashboard = () => <div>Dashboard</div>;
const BookShipment = () => <div>Book Shipment</div>;
const TrackShipment = () => <div>Track Shipment</div>;
const Profile = () => <div>Profile & Settings</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/book" element={<BookShipment />} />
      <Route path="/track" element={<TrackShipment />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
