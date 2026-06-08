import React, { useState, useEffect } from 'react';
import { request } from '../utils/api';
import Icon from '../components/Icon';
import StatusBadge from '../components/StatusBadge';

const ResourcesBrowser = ({ token, onBook }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    request('GET', '/api/resources', null, token)
      .then(setResources)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = resources.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.type?.toLowerCase().includes(search.toLowerCase()) ||
    r.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loader"><div className="spinner"/></div>;

  return (
    <div>
      <div className="flex-between mb-16">
        <div/>
        <input className="form-input" style={{ width: 240 }} placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <div className="empty"><div className="empty-icon">📦</div><div className="empty-title">No resources found</div></div>
      ) : (
        <div className="resource-grid">
          {filtered.map(r => (
            <div key={r._id} className="resource-card">
              <div>
                <div className="resource-name">{r.name}</div>
                <div style={{ marginTop: 4 }}><StatusBadge status={r.status} /></div>
              </div>
              <div className="resource-meta">
                <div className="resource-meta-item"><Icon name="map" size={13}/> {r.location}</div>
                <div className="resource-meta-item"><Icon name="users" size={13}/> Capacity: {r.capacity}</div>
                <div className="resource-meta-item" style={{ fontStyle: 'italic', fontSize: 12 }}>{r.description}</div>
              </div>
              <div className="resource-actions">
                <button className="btn btn-primary btn-sm" disabled={r.status !== 'available'} onClick={() => onBook(r)} style={{ flex: 1, justifyContent: 'center' }}>
                  <Icon name="plus" size={13}/> Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesBrowser;