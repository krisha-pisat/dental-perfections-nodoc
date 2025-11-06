import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// --- Inline SVG ---
const DoctorIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="1em" 
    height="1em" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M5.5 4.5A2.5 2.5 0 0 1 8 2h8a2.5 2.5 0 0 1 2.5 2.5V5h-13v-.5z" />
    <path d="M5.5 22a2.5 2.5 0 0 1-2.5-2.5v-13A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v13a2.5 2.5 0 0 1-2.5 2.5h-13z" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
);
// ---

const DoctorLoginPage = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 min-h-[70vh] flex items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-lg border border-gray-200 text-center">
          <div className="flex justify-center mb-6">
            <span className="bg-blue-100 p-4 rounded-full">
              <DoctorIcon className="text-4xl text-blue-800" />
            </span>
          </div>
          
          <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
            Doctor / Admin Login
          </h1>
          
          <p className="text-gray-600 mb-8">
            Access the clinic dashboard via the secure Django Admin panel.
          </p>
          
          <a
            href="http://127.0.0.1:8000/admin/" // This is the correct link for you
            target="_blank" // Opens in a new tab
            rel="noopener noreferrer"
            className="w-full inline-block bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
          >
            Open Admin Login
          </a>
          
          <p className="text-xs text-gray-500 mt-6">
            After logging in via the admin panel, you can return to this site and access the{' '}
            <a href="/dashboard" className="text-blue-700 hover:underline">
              Doctor Dashboard
            </a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorLoginPage;