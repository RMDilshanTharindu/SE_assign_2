import React, { useState, useEffect } from 'react';
import { request } from '../utils/api';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';

const ManagerResources = ({ token }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); 
  const [form, setForm] = useState({ name: '', type: '', location: '', capacity: '', description: '', status: 'available' });
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    request('GET', '/api/resources', null, token)
      .then(setResources)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  
  useEffect(load, [token]);

  const openCreate = () => { 
    setForm({ name: '', type: '', location: '', capacity: '', description: '', status: 'available' }); 
    setModal('create'); 
  };
  
  const openEdit = (r) => { 
    setForm({ name: r.name, type: r.type, location: r.location, capacity: r.capacity, description: r.description, status: r.status }); 
    setModal(r._id); 
  };

  const save = async () => {
    try {
      const body = { ...form, capacity: Number(form.capacity) };
      if (modal === 'create') await request('POST', '/api/resources', body, token);
      else await request('PUT', `/api/resources/${modal}`, body, token);
      setMsg('Saved successfully!'); 
      setModal(null); 
      load();
    } catch (e) { 
      setMsg(e.message); 
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try { 
      await request('DELETE', `/api/resources/${id}`, null, token); 
      setMsg('Deleted.'); 
      load(); 
    } catch (e) { 
      setMsg(e.message); 
    }
  };

  if (loading) return <div className="loader"><div className="spinner"/></div>;

  return (
    <div>
      <div className="flex-between mb-16">
        {msg && <div className="alert alert-success">{msg}</div>}
        <button className="btn btn-primary" onClick={openCreate}><Icon name="plus"/> Add Resource</button>
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{modal === 'create' ? 'Add Resource' : 'Edit Resource'}</div>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <input className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="e.g. Lab, Hall" />
              </div>
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input className="form-input" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Resource</th><th>Type</th><th>Location</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {resources.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.type}</td>
                  <td>{r.location}</td>
                  <td>{r.capacity}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}><Icon name="edit" size={13}/></button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(r._id)}><Icon name="trash" size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerResources;