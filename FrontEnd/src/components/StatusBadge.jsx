import React from 'react';

const StatusBadge = ({ status }) => {
  const map = { 
    available: 'badge-green', 
    maintenance: 'badge-amber', 
    unavailable: 'badge-red', 
    pending: 'badge-amber', 
    approved: 'badge-green', 
    rejected: 'badge-red' 
  };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
};

export default StatusBadge;