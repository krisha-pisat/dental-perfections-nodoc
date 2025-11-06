import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPatients } from '../api'; // Import our updated function
import { FiUser, FiCalendar, FiEdit3, FiPlus, FiAlertCircle, FiClipboard, FiFileText } from 'react-icons/fi';

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
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPatients()
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message); // Store the error message
        setLoading(false);
      });
  }, []);

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

  // Handle what to show if error (e.g., Doctor not logged into /admin)
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto text-center">
           <span className="bg-red-100 p-3 rounded-full inline-block mb-4">
              <FiAlertCircle className="text-4xl text-red-600" />
           </span>
           <h1 className="text-2xl font-semibold text-red-700 mb-4">Access Denied</h1>
           <p className="text-gray-600">
             Could not load patient data. This is a secure area for doctors only.
           </p>
           <p className="text-gray-600 mb-8">
             <strong>Please ensure you are logged into the Django Admin panel.</strong>
           </p>
           <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-900 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
          >
            Go to Admin Login
          </a>
        </div>
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
              Doctor Dashboard
            </h1>
            <p className="text-lg text-gray-600">Patient Management</p>
          </div>
          {/* This button is for visual representation.
              We would add form state logic to make it work. */}
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2">
            <FiPlus /> Add New Patient
          </button>
        </div>
      </section>

      {/* Main Content (List + Detail) */}
      <section className="bg-gray-50 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Patient List */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              All Patients ({patients.length})
            </h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {patients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedPatient?.id === patient.id
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="bg-gray-200 p-2 rounded-full">
                    <FiUser className="text-gray-600" />
                  </span>
                  <div>
                    {/* The 'user' object is now nested */}
                    <div className="font-semibold">{patient.user.first_name} {patient.user.last_name}</div>
                    <div className="text-xs text-gray-500">@{patient.user.username}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Patient Details */}
          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow border border-gray-200">
            {selectedPatient ? (
              <div>
                {/* Patient Header */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {selectedPatient.user.first_name} {selectedPatient.user.last_name}
                    </h2>
                    <p className="text-gray-600">{selectedPatient.user.email} | {selectedPatient.phone}</p>
                    <p className="text-sm text-gray-500">
                      DOB: {formatDate(selectedPatient.date_of_birth)} | Added: {formatDate(selectedPatient.added_date)}
                    </p>
                  </div>
                  <button className="text-gray-500 hover:text-blue-700 flex items-center gap-2 border px-3 py-1 rounded-lg hover:bg-gray-50">
                    <FiEdit3 /> Edit Patient
                  </button>
                </div>

                {/* Patient History */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Treatment History
                </h3>
                <div className="space-y-6">
                  {/* --- Form to Add New History (Example) --- */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                     <h4 className="font-semibold text-gray-700 mb-2">Add New History Entry</h4>
                     <textarea className="w-full p-2 border rounded-md" rows="2" placeholder="Visit notes..."></textarea>
                     <input className="w-full p-2 border rounded-md mt-2" placeholder="Treatment provided..."/>
                     <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 text-sm font-semibold">Save Entry</button>
                  </div>
                  {/* --- End Form --- */}

                  {/* This uses the 'history' array nested by your serializer */}
                  {selectedPatient.history && selectedPatient.history.length > 0 ? (
                    selectedPatient.history.map(record => (
                      <div key={record.id} className="border border-gray-200 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                            <FiCalendar /> Visit on {formatDate(record.visit_date)}
                          </h4>
                          <button className="text-xs text-gray-500 hover:text-blue-700">Edit Visit</button>
                        </div>
                        
                        <h5 className="font-semibold mt-3 text-sm text-gray-700">Notes & Diagnosis:</h5>
                        <p className="text-sm text-gray-600 mb-3 ml-2">{record.notes || 'N/A'}</p>
                        
                        <h5 className="font-semibold mt-3 text-sm text-gray-700">Treatment Provided:</h5>
                        <p className="text-sm text-gray-600 mb-3 ml-2">{record.treatment_provided || 'N/A'}</p>

                        {/* Prescriptions */}
                        {record.prescriptions && record.prescriptions.length > 0 && (
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
                        {/* --- Form to Add Prescription (Example) --- */}
                        <div className="mt-4 pt-4 border-t">
                          <input className="w-1/3 p-2 border rounded-md" placeholder="Medicine"/>
                          <input className="w-1/4 p-2 border rounded-md ml-2" placeholder="Dosage"/>
                          <input className="w-1/3 p-2 border rounded-md ml-2" placeholder="Instructions"/>
                          <button className="bg-blue-500 text-white px-3 py-2 rounded-lg ml-2 text-xs">Add Rx</button>
                        </div>
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
                <p>Choose a patient from the list to view their details and history.</p>
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