import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workouts from "./pages/Workouts";
import Plans from "./pages/Plans";
import Metrics from "./pages/Metrics";
import "./App.css";

// Defined outside App so it isn't recreated on every render
function Private({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function NotFound() {
  return (
    <div className="page">
      <div className="empty-state" style={{ marginTop: 60 }}>
        <h3>Page not found</h3>
        <p className="muted">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn" style={{ marginTop: 16, display: "inline-flex" }}>
          Go Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Private><Dashboard /></Private>} />
          <Route path="/workouts" element={<Private><Workouts /></Private>} />
          <Route path="/plans"    element={<Private><Plans /></Private>} />
          <Route path="/metrics"  element={<Private><Metrics /></Private>} />
          <Route path="*"         element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
