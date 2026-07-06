import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getStaffUser } from '../api';

const ProtectedStaffRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'allowed' | 'denied'

  useEffect(() => {
    const token = localStorage.getItem('staff_access_token');
    if (!token) {
      setStatus('denied');
      return;
    }
    getStaffUser()
      .then(user => {
        if (user.is_staff) setStatus('allowed');
        else setStatus('denied');
      })
      .catch(() => setStatus('denied'));
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verifying access...</p>
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/staff-login" replace />;
  }

  return children;
};

export default ProtectedStaffRoute;
