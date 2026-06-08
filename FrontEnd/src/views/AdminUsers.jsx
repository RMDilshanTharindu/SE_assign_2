import React, { useState, useEffect } from 'react';
import { request } from '../utils/api';
import Icon from '../components/Icon';

const AdminUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [editRole, setEditRole] = useState(null);
  const [newRole, setNewRole] = useState('student');

  const load = () => {
    setLoading(true);
    request('GET', '/api/users', null, token)
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  
  useEffect(load, [token]);

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { 
      await request('DELETE', `/api/users/${id}`, null, token); 
      setMsg('User deleted.'); 
      load(); 
    } catch (e) { 
      setMsg(e.message); 
    }
  };

  const updateRole = async () => {
    try { 
      await request('PATCH', `/api/users/${editRole}/role`, { role: newRole }, token); 
      setMsg('Role updated.'); 
      setEditRole(null); 
      load(); 
    } catch (e) { 
      setMsg(e.message); 
    }
  };

  if (loading) return <div className="loader"><div className="spinner"/></div>;

  return (
    <div>
      {msg && <div className="alert alert-success">{msg}</div>}
      {editRole && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setEditRole(null)}>
          <div className="modal" style={{ maxWidth: 340 }}>
            <div className="modal-header"><div className="modal-title">Change Role</div><button className="modal-close" onClick={() => setEditRole(null)}>×</button></div>
            <div className="form-group">
              <label className="form-label">New Role</label>
              <select className="form-input" value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
                <option value="resource_manager">Resource Manager</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setEditRole(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={updateRole}>Update</button>
            </div>
          </div>
        </div>
      )}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                  <td><span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{u.role?.replace('_', ' ')}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditRole(u._id); setNewRole(u.role); }}><Icon name="edit" size={13}/> Role</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}><Icon name="trash" size={13}/></button>
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

export default AdminUsers;