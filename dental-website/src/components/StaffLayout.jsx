import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiLogOut, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';
import { logoutStaff, getStaffUser } from '../api';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
  { label: 'Appointments', path: '/appointments', icon: <FiCalendar /> },
  { label: 'Patients', path: '/patients', icon: <FiUsers /> },
  { label: 'Schedule', path: '/schedule', icon: <FiClock /> },
];

const StaffLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [staffUser, setStaffUser] = useState(null);

  useEffect(() => {
    getStaffUser().then(setStaffUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    logoutStaff();
    navigate('/');
  };

  const getInitials = (user) => {
    if (!user) return 'S';
    const f = user.first_name?.[0] || '';
    const l = user.last_name?.[0] || '';
    return (f + l).toUpperCase() || user.username?.[0]?.toUpperCase() || 'S';
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-[#1e3a8a] text-white flex flex-col flex-shrink-0">

        {/* Logo */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
            <div>
              <h1 className="text-base font-bold leading-tight">Dental Perfections</h1>
              <p className="text-blue-300 text-xs">Staff Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3 px-4">Main Menu</p>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                location.pathname === item.path
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        {/* Staff Info + Logout */}
        <div className="p-4 border-t border-blue-800">
          {staffUser && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {getInitials(staffUser)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">
                  {staffUser.first_name} {staffUser.last_name}
                </p>
                <p className="text-blue-300 text-xs">
                  {staffUser.is_superuser ? 'Admin' : 'Staff'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 hover:bg-blue-800 hover:text-white transition-colors text-sm"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Clinic Management</h2>
          <span className="text-sm text-gray-400">Staff Portal</span>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

    </div>
  );
};

export default StaffLayout;
