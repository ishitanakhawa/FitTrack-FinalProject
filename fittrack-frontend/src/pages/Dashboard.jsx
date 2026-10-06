import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../api';
import '../App.css';

/* ── Custom tooltip for the weight chart ── */
const WeightTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#2A2724',
        border: '1px solid #3A3530',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '0.8rem',
        color: '#F2EDE6',
      }}>
        <div style={{ color: 'rgba(242,237,230,0.5)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{payload[0].value} kg</div>
      </div>
    );
  }
  return null;
};

/* ── Custom tooltip for the workout bar chart ── */
const WorkoutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #E5DDD4',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '0.8rem',
        color: '#1A1A1A',
      }}>
        <div style={{ color: '#7A6F65', marginBottom: 2 }}>{payload[0].payload.fullName}</div>
        <div style={{ fontWeight: 700 }}>{payload[0].value} min</div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [summary, setSummary]   = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [metrics, setMetrics]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const name = localStorage.getItem('name') || 'there';

  useEffect(() => {
    const load = async () => {
      try {
        const userId = localStorage.getItem('_id');
        const [sum, wo, met] = await Promise.all([
          api.getSummary('weekly'),
          api.getWorkouts(),
          api.getMetrics(userId),
        ]);
        setSummary(sum);
        setWorkouts(wo);
        setMetrics(met);
      } catch (e) {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="spinner-wrap"><div className="spinner" /></div>
  );

  if (error) return (
    <div className="page-wrapper">
      <div className="error-banner">{error}</div>
    </div>
  );

  /* ── Prepare chart data ── */
  const recentWorkouts = [...workouts].slice(0, 5).reverse();

  // Bar chart — last 7 workouts by duration, show full title (truncate at 12 chars max for label)
  const barData = [...workouts]
    .slice(0, 7)
    .reverse()
    .map((w, i) => ({
      name: w.title?.length > 12 ? w.title.slice(0, 11) + '…' : (w.title || `Day ${i + 1}`),
      fullName: w.title || `Day ${i + 1}`,
      min: w.duration || 0,
    }));

  // Line chart — weight over time from metrics
  const lineData = [...metrics]
    .slice(0, 8)
    .reverse()
    .map((m) => ({
      name: new Date(m.createdAt || m.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      kg: m.weight,
    }));

  const latestWeight = metrics[0]?.weight ?? summary?.latestWeight ?? '--';
  const latestBmi    = metrics[0]?.bmi    ?? summary?.latestBmi    ?? '--';

  // Backend returns totalWorkouts / totalMinutes / totalCalories / personalRecords
  const weeklyWorkouts  = summary?.totalWorkouts  ?? 0;
  const weeklyCalories  = summary?.totalCalories  ?? 0;
  const weeklyMinutes   = summary?.totalMinutes   ?? 0;
  const weeklyPRs       = summary?.personalRecords ?? 0;

  return (
    <div className="page-wrapper">
      {/* ── Greeting ── */}
      <p className="page-subtitle">Welcome back, <strong>{name}</strong></p>
      <h1 className="page-title">Your Dashboard</h1>

      {/* ── Stat cards ── */}
      <div className="stats-grid" style={{ marginTop: 20 }}>
        <div className="stat-card">
          <span className="stat-label">Workouts</span>
          <span className="stat-value">{weeklyWorkouts}</span>
          <span className="stat-unit">this week</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Calories</span>
          <span className="stat-value">{weeklyCalories}</span>
          <span className="stat-unit">kcal</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Minutes</span>
          <span className="stat-value">{weeklyMinutes}</span>
          <span className="stat-unit">total</span>
        </div>
        <div className="stat-card dark">
          <span className="stat-label">Weight</span>
          <span className="stat-value">{latestWeight}</span>
          <span className="stat-unit" style={{ color: 'rgba(242,237,230,0.45)' }}>kg</span>
        </div>
        <div className="stat-card dark">
          <span className="stat-label">BMI</span>
          <span className="stat-value">{typeof latestBmi === 'number' ? latestBmi.toFixed(1) : latestBmi}</span>
          <span className="stat-unit" style={{ color: 'rgba(242,237,230,0.45)' }}>index</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">PRs</span>
          <span className="stat-value">{weeklyPRs}</span>
          <span className="stat-unit">personal records</span>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="charts-grid">

        {/* Weight trend — dark card */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Weight Loss</div>
              <div className="chart-headline">{latestWeight} kg</div>
            </div>
            <span className="chart-badge">Trend</span>
          </div>
          {lineData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={lineData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A3530" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'rgba(242,237,230,0.4)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(242,237,230,0.4)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<WeightTooltip />} />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke="#D4854A"
                  strokeWidth={2.5}
                  dot={{ fill: '#D4854A', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#F0B97D' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>Add at least 2 weight entries to see your trend</p>
            </div>
          )}
        </div>

        {/* Workout duration — light card */}
        <div className="chart-card light">
          <div className="chart-header">
            <div>
              <div className="chart-title" style={{ color: 'var(--text-muted)' }}>Weekly Activity</div>
              <div className="chart-headline" style={{ color: 'var(--text-primary)' }}>
                {weeklyMinutes} min
              </div>
            </div>
            <span className="chart-badge" style={{ background: 'rgba(212,133,74,0.12)', color: 'var(--accent-dark)' }}>
              This week
            </span>
          </div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5DDD4" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#7A6F65', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={48}
                />
                <YAxis
                  tick={{ fill: '#7A6F65', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<WorkoutTooltip />} />
                <Bar
                  dataKey="min"
                  fill="#D4854A"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No workouts yet — add one!</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent workouts dark card ── */}
      <div className="card-dark">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <h2 className="card-title" style={{ margin: 0 }}>Recent Workouts</h2>
          <Link to="/workouts" className="btn btn-ghost btn-sm" style={{ color: 'rgba(242,237,230,0.5)', fontSize: '0.78rem' }}>
            View all →
          </Link>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="empty-state">
            <p>No workouts yet. <Link to="/workouts" style={{ color: 'var(--accent-light)' }}>Add your first one!</Link></p>
          </div>
        ) : (
          <div className="recent-list">
            {recentWorkouts.map((w) => (
              <div className="recent-row" key={w._id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="dot" />
                  <div>
                    <div className="recent-name">{w.title}</div>
                    <div className="recent-meta">{w.type} · {w.duration} min</div>
                  </div>
                </div>
                <span className="tag tag-accent" style={{
                  background: 'rgba(212,133,74,0.15)',
                  color: '#F0B97D',
                  fontSize: '0.7rem',
                }}>
                  {w.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick links ── */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
        <Link to="/workouts" className="btn btn-primary">+ Add Workout</Link>
        <Link to="/metrics"  className="btn btn-outline">+ Add Weight</Link>
        <Link to="/plans"    className="btn btn-outline">Browse Plans</Link>
      </div>
    </div>
  );
}
