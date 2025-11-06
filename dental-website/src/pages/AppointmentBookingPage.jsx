// src/pages/AppointmentBookingPage.jsx

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
    appointment_date: '',
    appointment_time: '10:00:00',
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
      const selectedDate = new Date(formData.appointment_date);
      const today = new Date();
      // Simple validation for future date
      if (selectedDate.setHours(0,0,0,0) < today.setHours(0,0,0,0)) {
        setError("Please select a future date for your appointment.");
        setLoading(false);
        return;
      }

      await createAppointment(formData);
      setSuccess(true);
      setFormData(prev => ({ // Keep service but clear date/notes
        service_requested: prev.service_requested,
        appointment_date: '',
        appointment_time: '10:00:00',
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
            Book Your Appointment
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            You are logged in as **{user.first_name || user.username}**. Please fill out the form below.
          </p>
          
          {success && (
            <div className="flex items-center gap-2 text-base text-green-700 bg-green-50 p-4 rounded-lg mb-6">
              <FiCheckCircle className="text-2xl" />
              <span>
                **Success!** Your appointment request has been submitted. We will contact you shortly to confirm the details.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Appointment Date */}
              <div>
                <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 text-left">
                  Preferred Date
                </label>
                <input
                  id="appointment_date"
                  name="appointment_date"
                  type="date"
                  required
                  value={formData.appointment_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Appointment Time */}
              <div>
                <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700 text-left flex items-center gap-1">
                  Preferred Time
                </label>
                <input
                  id="appointment_time"
                  name="appointment_time"
                  type="time"
                  step="3600" // Steps of 1 hour
                  required
                  value={formData.appointment_time}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 text-left">
                Additional Notes / Reason for Visit (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                {loading ? <><FiLoader className="animate-spin"/> Submitting...</> : 'Request Appointment'}
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