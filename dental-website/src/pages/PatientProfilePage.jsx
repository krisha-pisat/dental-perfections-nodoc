import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMyProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiAlertCircle, FiFileText, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';
import AddReviewForm from '../components/AddReviewForm';

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper to format Time (HH:MM:SS -> 10:30 AM)
const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const PatientProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to track dismissed notifications
  const [dismissedIds, setDismissedIds] = useState([]); 
  
  const { user } = useAuth(); 

  const fetchProfile = () => {
    setLoading(true);
    getMyProfile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("You must be logged in to view this page.");
    }
  }, [user]);

  // Handle dismissing a notification
  const handleDismiss = (id) => {
    setDismissedIds(prev => [...prev, id]);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="pt-32 pb-20 text-center">Loading your profile...</div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <Navbar />
        <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto text-center">
           <span className="bg-red-100 p-3 rounded-full inline-block mb-4">
              <FiAlertCircle className="text-4xl text-red-600" />
           </span>
           <h1 className="text-2xl font-semibold text-red-700 mb-4">Access Denied</h1>
           <p className="text-gray-600 mb-8">{error || "Could not load your profile."}</p>
           <Link to="/login" className="bg-blue-900 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-colors">Go to Patient Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter active appointments AND exclude dismissed ones
  const upcomingAppointments = profile.appointments?.filter(a => 
    a.status !== 'CANCELLED' && 
    a.status !== 'COMPLETED' &&
    !dismissedIds.includes(a.id) // <-- Hide if dismissed
  ) || [];

  return (
    <div>
      <Navbar />
      <section className="bg-gray-50 pt-32 pb-12 px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl font-bold text-blue-900">
            Welcome, {profile.user.first_name || profile.user.username}!
          </h1>
          <p className="text-lg text-gray-600">Here is your dental dashboard.</p>
        </div>
      </section>

      <section className="bg-white py-12 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* --- 1. NOTIFICATION SECTION --- */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FiClock className="text-blue-600" /> Appointment Status
            </h2>

            {upcomingAppointments.length > 0 ? (
              <div className="grid gap-4">
                {upcomingAppointments.map((app) => (
                  <div 
                    key={app.id} 
                    className={`relative p-5 rounded-lg border-l-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all
                      ${app.status === 'CONFIRMED' 
                        ? 'bg-green-50 border-green-500' 
                        : 'bg-yellow-50 border-yellow-400'
                      }`}
                  >
                    {/* --- DISMISS BUTTON --- */}
                    <button 
                      onClick={() => handleDismiss(app.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-black/5 transition-colors"
                      title="Dismiss notification"
                    >
                      <FiX size={18} />
                    </button>

                    <div>
                      <h3 className="font-bold text-gray-800 text-lg pr-8">{app.service_requested}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Request submitted on {formatDate(app.created_at)}
                      </p>
                      
                      {app.status === 'CONFIRMED' ? (
                        <div className="mt-3 flex items-center gap-2 text-green-800 font-semibold bg-green-100 px-3 py-1.5 rounded-md w-fit">
                          <FiCheckCircle />
                          <span>Confirmed: {formatDate(app.appointment_date)} at {formatTime(app.appointment_time)}</span>
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-2 text-yellow-800 font-medium bg-yellow-100 px-3 py-1.5 rounded-md w-fit">
                          <FiClock />
                          <span>Request Pending (Doctor will assign a time soon)</span>
                        </div>
                      )}
                    </div>

                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full 
                      ${app.status === 'CONFIRMED' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">No new notifications.</p>
                <Link to="/book-appointment" className="text-blue-600 font-semibold hover:underline">
                  Book a new appointment
                </Link>
              </div>
            )}
          </div>

          {/* --- 2. Profile Details --- */}
          <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser /> Your Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
              <p><strong className="text-gray-700">Name:</strong> {profile.user.first_name} {profile.user.last_name}</p>
              <p><strong className="text-gray-700">Username:</strong> {profile.user.username}</p>
              <p><strong className="text-gray-700">Email:</strong> {profile.user.email}</p>
              <p><strong className="text-gray-700">Phone:</strong> {profile.phone || 'N/A'}</p>
              <p><strong className="text-gray-700">Date of Birth:</strong> {formatDate(profile.date_of_birth)}</p>
            </div>
          </div>

          {/* --- 3. Add Review --- */}
          <AddReviewForm onReviewAdded={() => console.log("Review added!")} />

          {/* --- 4. Past History --- */}
          <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar /> Past Treatment History
            </h2>
            <div className="space-y-6">
              {profile.history && profile.history.length > 0 ? (
                profile.history.map(record => (
                  <div key={record.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-blue-800">
                      Visit on {formatDate(record.visit_date)}
                    </h4>
                    <p className="text-sm text-gray-700 mt-2"><strong>Diagnosis:</strong> {record.notes || 'N/A'}</p>
                    <p className="text-sm text-gray-700 mt-1"><strong>Treatment:</strong> {record.treatment_provided || 'N/A'}</p>

                    {record.prescriptions && record.prescriptions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h5 className="font-semibold text-sm text-gray-700 flex items-center gap-1.5"><FiFileText/> Prescribed Meds:</h5>
                        <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                          {record.prescriptions.map(presc => (
                            <li key={presc.id}>
                              {presc.medicine_name} - {presc.dosage} <span className="text-gray-400 text-xs">({presc.instructions})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No past history records found.</p>
              )}
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PatientProfilePage;