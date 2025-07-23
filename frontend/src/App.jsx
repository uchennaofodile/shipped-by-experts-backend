import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Register from './pages/Register';
import Login from './pages/Login';
import VehicleShippingInfo from './pages/VehicleShippingInfo';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Dashboard from './pages/Dashboard';
import BookShipment from './pages/BookShipment';
import TrackShipment from './pages/TrackShipment';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vehicle-shipping-info" element={<VehicleShippingInfo />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-shipment" element={<BookShipment />} />
        <Route path="/track-shipment" element={<TrackShipment />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
