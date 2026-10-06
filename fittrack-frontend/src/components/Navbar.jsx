import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const syncName = () => setName(localStorage.getItem('name') || '');

  useEffect(() => {
    syncName();
    window.addEventListener('storage', syncName);
    window.addEventListener('focus', syncName);
    return () => {
      window.removeEventListener('storage', syncName);
      window.removeEventListener('focus', syncName);
    };
  }, []);

  const isLoggedIn = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        Fit<span>Track</span>
      </NavLink>

      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <NavLink to="/"         end>Home</NavLink>
            <NavLink to="/workouts">Workouts</NavLink>
            <NavLink to="/plans">Plans</NavLink>
            <NavLink to="/metrics">Metrics</NavLink>
            {name && <span className="navbar-greeting">· {name}</span>}
            <button className="btn-logout" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
