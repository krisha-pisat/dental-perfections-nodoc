import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../components/StaffLayout';
import { getPatients, getAppointments } from '../api';
import { FiUsers, FiClock, FiCheckCircle, FiCalendar, FiArrowRight, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientData, appointmentData] = await Promise.all([getPatients(), getAppointments()]);
      setPatients(patientData);
      setAppointments(appointmentData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const today = new Date().toISOString().split('T')[0];
  const pending = appointments.filter(a => a.status === 'PENDING');
  const confirmedToday = appointments.filter(a => a.status === 'CONFIRMED' && a.appointment_date === today);
  const completed = appointments.filter(a => a.status === 'COMPLETED');

  const stats = [
    {
      label: 'Total Patients',
      value: patients.length,
      icon: <FiUsers />,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      text: 'text-blue-700',
      link: '/patients',
    },
    {
      label: 'Pending Requests',
      value: pending.length,
      icon: <FiClock />,
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      text: 'text-yellow-700',
      link: '/appointments',
    },
    {
      label: 'Confirmed Today',
      value: confirmedToday.length,
      icon: <FiCalendar />,
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      text: 'text-green-700',
      link: '/schedule',
    },
    {
      label: 'Completed',
      value: completed.length,
      icon: <FiCheckCircle />,
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      text: 'text-purple-700',
      link: '/appointments',
    },
  ];

  return (
    <StaffLayout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
            <FiAlertCircle /> {error}
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map(stat => (
            <Link to={stat.link} key={stat.label} className={`${stat.bg} ${stat.text} rounded-xl p-5 hover:shadow-md transition-shadow`}>
              <div className={`${stat.iconBg} h-10 w-10 rounded-lg flex items-center justify-center text-lg mb-3`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold">{loading ? '—' : stat.value}</div>
              <div className="text-sm font-medium mt-1 opacity-80">{stat.label}</div>
            </Link>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pending Appointments */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiClock className="text-yellow-500" /> Pending Requests
                {pending.length > 0 && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
                )}
              </h2>
              <Link to="/appointments" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                Manage all <FiArrowRight />
              </Link>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {loading ? (
                <p className="text-gray-400 text-sm text-center py-6">Loading...</p>
              ) : pending.length > 0 ? (
                pending.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 text-xs font-bold flex-shrink-0">
                        {app.patient_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{app.patient_name}</p>
                        <p className="text-xs text-gray-500">{app.service_requested}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-bold flex-shrink-0">PENDING</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiCheckCircle className="text-3xl text-green-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">All clear — no pending requests.</p>
                </div>
              )}
            </div>
          </div>

          {/* Patient List Preview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FiUsers className="text-blue-500" /> Patients
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{patients.length}</span>
              </h2>
              <Link to="/patients" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                View all <FiArrowRight />
              </Link>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {loading ? (
                <p className="text-gray-400 text-sm text-center py-6">Loading...</p>
              ) : patients.length > 0 ? (
                patients.slice(0, 6).map(patient => (
                  <div key={patient.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(patient.user?.first_name?.[0] || '') + (patient.user?.last_name?.[0] || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {patient.user?.first_name} {patient.user?.last_name}
                      </p>
                      <p className="text-xs text-gray-400">@{patient.user?.username} · {patient.history?.length || 0} visits</p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(patient.added_date)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">No patients registered yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </StaffLayout>
  );
};

export default DoctorDashboard;
