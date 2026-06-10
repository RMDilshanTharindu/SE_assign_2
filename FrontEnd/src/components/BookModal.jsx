import React, { useState } from 'react';
import { request } from '../utils/api';

export const BookModal = ({ resource, token, onClose, onDone }) => {
  const [form, setForm] = useState({ bookingDate: '', startTime: '', endTime: '', purpose: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError(''); 
    setLoading(true);
    try {
      await request('POST', '/api/bookings', { resource: resource._id, ...form }, token);
      onDone();
    } catch(e) { 
      setError(e.message); 
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Book: {resource.name}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={form.bookingDate} onChange={e => setForm({...form, bookingDate: e.target.value})} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input className="form-input" placeholder="09.00" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">End Time</label>
            <input className="form-input" placeholder="11.00" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Purpose</label>
          <textarea className="form-input" rows={3} value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} placeholder="What is this booking for?" />
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={loading} onClick={submit}>{loading ? 'Booking...' : 'Confirm Booking'}</button>
        </div>
      </div>
    </div>
  );
};
export default BookModal;