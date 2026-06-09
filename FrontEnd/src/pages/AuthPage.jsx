import React, { useState } from 'react';
import { request } from '../utils/api';

export const AuthPage = ({ onLogin }) => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    setError(''); 
    setLoading(true);
    try {
      const path = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login' ? { email: form.email, password: form.password } : form;
      const data = await request('POST', path, body);
      localStorage.setItem('crms_token', data.token);
      localStorage.setItem('crms_user', JSON.stringify(data));
      onLogin(data);
    } catch(e) { 
      setError(e.message); 
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">CampusRMS</div>
        <div className="auth-sub">Campus Resource Management System</div>
        <div className="auth-tab">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Sign In</button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>Register</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {tab === 'register' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@university.edu" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
        </div>
        {tab === 'register' && (
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
              <option value="resource_manager">Resource Manager</option>
            </select>
          </div>
        )}
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading} onClick={handle}>
          {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
};
export default AuthPage;