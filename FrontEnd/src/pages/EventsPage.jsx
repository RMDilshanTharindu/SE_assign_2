import React, { useState, useEffect } from 'react';
import { request, fmtDate } from '../utils/api';
import Icon from '../components/Icon';

export const EventsPage = ({ token, role }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editEvt, setEditEvt] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', eventDate: '', startTime: '', endTime: '', organizer: '', resources: [] });
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    request('GET', '/api/events', null, token).then(setEvents).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, [token]);

  const openCreate = () => { setForm({ title: '', description: '', eventDate: '', startTime: '', endTime: '', organizer: '', resources: [] }); setEditEvt(null); setModal(true); };
  const openEdit = (e) => { setForm({ title: e.title, description: e.description, eventDate: e.eventDate?.split('T')[0] || '', startTime: e.startTime, endTime: e.endTime, organizer: e.organizer, resources: e.resources || [] }); setEditEvt(e._id); setModal(true); };

  const save = async () => {
    try {
      if (editEvt) await request('PUT', `/api/events/${editEvt}`, form, token);
      else await request('POST', '/api/events', form, token);
      setMsg('Event saved!'); 
      setModal(false); 
      load();
    } catch(e) { 
      setMsg(e.message); 
    }
  };

  const del = async (id) => {
    if (!confirm('Delete event?')) return;
    try { 
      await request('DELETE', `/api/events/${id}`, null, token); 
      setMsg('Deleted.'); 
      load(); 
    } catch(e) { 
      setMsg(e.message); 
    }
  };

  if (loading) return <div className="loader"><div className="spinner"/></div>;

  return (
    <div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="flex-between mb-16">
        <div/>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={openCreate}>
            <Icon name="plus" size={14}/> Publish Event
          </button>
        )}
      </div>
      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editEvt ? 'Edit Event' : 'New Event'}</div>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Organizer</label><input className="form-input" value={form.organizer} onChange={e => setForm({...form, organizer: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Start Time</label><input className="form-input" placeholder="09.00" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">End Time</label><input className="form-input" placeholder="12.00" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} /></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save Event</button>
            </div>
          </div>
        </div>
      )}
      {events.length === 0 ? (
        <div className="empty"><div className="empty-icon">📅</div><div className="empty-title">No events scheduled</div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {events.map(e => (
            <div key={e._id} className="card" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(e)}><Icon name="edit" size={13}/></button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(e._id)}><Icon name="trash" size={13}/></button>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, paddingRight: 60, marginBottom: 8 }}>{e.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>{e.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="badge badge-blue"><Icon name="calendar" size={11}/> {fmtDate(e.eventDate)}</span>
                <span className="badge badge-gray"><Icon name="clock" size={11}/> {e.startTime}–{e.endTime}</span>
                {e.organizer && <span className="badge badge-green">{e.organizer}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default EventsPage;