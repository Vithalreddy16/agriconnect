import React, { useState, useEffect } from "react";
import API from "../api";
import Layout from "./Layout";

function ProviderDashboard() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", cost: "" });

  useEffect(() => { loadServices(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addService = async (e) => {
    e.preventDefault();
    await API.post("/services", {
      name: form.name,
      description: form.description,
      cost: Number(form.cost)
    });
    setForm({ name: "", description: "", cost: "" });
    loadServices();
  };

  const loadServices = async () => {
    const res = await API.get("/services");
    const providerId = localStorage.getItem("userId");
    setServices(res.data.filter(s => s.providerId._id === providerId));
  };

  return (
    <Layout>
      <h2>🛠 Service Provider Dashboard</h2>

      {/* Add Service */}
      <div className="dashboard-card">
        <h4>Add New Service</h4>
        <form onSubmit={addService}>
          <input className="form-control mb-2" name="name" placeholder="Service name"
            value={form.name} onChange={handleChange} required />
          <input className="form-control mb-2" name="description" placeholder="Description"
            value={form.description} onChange={handleChange} required />
          <input className="form-control mb-2" name="cost" type="number" placeholder="Cost"
            value={form.cost} onChange={handleChange} required />
          <button className="btn btn-success">Add Service</button>
        </form>
      </div>

      {/* My Services */}
      <div className="dashboard-card">
        <h4>My Services</h4>
        <ul className="list-group">
          {services.map(s => (
            <li key={s._id} className="list-group-item">
              <strong>{s.name}</strong> — {s.description} <span className="badge bg-success">₹{s.cost}</span>
              <br />
              Booked by:
              {s.bookings.length === 0 ? (
                <span className="text-muted"> None yet</span>
              ) : (
                <ul>
                  {s.bookings.map(b => (
                    <li key={b._id}>{b.name} ({b.email})</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {services.length === 0 && <li className="list-group-item">No services yet.</li>}
        </ul>
      </div>
    </Layout>
  );
}

export default ProviderDashboard;