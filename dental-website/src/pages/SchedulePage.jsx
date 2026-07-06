import React, { useState, useEffect } from 'react';
import StaffLayout from '../components/StaffLayout';
import { getAppointments } from '../api';
import { FiClock, FiRefreshCw, FiCalendar } from 'react-icons/fi';

const formatTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':');
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatDateLong = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateShort = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const SchedulePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const today = new Date().toISOString().split('T')[0];

  const todaySchedule = appointments
    .filter(a => a.status === 'CONFIRMED' && a.appointment_date === today)
    .sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''));

  const upcoming = appointments
    .filter(a => a.status === 'CONFIRMED' && a.appointment_date > today)
    .sort((a, b) =>
      a.appointment_date.localeCompare(b.appointment_date) ||
      (a.appointment_time || '').localeCompare(b.appointment_time || '')
    );

  return (
    <StaffLayout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-500 mt-1">{formatDateLong(today)}</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Today */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Today's Appointments</p>
            {todaySchedule.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {todaySchedule.length}
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : todaySchedule.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
              <FiClock className="text-4xl mx-auto mb-3" />
              <p className="font-medium">No appointments scheduled for today</p>
              <p className="text-sm mt-1">Confirmed appointments will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((app, index) => (
                <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Time */}
                  <div className="text-center w-20 flex-shrink-0">
                    <p className="text-blue-900 font-bold text-lg leading-tight">{formatTime(app.appointment_time)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">#{index + 1} of {todaySchedule.length}</p>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-12 bg-blue-100 flex-shrink-0" />

                  {/* Patient */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-11 w-11 rounded-full bg-blue-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {getInitials(app.patient_name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{app.patient_name}</p>
                      <p className="text-sm text-gray-500">{app.service_requested}</p>
                      {app.notes && <p className="text-xs text-gray-400 italic mt-0.5">"{app.notes}"</p>}
                    </div>
                  </div>

                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0">
                    CONFIRMED
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Upcoming Confirmed</p>
            {upcoming.length > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {upcoming.length}
              </span>
            )}
          </div>

          {upcoming.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
              <FiCalendar className="text-3xl mx-auto mb-2" />
              <p className="text-sm">No upcoming confirmed appointments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map(app => (
                <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-5">
                  {/* Date */}
                  <div className="text-center w-20 flex-shrink-0">
                    <p className="text-gray-800 font-bold text-base leading-tight">{formatDateShort(app.appointment_date)}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{formatTime(app.appointment_time)}</p>
                  </div>

                  <div className="w-px h-10 bg-gray-100 flex-shrink-0" />

                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {getInitials(app.patient_name)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{app.patient_name}</p>
                      <p className="text-xs text-gray-500">{app.service_requested}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </StaffLayout>
  );
};

export default SchedulePage;
