import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  const linkHoverEffect = {
    y: -3,
    transition: { type: 'spring', stiffness: 300 }
  };

  return (
    <footer className="bg-[#1e3a8a] text-gray-300 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Logo & Tagline */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {/* Changed h-12 w-12 to h-16 w-16 */}
              <img 
                src="/logo.jpg" 
                alt="Dental Perfections Logo" 
                className="h-16 w-16 rounded-full object-cover"
              />
              <h2 className="text-white font-semibold text-2xl">Dental Perfections</h2>
            </div>
            <p className="text-sm text-gray-400">
              Excellence in dental care with a commitment to your perfect smile.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><motion.a href="#" className="hover:text-white" whileHover={linkHoverEffect}>Home</motion.a></li>
              <li><motion.a href="#" className="hover:text-white" whileHover={linkHoverEffect}>About Us</motion.a></li>
              <li><motion.a href="#" className="hover:text-white" whileHover={linkHoverEffect}>Our Services</motion.a></li>
              <li><motion.a href="#" className="hover:text-white" whileHover={linkHoverEffect}>Smile Gallery</motion.a></li>
              <li><motion.a href="#" className="hover:text-white" whileHover={linkHoverEffect}>Blog</motion.a></li>
              <li><motion.a href="#" className="hover:text-white" whileHover={linkHoverEffect}>FAQ</motion.a></li>
              <li><motion.a href="#" className="hover:text-white" whileHover={linkHoverEffect}>Contact Us</motion.a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FaPhone className="text-[#34d399]" />
                <span>+91 XXXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#34d399]" />
                <motion.a href="mailto:info@dentalperfections.in" className="hover:text-white" whileHover={linkHoverEffect}>
                  info@dentalperfections.in
                </motion.a>
              </li>
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#34d399]" />
                <span>Mumbai, Maharashtra</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Clinic Hours */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Clinic Hours</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-gray-700 py-1"><span>Mon - Fri:</span> <span>9:00 AM - 7:00 PM</span></li>
              <li className="flex justify-between border-b border-gray-700 py-1"><span>Saturday:</span> <span>9:00 AM - 3:00 PM</span></li>
              <li className="flex justify-between border-b border-gray-700 py-1"><span>Sunday:</span> <span>Closed</span></li>
            </ul>
          </div>

        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {year} Dental Perfections. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;