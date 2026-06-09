import React, { useState, useEffect } from 'react';
import { request, fmtDate } from '../utils/api';
import StatusBadge from '../components/StatusBadge';

export const Dashboard = ({ user, token }) => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    request('GET', '/api/resources', null, token).then(setResources).catch(() => {});
    if (user.role === 'student' || user.role === 'lecturer') {
      request('GET', '/api/bookings/my-bookings', null, token).then(setBookings).catch(() => {});
    }
    request('GET', '/api/events', null, token).then(setEvents).catch(() => {});
  }, [token, user.role]);

  const available = resources.filter(r => r.status === 'available').length;
  const pending = bookings.filter(b => b.finalStatus === 'pending').length;
  const approved = bookings.filter(b => b.finalStatus === 'approved').length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Resources</div>
          <div className="stat-val">{resources.length}</div>
          <span className="stat-badge badge-green">{available} available</span>
        </div>
        {(user.role === 'student' || user.role === 'lecturer') && <>
          <div className="stat-card">
            <div className="stat-label">My Bookings</div>
            <div className="stat-val">{bookings.length}</div>
            <span className="stat-badge badge-amber">{pending} pending</span>
          </div>
          <div className="stat-card">
            <div className="stat-label">Approved</div>
            <div className="stat-val">{approved}</div>
            <span className="stat-badge badge-green">confirmed</span>
          </div>
        </>}
        <div className="stat-card">
          <div className="stat-label">Events</div>
          <div className="stat-val">{events.length}</div>
          <span className="stat-badge badge-blue">upcoming</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Recent Resources</div>
          {resources.slice(0, 4).map(r => (
            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div><div style={{ fontWeight: 500, fontSize: 13.5 }}>r.name</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.location}</div></div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Upcoming Events</div>
          {events.slice(0, 4).map(e => (
            <div key={e._id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 500, fontSize: 13.5 }}>{e.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{fmtDate(e.eventDate)} · {e.organizer}</div>
            </div>
          ))}
          {events.length === 0 && <div className="empty-sub" style={{ textAlign: 'left' }}>No events yet</div>}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;