import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMyProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiAlertCircle, FiFileText } from 'react-icons/fi';
import AddReviewForm from '../components/AddReviewForm'; // <-- 1. IMPORT THE NEW FORM

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const PatientProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the user from auth context

  const fetchProfile = () => {
    // We create a reusable function to fetch data
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
    // Only fetch profile if the user is logged in
    if (user) {
      fetchProfile();
    } else {
      // User is not logged in
      setLoading(false);
      setError("You must be logged in to view this page.");
    }
  }, [user]); // Re-run if the user logs in or out

  // ... (keep the loading and error return sections) ...
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="pt-32 pb-20 text-center">Loading your profile...</div>
        <Footer />
      </div>
    );
  }

  // Handle Error or Not Logged In
  if (error || !profile) {
    return (
      <div>
        <Navbar />
        <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto text-center">
           <span className="bg-red-100 p-3 rounded-full inline-block mb-4">
              <FiAlertCircle className="text-4xl text-red-600" />
           </span>
           <h1 className="text-2xl font-semibold text-red-700 mb-4">Access Denied</h1>
           <p className="text-gray-600 mb-8">
             {error || "Could not load your profile."}
           </p>
           <Link
            to="/login"
            className="bg-blue-900 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
          >
            Go to Patient Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Main Profile UI ---
  return (
    <div>
      <Navbar />
      {/* Header */}
      <section className="bg-gray-50 pt-32 pb-12 px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl font-bold text-blue-900">
            Welcome, {profile.user.first_name || profile.user.username}!
          </h1>
          <p className="text-lg text-gray-600">Here is your dental history and profile.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Profile Details */}
          <div className="bg-white p-8 rounded-lg shadow border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser /> Your Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Name:</strong> {profile.user.first_name} {profile.user.last_name}</p>
              <p><strong>Username:</strong> {profile.user.username}</p>
              <p><strong>Email:</strong> {profile.user.email}</p>
              <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {formatDate(profile.date_of_birth)}</p>
              <p><strong>Patient Since:</strong> {formatDate(profile.added_date)}</p>
            </div>
          </div>

          {/* --- 2. ADD THE REVIEW FORM HERE --- */}
          <div className="mb-8">
            <AddReviewForm 
              onReviewAdded={() => {
                // This is a simple way to let the user know
                // In a more complex app, we might refresh the reviews on the home page
                console.log("Review added!");
              }}
            />
          </div>

          {/* History Details */}
          <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar /> Your Visit History
            </h2>
            <div className="space-y-6">
              {profile.history && profile.history.length > 0 ? (
                profile.history.map(record => (
                  <div key={record.id} className="border border-gray-200 p-4 rounded-lg bg-gray-50/50">
                    <h4 className="font-semibold text-blue-800">
                      Visit on {formatDate(record.visit_date)}
                    </h4>
                    
                    <h5 className="font-semibold mt-3 text-sm text-gray-700">Doctor's Notes:</h5>
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
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">You have no treatment history on file.</p>
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