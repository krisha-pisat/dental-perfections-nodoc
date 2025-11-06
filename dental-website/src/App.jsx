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
import PatientProfilePage from './pages/PatientProfilePage'; // <-- IMPORT NEW PAGE

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

      {/* --- Patient Secure Route --- */}
      <Route path="/my-profile" element={<PatientProfilePage />} /> {/* <-- ADD NEW ROUTE */}

      {/* --- Doctor/Admin Routes --- */}
      <Route path="/doctor-admin" element={<DoctorLoginPage />} />
      <Route path="/dashboard" element={<DoctorDashboard />} />
    </Routes>
  );
};

export default App;