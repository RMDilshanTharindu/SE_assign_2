import React, { useState, useEffect } from 'react';
import AuthPage from './views/AuthPage';
import ResourcesBrowser from './views/ResourcesBrowser';
import MyBookings from './views/MyBookings';
import AdminPending from './views/AdminPending';
import AdminUsers from './views/AdminUsers';
import ManagerResources from './views/ManagerResources';
import BookModal from './components/BookModal';
import Icon from './components/Icon';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [view, setView] = useState('browse'); 
  const [bookingTarget, setBookingTarget] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('crms_token');
    const savedUser = localStorage.getItem('crms_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (authData) => {
    setToken(authData.token);
    setUser(authData);
    setView('browse');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setToken('');
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <div className="app">
      {/* Sidebar Component */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span>University</span>CampusRMS
        </div>
        <div className="sidebar-nav">
          <div className="nav-section">General</div>
          <div className={`nav-item ${view === 'browse' ? 'active' : ''}`} onClick={() => setView('browse')}>
            <Icon name="box"/> Browse Resources
          </div>
          <div className={`nav-item ${view === 'my-bookings' ? 'active' : ''}`} onClick={() => setView('my-bookings')}>
            <Icon name="calendar"/> My Bookings
          </div>

          {/* Conditional Admin Panels */}
          {user.role === 'admin' && (
            <>
              <div className="nav-section">Admin Portal</div>
              <div className={`nav-item ${view === 'admin-pending' ? 'active' : ''}`} onClick={() => setView('admin-pending')}>
                <Icon name="check"/> Review Bookings
              </div>
              <div className={`nav-item ${view === 'admin-users' ? 'active' : ''}`} onClick={() => setView('admin-users')}>
                <Icon name="users"/> Manage Users
              </div>
            </>
          )}

          {/* Conditional Resource Manager Panels */}
          {user.role === 'resource_manager' && (
            <>
              <div className="nav-section">Management</div>
              <div className={`nav-item ${view === 'manager-resources' ? 'active' : ''}`} onClick={() => setView('manager-resources')}>
                <Icon name="edit"/> Resources Inventory
              </div>
            </>
          )}
        </div>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role?.replace('_', ' ')}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Sign Out">
              <Icon name="logout" size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Content Routing */}
      <div className="main">
        <div className="page-header">
          <h1 className="page-title">
            {view === 'browse' && 'Explore Resources'}
            {view === 'my-bookings' && 'Your Bookings'}
            {view === 'admin-pending' && 'Pending Approvals'}
            {view === 'admin-users' && 'User Access Management'}
            {view === 'manager-resources' && 'Inventory Control Center'}
          </h1>
          <p className="page-sub">Signed in as workspace operator.</p>
        </div>

        {view === 'browse' && <ResourcesBrowser token={token} onBook={(res) => setBookingTarget(res)} />}
        {view === 'my-bookings' && <MyBookings token={token} />}
        {view === 'admin-pending' && <AdminPending token={token} />}
        {view === 'admin-users' && <AdminUsers token={token} />}
        {view === 'manager-resources' && <ManagerResources token={token} />}
      </div>

      {/* Shared Modal Layer */}
      {bookingTarget && (
        <BookModal 
          resource={bookingTarget} 
          token={token} 
          onClose={() => setBookingTarget(null)} 
          onDone={() => { setBookingTarget(null); setView('my-bookings'); }} 
        />
      )}
    </div>
  );
};

export default App;