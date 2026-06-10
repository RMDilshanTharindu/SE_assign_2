import React, { useState, useEffect } from 'react';
import { request, fmtDate } from '../utils/api';
import Icon from '../components/Icon';

export const AdminPending = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    request('GET', '/api/bookings/admin/pending', null, token).then(setBookings).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, [token]);

  const act = async (id, action) => {
    try {
      await request('PATCH', `/api/bookings/${id}/${action}`, null, token);
      setMsg(`Booking ${action === 'admin-approve' ? 'approved' : 'rejected'}.`);
      load();
    } catch(e) { 
      setMsg(e.message); 
    }
  };

  if (loading) return <div className="loader"><div className="spinner"/></div>;

  return (
    <div>
      {msg && <div className="alert alert-success">{msg}</div>}
      {bookings.length === 0 ? (
        <div className="empty"><div className="empty-icon">✅</div><div className="empty-title">No pending bookings</div><div className="empty-sub">All bookings have been reviewed</div></div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Resource</th><th>Date</th><th>Time</th><th>Purpose</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td><strong>{b.user?.name}</strong><br/><span style={{ color: 'var(--muted)', fontSize: 12 }}>{b.user?.email}</span></td>
                    <td>{b.resource?.name}</td>
                    <td>{fmtDate(b.bookingDate)}</td>
                    <td>{b.startTime}–{b.endTime}</td>
                    <td style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.purpose}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => act(b._id, 'admin-approve')}><Icon name="check" size={13}/> Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => act(b._id, 'admin-reject')}><Icon name="x" size={13}/> Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPending;