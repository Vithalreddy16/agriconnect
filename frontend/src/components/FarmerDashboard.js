import React, { useState, useEffect } from "react";
import API from "../api";
import Layout from "./Layout";

function FarmerDashboard() {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ city: "" });

  useEffect(() => {
    loadCrops();
    loadServices();
    loadTransactions();
  }, []);

  // ----- Crops -----
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const addCrop = async (e) => {
    e.preventDefault();
    await API.post("/crops", {
      name: form.name,
      quantity: Number(form.quantity),
      price: Number(form.price)
    });
    setForm({ name: "", quantity: "", price: "" });
    loadCrops();
  };
  const loadCrops = async () => {
    const res = await API.get("/crops");
    const farmerId = localStorage.getItem("userId");
    setCrops(res.data.filter(c => c.farmerId._id === farmerId));
  };

  // ----- Services -----
  const loadServices = async () => {
    const res = await API.get("/services");
    setServices(res.data);
  };
  const bookService = async (id) => {
    await API.post(`/services/${id}/book`);
    alert("Service booked!");
    loadServices();
  };

  // ----- Transactions -----
  const loadTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data);
  };
  const totalEarned = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  // ----- Weather -----
  const fetchWeather = async (e) => {
    e.preventDefault();
    const geo = await fetch(`https://nominatim.openstreetmap.org/search?city=${location.city}&format=json`);
    const geoData = await geo.json();
    if (geoData.length === 0) return alert("City not found");
    const { lat, lon } = geoData[0];
    const res = await API.get(`/weather?lat=${lat}&lon=${lon}`);
    setWeather(res.data);
  };

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported!");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await API.get(`/weather?lat=${latitude}&lon=${longitude}`);
        setWeather(res.data);
      } catch (err) {
        alert("Weather API failed");
      }
    });
  };

  return (
    <Layout>
      <h2>👨‍🌾 Farmer Dashboard</h2>
      <p><strong>💰 Total Earned:</strong> ₹{totalEarned}</p>

      {/* Add Crop */}
      <div className="dashboard-card">
        <h4>Add New Crop</h4>
        <form onSubmit={addCrop}>
          <input className="form-control mb-2" name="name"
            placeholder="Crop" value={form.name} onChange={handleChange} required />
          <input className="form-control mb-2" name="quantity" type="number"
            placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
          <input className="form-control mb-2" name="price" type="number"
            placeholder="Price" value={form.price} onChange={handleChange} required />
          <button className="btn btn-success">Add Crop</button>
        </form>
      </div>

      {/* My Crops */}
      <div className="dashboard-card">
        <h4>My Crops</h4>
        <ul className="list-group">
          {crops.map(c => (
            <li key={c._id} className="list-group-item">{c.name} — {c.quantity} @ ₹{c.price}</li>
          ))}
          {crops.length === 0 && <li className="list-group-item">No crops yet.</li>}
        </ul>
      </div>

      {/* Services */}
      <div className="dashboard-card">
        <h4>Available Services</h4>
        <ul className="list-group">
          {services.map(s => (
            <li key={s._id} className="list-group-item d-flex justify-content-between">
              <div>
                <strong>{s.name}</strong> — {s.description} <span className="badge bg-success">₹{s.cost}</span>
              </div>
              <button className="btn btn-sm btn-outline-success" onClick={() => bookService(s._id)}>Book</button>
            </li>
          ))}
          {services.length === 0 && <li className="list-group-item">No services yet.</li>}
        </ul>
      </div>

      {/* Booked Services */}
      <div className="dashboard-card">
        <h4>My Booked Services</h4>
        <ul className="list-group">
          {services.filter(s => s.bookings.some(b => b._id === localStorage.getItem("userId"))).map(s => (
            <li key={s._id} className="list-group-item">
              {s.name} — {s.description} (₹{s.cost}) | Provider: {s.providerId?.name}
            </li>
          ))}
          {services.filter(s => s.bookings.some(b => b._id === localStorage.getItem("userId"))).length === 0 &&
            <li className="list-group-item">No booked services yet.</li>}
        </ul>
      </div>

      {/* Weather */}
      <div className="dashboard-card">
        <h4>Weather</h4>
        <form onSubmit={fetchWeather} className="d-flex mb-2">
          <input className="form-control me-2"
            placeholder="Enter city..."
            value={location.city}
            onChange={(e)=>setLocation({ city: e.target.value })}
          />
          <button className="btn btn-success">Get Weather</button>
        </form>
        <button className="btn btn-outline-success" onClick={fetchWeatherByLocation}>
          📍 Use My Current Location
        </button>
        {weather && (
          <div className="mt-3">
            <h5>{weather.name}</h5>
            <p>{weather.weather[0].description} 🌦</p>
            <p>🌡 {weather.main.temp} °C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>💨 Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default FarmerDashboard;