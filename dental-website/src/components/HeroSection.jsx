// src/components/HeroSection.jsx
import React from 'react';
import { motion } from "framer-motion"; // <-- Import motion
import { Link } from 'react-router-dom'; // <-- Import Link
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 

// Create a motion-enabled Link component for proper prop handling
const MotionLink = motion(Link); 

const HeroSection = () => {
  // Use the hook to get the logged-in user state
  const { user } = useAuth(); 

  // Define the target link based on login status
  const appointmentLink = user ? '/book-appointment' : '/login'; 

  return (
    // Section uses the theme blue, adds padding for navbar, and rounded corners at the bottom
    <section className="bg-[#1e3a8a] text-white pt-28 pb-16 md:pt-32 md:pb-24 px-6 lg:px-8 overflow-hidden rounded-b-3xl md:rounded-b-[3rem]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* --- Left Column (Text Content) --- */}
        <motion.div
          className="relative z-10 text-center md:text-left order-2 md:order-1" // Text below image on mobile
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Rating Stars */}
          <div className="flex justify-center md:justify-start items-center gap-1 text-yellow-400 mb-4">
            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
            <span className="ml-2 text-sm font-medium text-gray-300">Rated 4.9/5</span>
          </div>

          {/* Main Heading */}
          <motion.h1
            className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5" // Use font-playfair
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            Experience the Art of a <br />
            <span className="text-[#6ee7b7]">Perfect Smile</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            Compassionate, state-of-the-art dental care for you and your family in the heart of Mumbai.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            {/* Styled "Book Appointment" button (White Background) */}
            <MotionLink // <-- Use MotionLink
              to={appointmentLink} 
              // Now motion props are recognized
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(255, 255, 255, 0.1)"}}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-2 bg-white text-[#1e3a8a] font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto"
            >
              Book Appointment
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </MotionLink>

             {/* Styled "Explore Services" button (Outline) */}
            <MotionLink // <-- Use MotionLink
              to="/services" 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'white' }}
              whileTap={{ scale: 0.98 }}
              className="bg-transparent border border-white/50 text-white font-medium px-6 py-3 rounded-full hover:border-white transition-all duration-300 w-full sm:w-auto"
            >
              Explore Our Services
            </MotionLink>
          </motion.div>
        </motion.div>

        {/* --- Right Column (Image) --- */}
        <motion.div
          className="relative w-full aspect-video md:aspect-auto md:h-[500px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2" // Image first on mobile stack
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        >
          {/* --- CHANGE: Replaced <video> with <img> --- */}
          <img
            src="/hero.jpg" // Use the path to your image in the public folder
            alt="Dental Perfections Clinic" // Add descriptive alt text
            className="absolute inset-0 w-full h-full object-cover" // Keep these classes
          />
          {/* --- END CHANGE --- */}

          {/* Optional: Subtle overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;