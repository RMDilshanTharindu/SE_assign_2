import React, { useState } from 'react';
import { request } from '../utils/api';

const AuthPage = ({ onLogin }) => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    setError('');
    setLoading(true);
    try {
      const path = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : form;

      const data = await request('POST', path, body);

      localStorage.setItem('crms_token', data.token);
      localStorage.setItem('crms_user', JSON.stringify(data));

      onLogin(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-glow" />

      <div className="auth-card-modern">
        {/* LEFT SIDE BRAND */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-logo">CampusRMS</div>
            <p className="auth-tagline">
              Smart Campus Resource Management System
            </p>
          </div>

          <div className="auth-illustration">
            🎓
          </div>

          <p className="auth-note">
            Manage bookings, approvals, and resources in one place.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="auth-right">
          <div className="auth-tabs">
            <button
              className={tab === 'login' ? 'tab active' : 'tab'}
              onClick={() => setTab('login')}
            >
              Sign In
            </button>
            <button
              className={tab === 'register' ? 'tab active' : 'tab'}
              onClick={() => setTab('register')}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {tab === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@university.edu"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label>Role</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
                <option value="resource_manager">Resource Manager</option>
              </select>
            </div>
          )}

          <button
            className="auth-btn"
            onClick={handle}
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : tab === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;