import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createAppointment } from '../api'; 
import { useAuth } from '../context/AuthContext'; 
import { FiCalendar, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

const AppointmentBookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    service_requested: 'Check-up & Cleaning',
    notes: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null; 
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Send the request with null date/time
      await createAppointment({
        ...formData,
        appointment_date: null,
        appointment_time: null
      });
      
      setSuccess(true);
      setFormData(prev => ({
        service_requested: prev.service_requested,
        notes: '',
      }));
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const services = [
    'Check-up & Cleaning',
    'Consultation',
    'Emergency Appointment',
    'Cosmetic Dentistry',
    'Implants',
    'Root Canal Treatment',
    'Other/Specific Request',
  ];

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 flex items-center justify-center pt-32 pb-12 px-6">
        <div className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex justify-center mb-6">
            <span className="bg-blue-100 p-4 rounded-full">
              <FiCalendar className="text-4xl text-blue-800" />
            </span>
          </div>

          <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-4 text-center">
            Request an Appointment
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Logged in as **{user.first_name || user.username}**. <br/>
            Select a service and we will contact you with an available slot.
          </p>
          
          {success && (
            <div className="flex items-center gap-2 text-base text-green-700 bg-green-50 p-4 rounded-lg mb-6">
              <FiCheckCircle className="text-2xl" />
              <span>
                **Request Sent!** The doctor will review your request and assign an appointment time shortly.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Service Requested */}
            <div>
              <label htmlFor="service_requested" className="block text-sm font-medium text-gray-700 text-left">
                Select Service
              </label>
              <select
                id="service_requested"
                name="service_requested"
                required
                value={formData.service_requested}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 text-left">
                Preferences / Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. I am only available on Tuesday mornings..."
              ></textarea>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? <><FiLoader className="animate-spin"/> Sending...</> : 'Send Request'}
              </button>
            </div>
          </form>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentBookingPage;