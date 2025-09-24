import React, { useEffect, useState } from "react";
import API from "../api";
import Layout from "./Layout";

function RetailerDashboard() {
  const [crops, setCrops] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadCrops();
    loadTransactions();
  }, []);

  const loadCrops = async () => {
    const res = await API.get("/crops");
    setCrops(res.data);
  };

  const loadTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data);
  };

  const buyCrop = async (id) => {
    const qty = prompt("Enter quantity to buy:");
    if (!qty) return;
    try {
      await API.post(`/crops/${id}/buy`, { quantity: Number(qty) });
      alert("Purchase successful!");
      loadCrops();
      loadTransactions();
    } catch (err) {
      alert("Error: " + err.response?.data?.error);
    }
  };

  return (
    <Layout>
      <h2>🛒 Retailer Dashboard</h2>

      {/* Crops */}
      <div className="dashboard-card">
        <h4>Available Crops</h4>
        <ul className="list-group">
          {crops.map(c => (
            <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {c.name} — {c.quantity} units @ ₹{c.price} <br/>
                <small>Farmer: {c.farmerId?.name}</small>
              </div>
              <button className="btn btn-sm btn-success" onClick={() => buyCrop(c._id)}>Buy</button>
            </li>
          ))}
          {crops.length === 0 && <li className="list-group-item">No crops available.</li>}
        </ul>
      </div>

      {/* My Purchases */}
      <div className="dashboard-card">
        <h4>My Purchases</h4>
        <ul className="list-group">
          {transactions.map(t => (
            <li key={t._id} className="list-group-item">
              Bought {t.quantity} × {t.cropId?.name} for ₹{t.amount} ({t.status})
            </li>
          ))}
          {transactions.length === 0 && <li className="list-group-item">No purchases yet.</li>}
        </ul>
      </div>
    </Layout>
  );
}

export default RetailerDashboard;