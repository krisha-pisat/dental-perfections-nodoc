import React, { useState, useEffect, useCallback } from 'react';
import StaffLayout from '../components/StaffLayout';
import { getAppointments, updateAppointmentStatus } from '../api';
import { FiRefreshCw, FiCheck, FiX, FiClock, FiCalendar, FiAlertCircle } from 'react-icons/fi';

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':');
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [actionId, setActionId] = useState(null);
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getCount = (status) =>
    status === 'ALL' ? appointments.length : appointments.filter(a => a.status === status).length;

  const filtered = activeTab === 'ALL'
    ? appointments
    : appointments.filter(a => a.status === activeTab);

  const handleConfirm = async (id) => {
    if (!dateTime.date || !dateTime.time) { alert('Please select both a date and time.'); return; }
    setSaving(true);
    try {
      await updateAppointmentStatus(id, 'CONFIRMED', dateTime.date, dateTime.time);
      setActionId(null);
      setDateTime({ date: '', time: '' });
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await updateAppointmentStatus(id, 'CANCELLED');
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateAppointmentStatus(id, 'COMPLETED');
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <StaffLayout>
      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-500 mt-1">Manage all patient appointment requests</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
            <FiAlertCircle /> {error}
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab} ({getCount(tab)})
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <FiCalendar className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} appointments found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(app => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-5">

                  {/* Left: patient + details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-11 w-11 rounded-full bg-blue-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {app.patient_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{app.patient_name}</p>
                        <p className="text-xs text-gray-400">@{app.patient_username}</p>
                      </div>
                      <span className={`ml-1 px-2.5 py-1 text-xs font-bold uppercase rounded-full ${STATUS_STYLES[app.status]}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Service</p>
                        <p className="font-medium text-gray-800">{app.service_requested}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Scheduled For</p>
                        <p className="font-medium text-gray-800">
                          {app.appointment_date
                            ? `${formatDate(app.appointment_date)} · ${formatTime(app.appointment_time)}`
                            : 'Not assigned yet'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Requested On</p>
                        <p className="font-medium text-gray-800">{formatDate(app.created_at)}</p>
                      </div>
                      {app.notes && (
                        <div className="col-span-2 md:col-span-3">
                          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Patient Notes</p>
                          <p className="text-gray-600 italic">"{app.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    {app.status === 'PENDING' && (
                      <>
                        {actionId === app.id ? (
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Assign Slot</p>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Date</label>
                              <input
                                type="date"
                                value={dateTime.date}
                                onChange={e => setDateTime(p => ({ ...p, date: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Time</label>
                              <input
                                type="time"
                                value={dateTime.time}
                                onChange={e => setDateTime(p => ({ ...p, time: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConfirm(app.id)}
                                disabled={saving}
                                className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-1"
                              >
                                <FiCheck /> {saving ? 'Saving...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setActionId(null)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
                              >
                                <FiX />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setActionId(app.id); setDateTime({ date: '', time: '' }); }}
                            className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                          >
                            <FiCalendar /> Confirm & Schedule
                          </button>
                        )}
                        <button
                          onClick={() => handleCancel(app.id)}
                          className="border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                        >
                          <FiX /> Cancel Request
                        </button>
                      </>
                    )}
                    {app.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleComplete(app.id)}
                        className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                      >
                        <FiCheck /> Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default AppointmentsPage;
