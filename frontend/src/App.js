import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./components/LoginRegister";
import FarmerDashboard from "./components/FarmerDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import RetailerDashboard from "./components/RetailerDashboard";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegister onLogin={(r)=>setRole(r)} />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/retailer" element={<RetailerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;