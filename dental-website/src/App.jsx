// src/App.jsx
import React from 'react';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ServicesPage from './pages/ServicesPage';
import SmileGallery from './pages/SmileGallery';
import BlogPage from './pages/BlogPage';
import FaqPage from './pages/FaqPage';

// 1. Import your pages
import PatientLoginPage from './pages/PatientLoginPage';
import PatientSignUpPage from './pages/PatientSignUpPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientsPage from './pages/PatientsPage';
import SchedulePage from './pages/SchedulePage';
import StaffLoginPage from './pages/StaffLoginPage';
import ProtectedStaffRoute from './components/ProtectedStaffRoute';
import PatientProfilePage from './pages/PatientProfilePage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import ReviewsPage from './pages/ReviewsPage';

import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/gallery" element={<SmileGallery />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/faq" element={<FaqPage />} />

      {/* --- Patient Auth Routes --- */}
      <Route path="/login" element={<PatientLoginPage />} />
      <Route path="/signup" element={<PatientSignUpPage />} />
      <Route path="/patient-login" element={<PatientLoginPage />} />
      <Route path="/patient-signup" element={<PatientSignUpPage />} />

      {/* --- Patient Secure Routes --- */}
      <Route path="/my-profile" element={<PatientProfilePage />} />
      <Route path="/book-appointment" element={<AppointmentBookingPage />} />
      <Route path="/reviews" element={<ReviewsPage />} /> {/* <-- ADD NEW ROUTE */}

      {/* --- Staff Routes (all protected) --- */}
      <Route path="/staff-login" element={<StaffLoginPage />} />
      <Route path="/doctor-admin" element={<ProtectedStaffRoute><DoctorLoginPage /></ProtectedStaffRoute>} />
      <Route path="/dashboard" element={<ProtectedStaffRoute><DoctorDashboard /></ProtectedStaffRoute>} />
      <Route path="/appointments" element={<ProtectedStaffRoute><AppointmentsPage /></ProtectedStaffRoute>} />
      <Route path="/patients" element={<ProtectedStaffRoute><PatientsPage /></ProtectedStaffRoute>} />
      <Route path="/schedule" element={<ProtectedStaffRoute><SchedulePage /></ProtectedStaffRoute>} />
    </Routes>
  );
};

export default App;