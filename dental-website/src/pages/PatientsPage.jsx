import React, { useState, useEffect, useCallback } from 'react';
import StaffLayout from '../components/StaffLayout';
import { getPatients, createHistoryEntry, createPrescription } from '../api';
import { FiUser, FiSearch, FiFileText, FiCalendar, FiPlus, FiX, FiRefreshCw } from 'react-icons/fi';
import { FaTooth } from 'react-icons/fa';

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':');
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const getInitials = (patient) => {
  const f = patient?.user?.first_name?.[0] || '';
  const l = patient?.user?.last_name?.[0] || '';
  return (f + l).toUpperCase() || '?';
};

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const PATIENT_TABS = ['Overview', 'History', 'Prescriptions', 'Appointments'];

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const [addingHistory, setAddingHistory] = useState(false);
  const [historyForm, setHistoryForm] = useState({ notes: '', treatment_provided: '' });

  const [addingPrescForRecord, setAddingPrescForRecord] = useState(null);
  const [prescForm, setPrescForm] = useState({ medicine_name: '', dosage: '', instructions: '' });

  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPatients();
      setPatients(data);
      if (selected) {
        const updated = data.find(p => p.id === selected.id);
        if (updated) setSelected(updated);
      }
    } finally {
      setLoading(false);
    }
  }, [selected?.id]);

  useEffect(() => { fetchData(); }, []);

  const filtered = patients.filter(p => {
    const name = `${p.user?.first_name} ${p.user?.last_name} ${p.user?.username}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const allPrescriptions = (selected?.history || [])
    .flatMap(r => (r.prescriptions || []).map(p => ({
      ...p,
      visit_date: r.visit_date,
      treatment: r.treatment_provided,
    })))
    .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));

  const handleAddHistory = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createHistoryEntry({ patient: selected.id, ...historyForm });
      setHistoryForm({ notes: '', treatment_provided: '' });
      setAddingHistory(false);
      const data = await getPatients();
      setPatients(data);
      setSelected(data.find(p => p.id === selected.id));
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPrescription({ history_entry: addingPrescForRecord, ...prescForm });
      setPrescForm({ medicine_name: '', dosage: '', instructions: '' });
      setAddingPrescForRecord(null);
      const data = await getPatients();
      setPatients(data);
      setSelected(data.find(p => p.id === selected.id));
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <StaffLayout>
      <div className="flex h-full overflow-hidden">

        {/* ── Patient List Sidebar ── */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-800 text-sm">Patients ({patients.length})</h2>
              <button onClick={fetchData} disabled={loading} className="text-gray-400 hover:text-gray-600">
                <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No patients found.</p>
            ) : (
              filtered.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => { setSelected(patient); setActiveTab('Overview'); setAddingHistory(false); setAddingPrescForRecord(null); }}
                  className={`w-full flex items-center gap-3 p-4 text-left border-b border-gray-50 transition-colors ${
                    selected?.id === patient.id
                      ? 'bg-blue-50 border-l-4 border-l-blue-900'
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(patient)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {patient.user?.first_name} {patient.user?.last_name}
                    </p>
                    <p className="text-xs text-gray-400">@{patient.user?.username}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{patient.history?.length || 0} visits</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Patient Detail Panel ── */}
        <div className="flex-1 overflow-y-auto">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiUser className="text-6xl mb-4" />
              <p className="text-lg font-semibold">Select a patient</p>
              <p className="text-sm">Choose from the list to view their full record</p>
            </div>
          ) : (
            <div>

              {/* Patient Header */}
              <div className="bg-[#1e3a8a] text-white p-8">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {getInitials(selected)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{selected.user?.first_name} {selected.user?.last_name}</h1>
                    <p className="text-blue-300 text-sm mt-0.5">
                      Patient ID: #{selected.id} · @{selected.user?.username}
                    </p>
                    <div className="flex gap-6 mt-4">
                      <div>
                        <span className="text-2xl font-bold">{selected.history?.length || 0}</span>
                        <span className="text-blue-300 text-xs ml-1.5">Visits</span>
                      </div>
                      <div>
                        <span className="text-2xl font-bold">{selected.appointments?.length || 0}</span>
                        <span className="text-blue-300 text-xs ml-1.5">Appointments</span>
                      </div>
                      <div>
                        <span className="text-2xl font-bold">{allPrescriptions.length}</span>
                        <span className="text-blue-300 text-xs ml-1.5">Prescriptions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white border-b border-gray-200 px-8">
                <div className="flex">
                  {PATIENT_TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-blue-900 text-blue-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8 space-y-5">

                {/* ── OVERVIEW ── */}
                {activeTab === 'Overview' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-800 text-lg mb-6">Patient Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Full Name</p>
                        <p className="font-medium text-gray-800">{selected.user?.first_name} {selected.user?.last_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Username</p>
                        <p className="font-medium text-gray-800">@{selected.user?.username}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p>
                        <p className="font-medium text-gray-800">{selected.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Phone</p>
                        <p className="font-medium text-gray-800">{selected.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Date of Birth</p>
                        <p className="font-medium text-gray-800">{formatDate(selected.date_of_birth)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Patient Since</p>
                        <p className="font-medium text-gray-800">{formatDate(selected.added_date)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── HISTORY ── */}
                {activeTab === 'History' && (
                  <div className="space-y-5">

                    {/* Add History */}
                    {!addingHistory ? (
                      <button
                        onClick={() => setAddingHistory(true)}
                        className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"
                      >
                        <FiPlus /> Add New Visit Record
                      </button>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-blue-800">New Visit Record</h4>
                          <button onClick={() => setAddingHistory(false)} className="text-gray-400 hover:text-gray-600"><FiX /></button>
                        </div>
                        <form onSubmit={handleAddHistory} className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Treatment Provided</label>
                            <input
                              required
                              value={historyForm.treatment_provided}
                              onChange={e => setHistoryForm(p => ({ ...p, treatment_provided: e.target.value }))}
                              placeholder="e.g. Root Canal Treatment, Scaling"
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600 block mb-1">Diagnosis / Notes</label>
                            <textarea
                              required
                              value={historyForm.notes}
                              onChange={e => setHistoryForm(p => ({ ...p, notes: e.target.value }))}
                              placeholder="Notes from the visit, diagnosis..."
                              rows={3}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save Record'}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Timeline */}
                    {selected.history?.length > 0 ? (
                      <div className="relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-blue-100" />
                        <div className="space-y-6">
                          {selected.history.map((record, i) => (
                            <div key={record.id} className="relative pl-14">
                              <div className="absolute left-0 top-0 h-9 w-9 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs font-bold shadow">
                                {i + 1}
                              </div>
                              <div className="bg-white border border-gray-200 rounded-xl p-5">
                                <p className="text-xs text-blue-700 font-bold uppercase tracking-wide mb-1">
                                  {formatDate(record.visit_date)}
                                </p>
                                <h4 className="font-semibold text-gray-800">{record.treatment_provided}</h4>
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{record.notes}</p>

                                {/* Prescriptions for this record */}
                                {record.prescriptions?.length > 0 && (
                                  <div className="mt-4 pt-3 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                                      <FiFileText size={12} /> Prescriptions
                                    </p>
                                    <ul className="space-y-1.5">
                                      {record.prescriptions.map(p => (
                                        <li key={p.id} className="text-sm text-gray-600 flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                          <strong>{p.medicine_name}</strong> · {p.dosage} · <span className="text-gray-400">{p.instructions}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Add Prescription inline */}
                                {addingPrescForRecord === record.id ? (
                                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Add Prescription</p>
                                      <button onClick={() => setAddingPrescForRecord(null)} className="text-gray-400 hover:text-gray-600"><FiX size={14} /></button>
                                    </div>
                                    <form onSubmit={handleAddPrescription} className="space-y-2">
                                      <input
                                        required
                                        value={prescForm.medicine_name}
                                        onChange={e => setPrescForm(p => ({ ...p, medicine_name: e.target.value }))}
                                        placeholder="Medicine name"
                                        className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                      <input
                                        required
                                        value={prescForm.dosage}
                                        onChange={e => setPrescForm(p => ({ ...p, dosage: e.target.value }))}
                                        placeholder="Dosage (e.g. 500mg)"
                                        className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                      <input
                                        required
                                        value={prescForm.instructions}
                                        onChange={e => setPrescForm(p => ({ ...p, instructions: e.target.value }))}
                                        placeholder="Instructions (e.g. Twice a day after meals)"
                                        className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                      <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-blue-900 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
                                      >
                                        {saving ? 'Saving...' : 'Save Prescription'}
                                      </button>
                                    </form>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => { setAddingPrescForRecord(record.id); setPrescForm({ medicine_name: '', dosage: '', instructions: '' }); }}
                                    className="mt-3 text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                                  >
                                    <FiPlus size={12} /> Add Prescription to this visit
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
                        <FaTooth className="text-4xl mx-auto mb-3" />
                        <p>No treatment history yet for this patient.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── PRESCRIPTIONS ── */}
                {activeTab === 'Prescriptions' && (
                  <div className="space-y-4">
                    {allPrescriptions.length > 0 ? (
                      allPrescriptions.map(presc => (
                        <div key={presc.id} className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{presc.medicine_name}</h3>
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
                      ))
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
                        <FiFileText className="text-4xl mx-auto mb-3" />
                        <p>No prescriptions on record for this patient.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── APPOINTMENTS ── */}
                {activeTab === 'Appointments' && (
                  <div className="space-y-3">
                    {selected.appointments?.length > 0 ? (
                      selected.appointments.map(app => (
                        <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-800">{app.service_requested}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {app.appointment_date
                                ? `${formatDate(app.appointment_date)} at ${formatTime(app.appointment_time)}`
                                : 'Not scheduled yet'}
                            </p>
                            {app.notes && <p className="text-xs text-gray-400 italic mt-1">"{app.notes}"</p>}
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full flex-shrink-0 ${STATUS_STYLES[app.status]}`}>
                            {app.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
                        <FiCalendar className="text-4xl mx-auto mb-3" />
                        <p>No appointments on record for this patient.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  );
};

export default PatientsPage;
