import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useToast } from '../context/ToastContext';
import '../App.css';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', height: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { show } = useToast();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim())                                return 'Name is required.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email.';
    if (!form.password || form.password.length < 6)       return 'Password must be at least 6 characters.';
    const h = Number(form.height);
    if (!form.height || h < 50 || h > 300)                return 'Enter a valid height (50–300 cm).';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const data = await api.register(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('_id',   data._id);
      localStorage.setItem('name',  data.name);
      show('Account created!', 'success');
      navigate('/');
    } catch (e) {
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Fit<span>Track</span></div>
        <p className="auth-tagline">Your personal fitness companion.</p>

        <div className="auth-divider" />

        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join FitTrack and start your journey</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Alex Johnson"
              value={form.name}
              onChange={update}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update}
              autoComplete="email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Min. 6 chars"
                value={form.password}
                onChange={update}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                className="form-input"
                type="number"
                name="height"
                placeholder="170"
                value={form.height}
                onChange={update}
                min="50"
                max="300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
