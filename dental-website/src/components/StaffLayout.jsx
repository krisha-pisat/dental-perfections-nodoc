import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiLogOut } from 'react-icons/fi';
import { logoutStaff } from '../api';

const StaffLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutStaff();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-[#1e3a8a] text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3 mb-1">
            <img src="/logo.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h1 className="text-base font-bold leading-tight">Dental Perfections</h1>
              <p className="text-blue-300 text-xs">Staff Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
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

        <div className="p-4 border-t border-blue-800">
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
