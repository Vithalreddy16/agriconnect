import React from "react";
import { Link } from "react-router-dom";
import Chatbot from "./Chatbot";

function Layout({ children }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">AgriConnect</Link>
          <div>
            {localStorage.getItem("role") && (
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mt-4">{children}</main>

      <footer>
        <p>🌱 AgriConnect — Empowering Farmers, Providers & Retailers</p>
      </footer>

      <Chatbot />
    </div>
  );
}

export default Layout;