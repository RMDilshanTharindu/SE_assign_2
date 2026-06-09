import React, { useState } from 'react';
import Icon from './components/Icon';
import BookModal from './components/BookModal';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ResourcesBrowser from './pages/ResourcesBrowser';
import MyBookings from './pages/MyBookings';
import EventsPage from './pages/EventsPage';
import AdminPending from './pages/AdminPending';
import AdminUsers from './pages/AdminUsers';
import ManagerResources from './pages/ManagerResources';
import ManagerPending from './pages/ManagerPending';

export const App = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crms_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('crms_token') || '');
  const [page, setPage] = useState('dashboard');
  const [bookingResource, setBookingResource] = useState(null);

  const login = (data) => { setUser(data); setToken(data.token); setPage('dashboard'); };
  const logout = () => { localStorage.removeItem('crms_token'); localStorage.removeItem('crms_user'); setUser(null); setToken(''); };

  if (!user) return <AuthPage onLogin={login} />;

  const role = user.role;
  const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', roles: ['student', 'lecturer', 'admin', 'resource_manager'] },
    { id: 'resources', label: 'Browse Resources', icon: 'box', roles: ['student', 'lecturer'] },
    { id: 'my-bookings', label: 'My Bookings', icon: 'calendar', roles: ['student', 'lecturer'] },
    { id: 'events', label: 'Events', icon: 'event', roles: ['student', 'lecturer', 'admin', 'resource_manager'] },
    { id: 'admin-pending', label: 'Pending Approvals', icon: 'shield', roles: ['admin'] },
    { id: 'admin-users', label: 'Manage Users', icon: 'users', roles: ['admin'] },
    { id: 'manager-resources', label: 'Manage Resources', icon: 'box', roles: ['resource_manager'] },
    { id: 'manager-pending', label: 'Booking Queue', icon: 'clock', roles: ['resource_manager'] },
  ].filter(n => n.roles.includes(role));

  const pageTitles = {
    dashboard: 'Dashboard',
    resources: 'Browse Resources',
    'my-bookings': 'My Bookings',
    events: 'Campus Events',
    'admin-pending': 'Pending Approvals',
    'admin-users': 'User Management',
    'manager-resources': 'Resource Inventory',
    'manager-pending': 'Booking Authorization Queue',
  };

  const pageSubtitles = {
    dashboard: `Welcome back, ${user.name}`,
    resources: 'Find and book available campus spaces and labs',
    'my-bookings': 'Track the status of your submitted booking requests',
    events: 'View and manage campus event notices',
    'admin-pending': 'Review and approve or reject incoming booking requests',
    'admin-users': 'Manage user accounts and role assignments',
    'manager-resources': 'Add, edit, and manage campus resource inventory',
    'manager-pending': 'Final authorization stage for admin-approved bookings',
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>System</span>
          CampusRMS
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div key={item.id} className={`nav-item${page === item.id ? ' active' : ''}`} onClick={() => setPage(item.id)}>
              <Icon name={item.icon} size={15}/> {item.label}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{role.replace('_', ' ')}</div>
            </div>
            <button className="logout-btn" title="Sign out" onClick={logout}>
              <Icon name="logout" size={13}/>
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="page-header">
          <div className="page-title">{pageTitles[page]}</div>
          <div className="page-sub">{pageSubtitles[page]}</div>
        </div>

        {page === 'dashboard' && <Dashboard user={user} token={token} />}
        {page === 'resources' && (
          <>
            <ResourcesBrowser token={token} onBook={r => setBookingResource(r)} />
            {bookingResource && (
              <BookModal
                resource={bookingResource}
                token={token}
                onClose={() => setBookingResource(null)}
                onDone={() => { setBookingResource(null); setPage('my-bookings'); }}
              />
            )}
          </>
        )}
        {page === 'my-bookings' && <MyBookings token={token} />}
        {page === 'events' && <EventsPage token={token} role={role} />}
        {page === 'admin-pending' && <AdminPending token={token} />}
        {page === 'admin-users' && <AdminUsers token={token} />}
        {page === 'manager-resources' && <ManagerResources token={token} />}
        {page === 'manager-pending' && <ManagerPending token={token} />}
      </main>
    </div>
  );
};
export default App;