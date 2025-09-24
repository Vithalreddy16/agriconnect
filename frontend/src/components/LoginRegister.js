import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Layout from "./Layout";

function LoginRegister({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await API.post("/auth/register", form);
        alert("🎉 Registered successfully! Now login.");
        setIsRegister(false);
      } else {
        const res = await API.post("/auth/login", { email: form.email, password: form.password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.id);
        onLogin(res.data.role);

        if (res.data.role === "farmer") navigate("/farmer");
        if (res.data.role === "service_provider") navigate("/provider");
        if (res.data.role === "retailer") navigate("/retailer");
      }
    } catch (err) {
      alert("Error: " + err.response?.data?.error);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="dashboard-card" style={{ maxWidth: "450px", margin: "auto" }}>
          <h2 className="mb-3 text-center">{isRegister ? "Register" : "Login"}</h2>
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <input className="form-control mb-2" name="name" placeholder="Name"
                  value={form.name} onChange={handleChange} required />
                <select className="form-select mb-2" name="role" value={form.role} onChange={handleChange} required>
                  <option value="">Select Role</option>
                  <option value="farmer">Farmer</option>
                  <option value="service_provider">Service Provider</option>
                  <option value="retailer">Retailer</option>
                </select>
              </>
            )}
            <input className="form-control mb-2" name="email" type="email" placeholder="Email"
              value={form.email} onChange={handleChange} required />
            <input className="form-control mb-2" name="password" type="password" placeholder="Password"
              value={form.password} onChange={handleChange} required />
            <button className="btn btn-success w-100">{isRegister ? "Register" : "Login"}</button>
          </form>
          <button className="btn btn-link mt-3 w-100"
            onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Already have an account? Login" : "New here? Register"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default LoginRegister;