import React, { useState, useEffect } from 'react';
import { request } from '../utils/api';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';

// Temporary helper if you haven't moved fmtDate to a utility file yet
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '-';

const ManagerPending = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    request('GET', '/api/bookings/manager/pending', null, token)
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const act = async (id, action) => {
    try { 
      await request('PATCH', `/api/bookings/${id}/${action}`, null, token); 
      setMsg('Done.'); 
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
        <div className="empty">
          <div className="empty-icon">✅</div>
          <div className="empty-title">No pending requests</div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Resource</th>
                  <th>Date & Time</th>
                  <th>Purpose</th>
                  <th>Admin Status</th>
                  <th>Manager Status</th>
                  <th>Final Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td>
                      <strong>{b.user?.name || 'Unknown'}</strong>
                      <br/>
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}>{b.user?.email || '-'}</span>
                    </td>
                    <td><strong>{b.resource?.name || 'Unknown'}</strong></td>
                    <td>
                      {fmtDate(b.bookingDate)}
                      <br/>
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}>{b.startTime}–{b.endTime}</span>
                    </td>
                    <td style={{ maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.purpose}
                    </td>
                    <td><StatusBadge status={b.adminStatus} /></td>
                    <td><StatusBadge status={b.managerStatus} /></td>
                    <td><StatusBadge status={b.finalStatus} /></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => act(b._id, 'manager-approve')}>
                          <Icon name="check" size={13}/> Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => act(b._id, 'manager-reject')}>
                          <Icon name="x" size={13}/> Reject
                        </button>
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

export default ManagerPending;