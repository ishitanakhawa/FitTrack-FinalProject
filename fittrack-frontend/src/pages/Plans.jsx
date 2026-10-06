import { useEffect, useState } from 'react';
import api from '../api';
import { useToast } from '../context/ToastContext';
import '../App.css';

const CATEGORIES = ['Beginner', 'Intermediate', 'Advanced', 'Weight Loss', 'Muscle Gain', 'Cardio', 'Flexibility'];

const categoryInitial = {
  Beginner: 'BG', Intermediate: 'IN', Advanced: 'AD',
  'Weight Loss': 'WL', 'Muscle Gain': 'MG', Cardio: 'CA', Flexibility: 'FL',
};

export default function Plans() {
  const [plans, setPlans]         = useState([]);
  const [form, setForm]           = useState({ title: '', category: 'Beginner' });
  const [query, setQuery]         = useState('');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [following, setFollowing] = useState(null);
  const [error, setError]         = useState('');
  const { show } = useToast();

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await api.getPlans?.() || [];
      setPlans(data);
    } catch {
      setError('Could not load plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPlans(); }, []);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { show('Plan title is required.', 'error'); return; }
    setSaving(true);
    try {
      const created = await api.addPlan(form);
      setPlans([created, ...plans]);
      setForm({ title: '', category: 'Beginner' });
      show('Plan created!', 'success');
    } catch (e) {
      show(e.message || 'Failed to create plan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) { loadPlans(); return; }
    setLoading(true);
    try {
      const results = await api.searchPlans(query);
      setPlans(results);
    } catch {
      show('Search failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (id) => {
    setFollowing(id);
    try {
      await api.followPlan(id);
      show("You're now following this plan!", 'success');
      // refresh so follower count updates
      loadPlans();
    } catch (e) {
      show(e.message || 'Could not follow plan.', 'error');
    } finally {
      setFollowing(null);
    }
  };

  const handleReset = () => {
    setQuery('');
    loadPlans();
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Plans</h1>
      <p className="page-subtitle">Create and follow workout plans</p>

      <div className="two-col" style={{ marginBottom: 28 }}>
        {/* ── Create plan ── */}
        <div className="add-panel" style={{ marginBottom: 0 }}>
          <h2 className="add-panel-title">Create a Plan</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Plan Title</label>
              <input
                className="form-input"
                type="text"
                name="title"
                placeholder="e.g. 30-Day Fat Burn"
                value={form.title}
                onChange={update}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={form.category} onChange={update}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {saving ? 'Creating...' : '+ Create Plan'}
            </button>
          </form>
        </div>

        {/* ── Search ── */}
        <div className="add-panel" style={{ marginBottom: 0 }}>
          <h2 className="add-panel-title">Search Plans</h2>
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label className="form-label">Keyword</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. cardio, strength..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-dark" style={{ flex: 1, justifyContent: 'center' }}>
                Search
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleReset}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* ── Plans list ── */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : plans.length === 0 ? (
        <div className="empty-state">
          <p>No plans found. Create one above!</p>
        </div>
      ) : (
        <>
          <div className="section-header">
            <span className="section-title">All Plans</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plans.length} plans</span>
          </div>
          <div className="item-list">
            {plans.map((p) => {
              const followerCount = Array.isArray(p.followers) ? p.followers.length : (p.followers ?? 0);
              return (
                <div className="item-row" key={p._id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: '10px',
                      background: 'var(--bg-dark)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-light)',
                      letterSpacing: '0.04em', flexShrink: 0,
                    }}>
                      {categoryInitial[p.category] || 'PL'}
                    </div>
                    <div className="item-info">
                      <span className="item-title">{p.title}</span>
                      <div className="item-meta">
                        <span className="tag tag-accent">{p.category}</span>
                        <span>{followerCount} {followerCount === 1 ? 'follower' : 'followers'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleFollow(p._id)}
                    disabled={following === p._id}
                    style={{ flexShrink: 0 }}
                  >
                    {following === p._id ? '...' : '+ Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
