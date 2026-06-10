export const API = 'http://localhost:5000';

export const request = async (method, path, body, token) => {
  const opts = {
    method,
    headers: { 
      'Content-Type': 'application/json', 
      ...(token ? { Authorization: `Bearer ${token}` } : {}) 
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  };
  const r = await fetch(API + path, opts);
  const data = await r.json();
  if (!r.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const fmtDate = (d) => 
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';