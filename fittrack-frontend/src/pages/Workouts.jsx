import { useEffect, useState } from 'react';
import api from '../api';
import { useToast } from '../context/ToastContext';
import '../App.css';

const TYPES = ['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Sports', 'Other'];

// Colored initials instead of emojis
const typeInitial = {
  Cardio: 'C', Strength: 'S', Flexibility: 'FL',
  HIIT: 'HI', Sports: 'SP', Other: 'OT',
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm]         = useState({ title: '', type: 'Cardio', duration: '' });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const { show } = useToast();

  useEffect(() => {
    api.getWorkouts()
      .then(setWorkouts)
      .catch(() => setError('Could not load workouts.'))
      .finally(() => setLoading(false));
  }, []);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim())                   { show('Title is required.', 'error');        return; }
    if (!form.duration || form.duration <= 0) { show('Enter a valid duration.', 'error');   return; }
    setSaving(true);
    try {
      const added = await api.addWorkout(form);
      setWorkouts([added, ...workouts]);
      setForm({ title: '', type: 'Cardio', duration: '' });
      show('Workout added!', 'success');
    } catch (e) {
      show(e.message || 'Failed to add workout.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await api.deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w._id !== id));
      show('Workout deleted.', 'info');
    } catch (e) {
      show('Could not delete.', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Workouts</h1>
      <p className="page-subtitle">Track your training sessions</p>

      {/* ── Add form ── */}
      <div className="add-panel">
        <h2 className="add-panel-title">Add a Workout</h2>
        <form onSubmit={handleAdd}>
          <div className="inline-form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                type="text"
                name="title"
                placeholder="e.g. Morning Run"
                value={form.title}
                onChange={update}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" name="type" value={form.type} onChange={update}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input
                className="form-input"
                type="number"
                name="duration"
                placeholder="30"
                value={form.duration}
                onChange={update}
                min="1"
              />
            </div>

            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ height: 42 }}
              >
                {saving ? 'Saving...' : '+ Add'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* ── List ── */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : workouts.length === 0 ? (
        <div className="empty-state">
          <p>No workouts yet. Add your first one above!</p>
        </div>
      ) : (
        <>
          <div className="section-header">
            <span className="section-title">All Workouts</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{workouts.length} sessions</span>
          </div>
          <div className="item-list">
            {workouts.map((w) => (
              <div className="item-row" key={w._id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '10px',
                    background: 'var(--bg-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-light)',
                    letterSpacing: '0.04em', flexShrink: 0,
                  }}>
                    {typeInitial[w.type] || 'OT'}
                  </div>
                  <div className="item-info">
                    <span className="item-title">{w.title}</span>
                    <div className="item-meta">
                      <span className="tag tag-accent">{w.type}</span>
                      <span>{w.duration} min</span>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(w._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
