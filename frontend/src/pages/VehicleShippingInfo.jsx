import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import usStatesCities from '../assets/us-states-cities.json';

const US_STATES = Object.keys(usStatesCities)
  .map(abbr => ({ abbr, name: getStateName(abbr) }))
  .sort((a, b) => a.name.localeCompare(b.name));

function getStateName(abbr) {
  const names = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
  };
  return names[abbr] || abbr;
}

const SAMPLE_CITIES = usStatesCities;

const zipRegex = /^\d{5}(-\d{4})?$/;

const VehicleShippingInfo = () => {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState({});
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [year, setYear] = useState('');

  // Pickup fields
  const [pickupStreet, setPickupStreet] = useState('');
  const [pickupState, setPickupState] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupZip, setPickupZip] = useState('');
  // Dropoff fields
  const [dropoffStreet, setDropoffStreet] = useState('');
  const [dropoffState, setDropoffState] = useState('');
  const [dropoffCity, setDropoffCity] = useState('');
  const [dropoffZip, setDropoffZip] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    import('../assets/vehicle-makes-models.json').then(data => {
      setVehicleData(data.default || data);
    });
  }, []);

  const makes = Object.keys(vehicleData);
  const showCustomMake = make === 'Other';
  const showCustomModel = model === 'Other' || showCustomMake;
  const models = make && vehicleData[make] ? vehicleData[make] : [];

  const validate = () => {
    const errs = {};
    if (!pickupStreet.trim()) errs.pickupStreet = 'Enter a street address';
    if (!pickupState) errs.pickupState = 'Select a state';
    if (!pickupCity) errs.pickupCity = 'Select a city';
    if (!zipRegex.test(pickupZip)) errs.pickupZip = 'Enter a valid ZIP code';
    if (!dropoffStreet.trim()) errs.dropoffStreet = 'Enter a street address';
    if (!dropoffState) errs.dropoffState = 'Select a state';
    if (!dropoffCity) errs.dropoffCity = 'Select a city';
    if (!zipRegex.test(dropoffZip)) errs.dropoffZip = 'Enter a valid ZIP code';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Make API call to backend to book shipment
      const bookingData = {
        make: showCustomMake ? customMake : make,
        model: showCustomModel ? customModel : model,
        year,
        pickup: `${pickupStreet}, ${pickupCity}, ${pickupState} ${pickupZip}`,
        dropoff: `${dropoffStreet}, ${dropoffCity}, ${dropoffState} ${dropoffZip}`,
        // Add email or other required fields as needed
        email: localStorage.getItem('userEmail') || 'test@example.com', // Example fallback
        estimatedCost: 0 // You may want to calculate this or get from backend
      };
      fetch('/api/book-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })
        .then(async res => {
          if (!res.ok) throw new Error((await res.json()).error || 'Booking failed');
          return res.json();
        })
        .then(() => {
          navigate('/payment');
        })
        .catch(err => {
          setErrors({ api: err.message });
        });
    }
  };

  const pickupCities = SAMPLE_CITIES[pickupState] || [];
  const dropoffCities = SAMPLE_CITIES[dropoffState] || [];

  return (
    <div className="vehicle-shipping-info">
      <h2>Vehicle & Shipping Information</h2>
      <form onSubmit={handleSubmit}>
        <label style={{display:'block',textAlign:'left',marginBottom:4}}>Vehicle Make</label>
        <select
          value={make}
          onChange={e => {
            setMake(e.target.value);
            setModel('');
            setCustomMake('');
            setCustomModel('');
          }}
          required
        >
          <option value="">Select Make</option>
          {makes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        {showCustomMake && (
          <input
            type="text"
            placeholder="Enter Make"
            value={customMake}
            onChange={e => setCustomMake(e.target.value)}
            required
          />
        )}

        <label style={{display:'block',textAlign:'left',marginBottom:4,marginTop:12}}>Vehicle Model</label>
        {!showCustomMake && (
          <select
            value={model}
            onChange={e => {
              setModel(e.target.value);
              setCustomModel('');
            }}
            required
          >
            <option value="">Select Model</option>
            {models.map(mo => <option key={mo} value={mo}>{mo}</option>)}
          </select>
        )}
        {showCustomModel && (
          <input
            type="text"
            placeholder="Enter Model"
            value={customModel}
            onChange={e => setCustomModel(e.target.value)}
            required
          />
        )}

        <label style={{display:'block',textAlign:'left',marginBottom:4,marginTop:12}}>Year</label>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          required
        >
          <option value="">Select Year</option>
          {Array.from({length: (new Date().getFullYear() + 2 - 1980)}, (_, i) => (new Date().getFullYear() + 1 - i)).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Pickup Address */}
        <h3 style={{marginTop:32,marginBottom:8}}>Pickup Location</h3>
        <input
          type="text"
          placeholder="Street Address"
          value={pickupStreet}
          onChange={e => setPickupStreet(e.target.value)}
          required
        />
        {errors.pickupStreet && <div style={{color:'#ff5252', marginBottom:8}}>{errors.pickupStreet}</div>}
        <select
          value={pickupState}
          onChange={e => { setPickupState(e.target.value); setPickupCity(''); }}
          required
        >
          <option value="">Select State</option>
          {US_STATES.map(s => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
        </select>
        {errors.pickupState && <div style={{color:'#ff5252', marginBottom:8}}>{errors.pickupState}</div>}
        <select
          value={pickupCity}
          onChange={e => setPickupCity(e.target.value)}
          required
          disabled={!pickupState}
        >
          <option value="">Select City</option>
          {pickupCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        {errors.pickupCity && <div style={{color:'#ff5252', marginBottom:8}}>{errors.pickupCity}</div>}
        <input
          type="text"
          placeholder="ZIP Code"
          value={pickupZip}
          onChange={e => setPickupZip(e.target.value)}
          required
        />
        {errors.pickupZip && <div style={{color:'#ff5252', marginBottom:8}}>{errors.pickupZip}</div>}

        {/* Dropoff Address */}
        <h3 style={{marginTop:32,marginBottom:8}}>Drop-off Location</h3>
        <input
          type="text"
          placeholder="Street Address"
          value={dropoffStreet}
          onChange={e => setDropoffStreet(e.target.value)}
          required
        />
        {errors.dropoffStreet && <div style={{color:'#ff5252', marginBottom:8}}>{errors.dropoffStreet}</div>}
        <select
          value={dropoffState}
          onChange={e => { setDropoffState(e.target.value); setDropoffCity(''); }}
          required
        >
          <option value="">Select State</option>
          {US_STATES.map(s => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
        </select>
        {errors.dropoffState && <div style={{color:'#ff5252', marginBottom:8}}>{errors.dropoffState}</div>}
        <select
          value={dropoffCity}
          onChange={e => setDropoffCity(e.target.value)}
          required
          disabled={!dropoffState}
        >
          <option value="">Select City</option>
          {dropoffCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        {errors.dropoffCity && <div style={{color:'#ff5252', marginBottom:8}}>{errors.dropoffCity}</div>}
        <input
          type="text"
          placeholder="ZIP Code"
          value={dropoffZip}
          onChange={e => setDropoffZip(e.target.value)}
          required
        />
        {errors.dropoffZip && <div style={{color:'#ff5252', marginBottom:8}}>{errors.dropoffZip}</div>}

        <button type="submit">Continue</button>
      {errors.api && <div style={{color:'#ff5252', marginBottom:8}}>{errors.api}</div>}
      </form>
    </div>
  );
};

export default VehicleShippingInfo;
