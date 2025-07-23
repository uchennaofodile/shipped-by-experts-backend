import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => (
  <div className="dashboard">
    <h2>Dashboard Overview</h2>
    <div>
      <h3>Upcoming Shipments</h3>
      <ul>
        <li>No upcoming shipments.</li>
      </ul>
      <h3>Shipment History</h3>
      <ul>
        <li>No past shipments.</li>
      </ul>
      <h3>Payment Status</h3>
      <ul>
        <li>All payments up to date.</li>
      </ul>
      <h3>Active Bookings</h3>
      <ul>
        <li>No active bookings.</li>
      </ul>
    </div>
    <div style={{ marginTop: 32 }}>
      <Link to="/book-shipment"><button>Book New Shipment</button></Link>
      <Link to="/track-shipment" style={{ marginLeft: 8 }}><button>Track Shipment</button></Link>
      <Link to="/notifications" style={{ marginLeft: 8 }}><button>Notifications</button></Link>
      <Link to="/profile" style={{ marginLeft: 8 }}><button>Profile & Settings</button></Link>
    </div>
  </div>
);

export default Dashboard;
