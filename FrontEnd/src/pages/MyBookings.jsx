import React, { useState, useEffect } from 'react';
import { request, fmtDate } from '../utils/api';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';

export const MyBookings = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    request('GET', '/api/bookings/my-bookings', null, token).then(setBookings).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await request('DELETE', `/api/bookings/${id}`, null, token);
      setMsg('Booking cancelled.');
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
        <div className="empty"><div className="empty-icon">📅</div><div className="empty-title">No bookings yet</div><div className="empty-sub">Browse resources to make your first booking</div></div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Resource</th><th>Date</th><th>Time</th><th>Purpose</th><th>Admin</th><th>Manager</th><th>Final</th><th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td><strong>{b.resource?.name || 'Unknown'}</strong><br/><span style={{ color: 'var(--muted)', fontSize: 12 }}>{b.resource?.location}</span></td>
                    <td>{fmtDate(b.bookingDate)}</td>
                    <td><Icon name="clock" size={12}/> {b.startTime}–{b.endTime}</td>
                    <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.purpose}</td>
                    <td><StatusBadge status={b.adminStatus} /></td>
                    <td><StatusBadge status={b.managerStatus} /></td>
                    <td><StatusBadge status={b.finalStatus} /></td>
                    <td>
                      {b.finalStatus === 'pending' && (
                        <button className="btn btn-danger btn-sm btn-icon" title="Cancel" onClick={() => cancel(b._id)}><Icon name="trash" size={13}/></button>
                      )}
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
export default MyBookings;