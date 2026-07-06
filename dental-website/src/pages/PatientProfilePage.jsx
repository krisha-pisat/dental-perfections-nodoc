import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMyProfile, updateMyProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FiUser, FiCalendar, FiAlertCircle, FiFileText, FiClock,
  FiCheckCircle, FiEdit2, FiSave, FiX, FiDownload, FiPlusCircle,
} from 'react-icons/fi';
import { FaTooth } from 'react-icons/fa';
import AddReviewForm from '../components/AddReviewForm';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const d = new Date();
  d.setHours(hours);
  d.setMinutes(minutes);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const getInitials = (firstName, lastName, username) => {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  return username?.[0]?.toUpperCase() || '?';
};

const StatusBadge = ({ status }) => {
  const styles = {
    CONFIRMED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'history', label: 'Treatment History' },
  { id: 'prescriptions', label: 'Prescriptions' },
];

const PatientProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  const { user } = useAuth();

  const fetchProfile = () => {
    setLoading(true);
    getMyProfile()
      .then(data => {
        setProfile(data);
        setPhoneValue(data.phone || '');
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) fetchProfile();
    else { setLoading(false); setError('You must be logged in to view this page.'); }
  }, [user]);

  const handleSavePhone = async () => {
    setSavingPhone(true);
    try {
      await updateMyProfile({ phone: phoneValue });
      setProfile(prev => ({ ...prev, phone: phoneValue }));
      setEditingPhone(false);
    } catch {
      alert('Failed to update phone number. Please try again.');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleDownload = () => {
    if (!profile) return;
    const name = `${profile.user.first_name} ${profile.user.last_name}`;
    const historyHTML = (profile.history || []).map(record => `
      <div class="record">
        <p class="label">${formatDate(record.visit_date)}</p>
        <p><strong>Treatment:</strong> ${record.treatment_provided || 'N/A'}</p>
        <p><strong>Notes:</strong> ${record.notes || 'N/A'}</p>
        ${record.prescriptions?.length ? `
          <p><strong>Prescriptions:</strong></p>
          <ul>${record.prescriptions.map(p => `<li>${p.medicine_name} (${p.dosage}) — ${p.instructions}</li>`).join('')}</ul>
        ` : ''}
      </div>
    `).join('');

    const html = `
      <html><head><title>Dental Records — ${name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; max-width: 700px; margin: 0 auto; }
        h1 { color: #1e3a8a; font-size: 24px; } h2 { color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 28px; font-size: 16px; }
        .record { margin: 16px 0; padding: 14px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .label { color: #6b7280; font-size: 12px; margin-bottom: 6px; font-weight: bold; }
        ul { padding-left: 20px; } li { margin: 4px 0; }
        .footer { margin-top: 40px; color: #9ca3af; font-size: 11px; text-align: center; }
      </style></head>
      <body>
        <h1>Dental Records</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Patient ID:</strong> #${profile.id}</p>
        <p><strong>Date of Birth:</strong> ${formatDate(profile.date_of_birth)}</p>
        <p><strong>Phone:</strong> ${profile.phone || 'N/A'}</p>
        <p><strong>Email:</strong> ${profile.user.email}</p>
        <h2>Treatment History</h2>
        ${historyHTML || '<p>No records found.</p>'}
        <p class="footer">Generated on ${new Date().toLocaleDateString()} · Dental Perfections</p>
      </body></html>
    `;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="pt-40 pb-20 text-center text-gray-500">Loading your profile...</div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <Navbar />
        <div className="pt-40 pb-20 px-6 max-w-2xl mx-auto text-center">
          <span className="bg-red-100 p-3 rounded-full inline-block mb-4">
            <FiAlertCircle className="text-4xl text-red-600" />
          </span>
          <h1 className="text-2xl font-semibold text-red-700 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">{error || 'Could not load your profile.'}</p>
          <Link to="/login" className="bg-blue-900 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Go to Patient Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const allAppointments = profile.appointments || [];
  const upcomingAppointments = allAppointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const pastAppointments = allAppointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED');
  const nextConfirmed = upcomingAppointments.find(a => a.status === 'CONFIRMED');

  const allPrescriptions = (profile.history || [])
    .flatMap(record =>
      (record.prescriptions || []).map(p => ({
        ...p,
        visit_date: record.visit_date,
        treatment: record.treatment_provided,
      }))
    )
    .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));

  const totalVisits = profile.history?.length || 0;
  const lastVisit = profile.history?.[0]?.visit_date;

  return (
    <div>
      <Navbar />

      {/* ── Profile Header ── */}
      <section className="bg-[#1e3a8a] pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
              {getInitials(profile.user.first_name, profile.user.last_name, profile.user.username)}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">
                {profile.user.first_name} {profile.user.last_name}
              </h1>
              <p className="text-blue-300 text-sm mt-1">
                Patient ID: #{profile.id} &nbsp;·&nbsp; Member since {formatDate(profile.added_date)}
              </p>

              {/* Stats strip */}
              <div className="flex flex-wrap gap-8 mt-5">
                <div>
                  <div className="text-2xl font-bold text-white">{totalVisits}</div>
                  <div className="text-blue-300 text-xs mt-0.5">Total Visits</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{lastVisit ? formatDate(lastVisit) : '—'}</div>
                  <div className="text-blue-300 text-xs mt-0.5">Last Visit</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {nextConfirmed ? formatDate(nextConfirmed.appointment_date) : 'Not scheduled'}
                  </div>
                  <div className="text-blue-300 text-xs mt-0.5">Next Appointment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <section className="bg-gray-50 py-10 px-6 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ════ OVERVIEW ════ */}
          {activeTab === 'overview' && (
            <>
              {/* Next Appointment Hero */}
              {nextConfirmed ? (
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-7 rounded-2xl shadow-lg">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">Upcoming Appointment</p>
                  <h2 className="text-2xl font-bold">{nextConfirmed.service_requested}</h2>
                  <p className="text-blue-100 mt-2 text-lg">
                    {formatDate(nextConfirmed.appointment_date)} &nbsp;at&nbsp; {formatTime(nextConfirmed.appointment_time)}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-green-300 text-sm font-medium">
                    <FiCheckCircle /> Confirmed by clinic
                  </div>
                </div>
              ) : (
                <div className="bg-white p-7 rounded-2xl border border-dashed border-gray-300 text-center shadow-sm">
                  <p className="text-gray-400 mb-4">You have no confirmed appointment yet.</p>
                  <Link
                    to="/book-appointment"
                    className="bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Book an Appointment
                  </Link>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/book-appointment"
                  className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FiPlusCircle className="text-blue-700 text-xl" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Book Appointment</div>
                    <div className="text-xs text-gray-500 mt-0.5">Request a new visit</div>
                  </div>
                </Link>

                <button
                  onClick={handleDownload}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left w-full"
                >
                  <div className="bg-green-100 p-3 rounded-full">
                    <FiDownload className="text-green-700 text-xl" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Download Records</div>
                    <div className="text-xs text-gray-500 mt-0.5">Print your dental history</div>
                  </div>
                </button>
              </div>

              {/* Personal Information */}
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FiUser className="text-blue-600" /> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Full Name</p>
                    <p className="font-medium text-gray-800">{profile.user.first_name} {profile.user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Username</p>
                    <p className="font-medium text-gray-800">@{profile.user.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Email</p>
                    <p className="font-medium text-gray-800">{profile.user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Date of Birth</p>
                    <p className="font-medium text-gray-800">{formatDate(profile.date_of_birth)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Phone Number</p>
                    {editingPhone ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="tel"
                          value={phoneValue}
                          onChange={e => setPhoneValue(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                          placeholder="+91 XXXX XXXXXX"
                        />
                        <button
                          onClick={handleSavePhone}
                          disabled={savingPhone}
                          className="text-green-600 hover:text-green-800 p-1 disabled:opacity-50"
                          title="Save"
                        >
                          <FiSave size={18} />
                        </button>
                        <button
                          onClick={() => { setEditingPhone(false); setPhoneValue(profile.phone || ''); }}
                          className="text-red-400 hover:text-red-600 p-1"
                          title="Cancel"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-medium text-gray-800">{profile.phone || 'Not provided'}</p>
                        <button onClick={() => setEditingPhone(true)} className="text-blue-400 hover:text-blue-600 p-1" title="Edit">
                          <FiEdit2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Patient Since</p>
                    <p className="font-medium text-gray-800">{formatDate(profile.added_date)}</p>
                  </div>
                </div>
              </div>

              {/* Leave a Review */}
              <AddReviewForm onReviewAdded={() => {}} />
            </>
          )}

          {/* ════ APPOINTMENTS ════ */}
          {activeTab === 'appointments' && (
            <>
              {/* Upcoming */}
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <FiClock className="text-yellow-500" /> Upcoming Appointments
                </h2>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map(app => (
                      <div
                        key={app.id}
                        className={`p-5 rounded-xl border-l-4 ${
                          app.status === 'CONFIRMED'
                            ? 'border-green-500 bg-green-50'
                            : 'border-yellow-400 bg-yellow-50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-bold text-gray-800 text-base">{app.service_requested}</h3>
                            <p className="text-xs text-gray-500 mt-1">Requested on {formatDate(app.created_at)}</p>
                            {app.status === 'CONFIRMED' ? (
                              <p className="text-green-800 font-medium text-sm mt-2 flex items-center gap-1.5">
                                <FiCheckCircle /> {formatDate(app.appointment_date)} at {formatTime(app.appointment_time)}
                              </p>
                            ) : (
                              <p className="text-yellow-700 text-sm mt-2 flex items-center gap-1.5">
                                <FiClock /> Awaiting confirmation from the clinic
                              </p>
                            )}
                            {app.notes && <p className="text-xs text-gray-500 mt-1 italic">Note: {app.notes}</p>}
                          </div>
                          <StatusBadge status={app.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-400 mb-3">No upcoming appointments.</p>
                    <Link to="/book-appointment" className="text-blue-600 text-sm font-semibold hover:underline">
                      Book one now
                    </Link>
                  </div>
                )}
              </div>

              {/* Past */}
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <FiCalendar className="text-gray-400" /> Past Appointments
                </h2>
                {pastAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {pastAppointments.map(app => (
                      <div key={app.id} className="p-4 rounded-lg border border-gray-200 flex justify-between items-center bg-gray-50">
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm">{app.service_requested}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(app.appointment_date || app.created_at)}
                          </p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-6 text-sm">No past appointments on record.</p>
                )}
              </div>
            </>
          )}

          {/* ════ TREATMENT HISTORY (Timeline) ════ */}
          {activeTab === 'history' && (
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-8 flex items-center gap-2">
                <FaTooth className="text-blue-600" /> Treatment Timeline
              </h2>
              {profile.history && profile.history.length > 0 ? (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-blue-100" />
                  <div className="space-y-8">
                    {profile.history.map((record, index) => (
                      <div key={record.id} className="relative pl-14">
                        {/* Circle dot */}
                        <div className="absolute left-0 top-0 h-9 w-9 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold shadow">
                          {index + 1}
                        </div>
                        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:bg-white transition-colors">
                          <p className="text-xs text-blue-700 font-bold uppercase tracking-wide mb-2">
                            {formatDate(record.visit_date)}
                          </p>
                          <h4 className="font-semibold text-gray-800 text-base">{record.treatment_provided || 'Treatment'}</h4>
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{record.notes}</p>

                          {record.prescriptions?.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                                <FiFileText /> {record.prescriptions.length} Prescription(s)
                              </p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {record.prescriptions.map(p => (
                                  <li key={p.id} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                    <span><strong>{p.medicine_name}</strong> · {p.dosage}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12 text-sm">No treatment history on record yet.</p>
              )}
            </div>
          )}

          {/* ════ PRESCRIPTIONS ════ */}
          {activeTab === 'prescriptions' && (
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FiFileText className="text-blue-600" /> All Prescriptions
              </h2>
              {allPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {allPrescriptions.map(presc => (
                    <div key={presc.id} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-base">{presc.medicine_name}</h3>
                          <p className="text-blue-700 font-medium text-sm mt-0.5">{presc.dosage}</p>
                          <p className="text-sm text-gray-600 mt-2">{presc.instructions}</p>
                          <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">
                            For: {presc.treatment}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">Prescribed on</p>
                          <p className="text-xs font-medium text-gray-600 mt-0.5">{formatDate(presc.visit_date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12 text-sm">No prescriptions on record yet.</p>
              )}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PatientProfilePage;
