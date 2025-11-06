// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AppointmentActionForm from '../components/AppointmentActionForm'; 
import PrescriptionForm from '../components/PrescriptionForm'; 
import { getPatients, getAppointments, createHistoryEntry } from '../api'; 
import { FiUser, FiCalendar, FiEdit3, FiPlus, FiAlertCircle, FiClipboard, FiFileText, FiRefreshCw, FiBookOpen, FiLoader } from 'react-icons/fi'; 
import { FaTooth } from 'react-icons/fa'; // For patient history icon

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]); 
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [newHistory, setNewHistory] = useState({
    notes: '',
    treatment_provided: '',
  });

  // --- Fetching Logic (CRITICAL FIX FOR INFINITE LOOP) ---
  const fetchData = useCallback(async () => {
    setError(null);
    setLoading(true);
    
    try {
      const [patientData, appointmentData] = await Promise.all([
        getPatients(),
        getAppointments(), 
      ]);
      
      setPatients(patientData);
      setAppointments(appointmentData);
      setLoading(false);
      
      // CRITICAL FIX: Prevent the infinite loop here
      if (selectedPatient) {
        const updatedPatient = patientData.find(p => p.id === selectedPatient.id);

        // Only update if the patient is found AND the new data object is different
        // from the currently selected one (using stringify as a deep comparison check).
        if (updatedPatient && JSON.stringify(updatedPatient) !== JSON.stringify(selectedPatient)) {
            setSelectedPatient(updatedPatient);
        }
        // If the data is identical, we do NOT call setSelectedPatient, which stops the loop.
      }

    } catch (err) {
      console.error(err);
      setError(err.message); 
      setLoading(false);
    }
  }, [selectedPatient]); // <-- Keep dependency to allow manual refresh to work.

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // --- End Fetching Logic ---
  
  // Filter appointments for pending status
  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');

  // --- History Creation Logic ---
  const handleHistoryChange = (e) => {
    setNewHistory({
        ...newHistory,
        [e.target.name]: e.target.value,
    });
  };

  const handleAddHistory = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    if (!window.confirm("Add new history record for this patient?")) return;

    try {
        setLoading(true);
        await createHistoryEntry({
            patient: selectedPatient.id, 
            notes: newHistory.notes,
            treatment_provided: newHistory.treatment_provided,
        });
        setNewHistory({ notes: '', treatment_provided: '' }); 
        await fetchData(); 
        alert("History added successfully! You can now add prescriptions below."); 

    } catch (err) {
        console.error("History Add Error:", err);
        setError(err.message || 'Failed to add history entry.');
    } finally {
        setLoading(false);
    }
  };
  // --- End History Creation Logic ---


  // Handle what to show if loading
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="pt-32 pb-20 text-center">Loading patient data...</div>
        <Footer />
      </div>
    );
  }

  // Main Dashboard UI
  return (
    <div>
      <Navbar />
      {/* Header */}
      <section className="bg-white pt-32 pb-12 px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-blue-900">
              Clinic Dashboard
            </h1>
            <p className="text-lg text-gray-600">Appointment & Patient Management</p>
          </div>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2 disabled:bg-gray-400"
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiRefreshCw />} 
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
        {/* Display general fetch errors at the top, if any (e.g., server offline) */}
        {error && (
            <div className="max-w-7xl mx-auto mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
                <FiAlertCircle />
                <span>Error fetching data: {error}</span>
            </div>
        )}
      </section>

      {/* Main Content (Appointment Column + Patient Detail Columns) */}
      <section className="bg-gray-50 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Appointment Management (Left Pane) */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow border border-gray-200 h-fit space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar className="text-yellow-600" /> New Bookings ({pendingAppointments.length})
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map(app => (
                  <AppointmentActionForm
                    key={app.id}
                    appointment={app}
                    onStatusUpdated={fetchData} // Callback to refresh when status changes
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm py-4 text-center">No pending appointment requests.</p>
              )}
            </div>
          </div>

          {/* Column 2: Patient List (Center Pane) */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiUser className="text-blue-600" /> Patient List ({patients.length})
            </h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {patients.length > 0 ? (
                patients.map(patient => (
                  <button
                    key={patient.id}
                    // CRITICAL FIX: The initial selection must use the patient object from the list
                    onClick={() => setSelectedPatient(patient)} 
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="bg-gray-200 p-2 rounded-full">
                      <FaTooth className="text-gray-600" />
                    </span>
                    <div>
                      <div className="font-semibold">{patient.user?.first_name} {patient.user?.last_name}</div>
                      <div className="text-xs text-gray-500">@{patient.user?.username}</div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center text-sm">No patients found in the system.</p>
              )}
            </div>
          </div>


          {/* Column 3 & 4: Patient Details and History (Right Pane) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow border border-gray-200">
            {selectedPatient ? (
              <div>
                {/* Patient Header */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {selectedPatient.user?.first_name} {selectedPatient.user?.last_name}
                    </h2>
                    <p className="text-gray-600">{selectedPatient.user?.email} | {selectedPatient.phone}</p>
                    <p className="text-sm text-gray-500">
                      DOB: {formatDate(selectedPatient.date_of_birth)} | Added: {formatDate(selectedPatient.added_date)}
                    </p>
                  </div>
                  {/* Edit button is now purely descriptive */}
                  <button className="text-gray-500 flex items-center gap-2 border px-3 py-1 rounded-lg bg-gray-50">
                    <FiEdit3 /> View/Edit Patient Data in Admin
                  </button>
                </div>

                {/* Patient History */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiBookOpen className="text-green-600" /> Treatment History
                </h3>
                
                <div className="space-y-6">
                  {/* --- Form to Add New History --- */}
                  <form onSubmit={handleAddHistory} className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                     <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <FiPlus /> Add New Visit Record
                     </h4>
                     <textarea 
                        name="notes"
                        value={newHistory.notes}
                        onChange={handleHistoryChange}
                        className="w-full p-2 border rounded-md" 
                        rows="2" 
                        placeholder="Visit notes / Diagnosis..."
                        required
                     ></textarea>
                     <input
                        name="treatment_provided" 
                        value={newHistory.treatment_provided}
                        onChange={handleHistoryChange}
                        className="w-full p-2 border rounded-md" 
                        placeholder="Treatment Provided (e.g., Crown placement, Scaling)"
                        required
                     />
                     <button 
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                     >
                        {loading ? <FiLoader className="animate-spin" /> : <FiPlus />}
                        Save New History
                     </button>
                  </form>
                  {/* --- End Form --- */}

                  {/* Display History Records */}
                  {selectedPatient.history && selectedPatient.history.length > 0 ? (
                    selectedPatient.history.sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
                    .map(record => (
                      <div key={record.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50/50">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                            <FiCalendar /> Visit on {formatDate(record.visit_date)}
                          </h4>
                          {/* We don't implement inline edit/delete here, directs to admin */}
                          <span className="text-xs text-gray-500">Record ID: {record.id}</span>
                        </div>
                        
                        <h5 className="font-semibold mt-3 text-sm text-gray-700">Notes & Diagnosis:</h5>
                        <p className="text-sm text-gray-600 mb-3 ml-2">{record.notes || 'N/A'}</p>
                        
                        <h5 className="font-semibold mt-3 text-sm text-gray-700">Treatment Provided:</h5>
                        <p className="text-sm text-gray-600 mb-3 ml-2">{record.treatment_provided || 'N/A'}</p>

                        {/* Prescriptions Display */}
                        {selectedPatient.history && record.prescriptions?.length > 0 && (
                          <div>
                            <h5 className="font-semibold mt-3 text-sm text-gray-700 flex items-center gap-1.5"><FiFileText/> Prescriptions:</h5>
                            <ul className="list-disc pl-8 text-sm text-gray-600 mt-2 space-y-1">
                              {record.prescriptions.map(presc => (
                                <li key={presc.id}>
                                  <strong>{presc.medicine_name}</strong> ({presc.dosage}) - {presc.instructions}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* --- Form to Add Prescription --- */}
                        <PrescriptionForm 
                            historyEntryId={record.id}
                            onPrescriptionAdded={fetchData} // Refresh all data after adding
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No treatment history found for this patient.</p>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center h-full flex flex-col justify-center items-center text-gray-500 min-h-[400px]">
                <FiUser className="text-6xl mb-4" />
                <h2 className="text-xl font-semibold">Select a patient</h2>
                <p>Choose a patient from the list to view and manage their records.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;