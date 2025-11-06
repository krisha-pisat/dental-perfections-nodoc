// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // Import the auth hook

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { user, logout } = useAuth(); // Get PATIENT user and logout
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/'); // Navigate to home page after patient logout
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      className={`
        fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 relative
        ${scrolled ? 'pt-4' : 'pt-0'}
      `}
    >
      <motion.nav
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`
          flex items-center justify-between transition-all duration-500 ease-in-out relative
          ${
            scrolled
              ? 'max-w-6xl bg-white shadow-lg rounded-full py-3 px-8'
              : 'w-full bg-white py-5 px-10'
          }
        `}
      >
        {/* --- Logo Section --- */}
        <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
          <img
            src="/logo.jpg"
            alt="Dental Perfections Logo"
            className={`rounded-full object-cover transition-all duration-500
              ${scrolled ? 'h-10 w-10' : 'h-14 w-14'}
            `}
          />
          <div
            className={`transition-all duration-500 leading-tight overflow-hidden
              ${
                scrolled
                  ? 'max-w-[100px] opacity-90'
                  : 'max-w-[140px] opacity-100'
              }
            `}
          >
            <h1 className="text-blue-900 font-semibold text-base md:text-lg whitespace-nowrap">
              Dental Perfections
            </h1>
            <p className="text-[10px] text-gray-500 whitespace-nowrap">
              Excellence in Dental Care
            </p>
          </div>
        </Link>

        {/* --- Center Navigation Links (Desktop Only) --- */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex space-x-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-900 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-900 transition-colors">About Us</Link>
            <Link to="/services" className="hover:text-blue-900 transition-colors">Services</Link>
            <Link to="/gallery" className="hover:text-blue-900 transition-colors">Smile Gallery</Link>
            <Link to="/blog" className="hover:text-blue-900 transition-colors">Blog</Link>
            <Link to="/faq" className="hover:text-blue-900 transition-colors">FAQ</Link>
            
            {/* REMOVED: Admin Dashboard link for security */}
            
          </div>
        </div>

        {/* --- Buttons (Desktop Only) --- */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {/* === CONDITIONAL PATIENT BUTTONS === */}
          {user ? (
            // --- SHOW IF PATIENT IS LOGGED IN ---
            <>
              <Link
                to="/my-profile"
                className="text-gray-600 text-sm font-medium hover:text-blue-900 px-3"
              >
                Welcome, {user.first_name || user.username}!
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-blue-900 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            // --- SHOW IF PATIENT IS LOGGED OUT ---
            <>
              <Link
                to="/signup" // Points to PatientSignupPage
                className="bg-gray-100 text-blue-900 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Sign Up
              </Link>
              <Link
                to="/login" // Points to PatientLoginPage
                className="bg-blue-900 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                Patient Login
              </Link>
            </>
          )}
        </div>

        {/* --- Mobile Hamburger Menu --- */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* --- Mobile Menu Dropdown --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-b-lg"
            >
              <div className="flex flex-col items-center gap-y-6 py-8">
                {/* Public Links */}
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                <Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
                <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>Smile Gallery</Link>
                <Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <Link to="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                
                <hr className="w-1/2 my-2"/>

                {/* === CONDITIONAL MOBILE LINKS === */}
                {user ? (
                  // --- SHOW IF PATIENT IS LOGGED IN ---
                  <>
                    <Link
                      to="/my-profile"
                      className="font-semibold text-blue-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Welcome, {user.first_name || user.username}!
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-100 text-blue-900 font-semibold px-5 py-2 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // --- SHOW IF PATIENT IS LOGGED OUT ---
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Patient Login</Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-gray-100 text-blue-900 font-semibold px-5 py-2 rounded-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                
                {/* REMOVED: Admin Dashboard link for security */}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;