import { useEffect, useRef, useState } from 'react';
import api, { BASE_URL } from '../api';
import { useToast } from '../context/ToastContext';
import '../App.css';

const bmiCategory = (bmi) => {
  if (!bmi) return { label: 'N/A', cls: '' };
  if (bmi < 18.5) return { label: 'Underweight', cls: 'bmi-under' };
  if (bmi < 25)   return { label: 'Normal',      cls: 'bmi-normal' };
  if (bmi < 30)   return { label: 'Overweight',  cls: 'bmi-over' };
  return           { label: 'Obese',             cls: 'bmi-obese' };
};

export default function Metrics() {
  const [metrics, setMetrics] = useState([]);
  const [form, setForm]       = useState({ weight: '', height: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const fileRefs              = useRef({});
  const { show } = useToast();

  useEffect(() => {
    const userId = localStorage.getItem('_id');
    api.getMetrics(userId)
      .then(setMetrics)
      .catch(() => setError('Could not load metrics.'))
      .finally(() => setLoading(false));
  }, []);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.weight || form.weight <= 0) { show('Enter a valid weight.', 'error'); return; }
    if (!form.height || form.height <= 0) { show('Enter a valid height.', 'error'); return; }
    setSaving(true);
    try {
      const added = await api.addMetric(form);
      setMetrics([added, ...metrics]);
      setForm({ weight: '', height: '' });
      show('Measurement saved!', 'success');
    } catch (e) {
      show(e.message || 'Failed to save metric.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (id, file) => {
    if (!file) return;
    try {
      const updated = await api.uploadPhoto(id, file);
      setMetrics(metrics.map((m) => (m._id === id ? { ...m, photoUrl: updated.photoUrl } : m)));
      show('Photo uploaded!', 'success');
    } catch (e) {
      show('Upload failed.', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Metrics</h1>
      <p className="page-subtitle">Track your weight and BMI over time</p>

      {/* ── Add form ── */}
      <div className="add-panel">
        <h2 className="add-panel-title">New Measurement</h2>
        <form onSubmit={handleAdd}>
          <div className="inline-form">
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                className="form-input"
                type="number"
                name="weight"
                placeholder="72"
                value={form.weight}
                onChange={update}
                step="0.1"
                min="1"
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
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ height: 42 }}
              >
                {saving ? 'Saving...' : '+ Save'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* ── Grid ── */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : metrics.length === 0 ? (
        <div className="empty-state">
          <p>No measurements yet. Add your first one above!</p>
        </div>
      ) : (
        <>
          <div className="section-header">
            <span className="section-title">History</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{metrics.length} entries</span>
          </div>
          <div className="metrics-grid">
            {metrics.map((m) => {
              const { label, cls } = bmiCategory(m.bmi);
              const dateStr = new Date(m.createdAt || m.date).toLocaleDateString('en', {
                month: 'short', day: 'numeric', year: 'numeric',
              });
              return (
                <div className="metric-card" key={m._id}>
                  {/* Photo */}
                  {m.photoUrl ? (
                    <img
                      className="metric-photo"
                      src={m.photoUrl}
                      alt="Progress"
                    />
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={(el) => { fileRefs.current[m._id] = el; }}
                        onChange={(e) => handleUpload(m._id, e.target.files[0])}
                      />
                      <div
                        className="upload-btn"
                        onClick={() => fileRefs.current[m._id]?.click()}
                      >
                        Add progress photo
                      </div>
                    </>
                  )}

                  <div className="metric-weight">
                    {m.weight} <span style={{ fontSize: '1rem', fontWeight: 500 }}>kg</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      BMI {typeof m.bmi === 'number' ? m.bmi.toFixed(1) : '--'}
                    </span>
                    {cls && <span className={`metric-bmi ${cls}`}>{label}</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="metric-date">{dateStr}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {m.height} cm
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
