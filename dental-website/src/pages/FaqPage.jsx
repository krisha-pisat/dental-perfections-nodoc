import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFaqCategories } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AccordionItem from '../components/AccordionItem';
import { FiPhone, FiMessageSquare, FiMapPin, FiStar, FiCalendar, FiHeart, FiSmile, FiDollarSign, FiHelpCircle } from 'react-icons/fi'; // Added more icons

// Use React Icons for categories
const categoryIcons = {
  "General Questions": <FiHelpCircle className="text-[#f59e0b]" />,
  "Appointments & Scheduling": <FiCalendar className="text-[#f59e0b]" />,
  "Treatments & Procedures": <FiHeart className="text-[#f59e0b]" />, // Example, FiHeart often used for 'care'
  "Anxiety & Comfort": <FiSmile className="text-[#f59e0b]" />,
  "Costs & Insurance": <FiDollarSign className="text-[#f59e0b]" />,
};

const FaqPage = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFaqCategories()
      .then(data => {
        setFaqData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching FAQ data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      {/* Header Section - Adjusted gradient and text colors */}
      <section className="bg-gradient-to-b from-[#E0F7FA]/40 via-white to-white pt-32 pb-20 px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Adjusted tag style */}
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#10b981]/10 text-[#0d5c63] text-sm font-medium rounded-full mb-5 border border-[#10b981]/20">
            <FiHelpCircle /> Frequently Asked Questions
          </span>
          {/* Adjusted heading color */}
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-[#0d5c63] mb-5">
            We're Here to Help
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto"> {/* Adjusted text color */}
            Find answers to common questions about our clinic, treatments, and what to expect during your visit.
          </p>
        </motion.div>
      </section>

      {/* FAQ Accordion Sections - Adjusted card style */}
      <section className="pt-0 pb-16 bg-white px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10"> {/* Reduced gap */}
          {loading ? (
            <p className="text-center text-gray-500">Loading FAQs...</p>
          ) : faqData.length > 0 ? (
            faqData.map((section, index) => (
              <motion.div
                key={section.id}
                // Softer shadow, slightly larger rounding, subtle border
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-gray-100/80"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Adjusted heading style */}
                <h2 className="text-2xl font-semibold text-[#0d5c63] mb-5 flex items-center gap-3">
                  <span className="text-2xl">{categoryIcons[section.name] || <FiHelpCircle className="text-[#f59e0b]" />}</span>
                  {section.name}
                </h2>
                <div>
                  {section.items && section.items.map((item) => (
                    <AccordionItem key={item.id} question={item.question} answer={item.answer} />
                  ))}
                  {(!section.items || section.items.length === 0) && (
                     <p className="text-gray-500 text-sm">No questions in this category yet.</p>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
             <p className="text-center text-gray-500">No FAQs found.</p>
          )}
        </div>
      </section>

      {/* Still Have Questions? Section - Adjusted background and card styles */}
      <section className="py-24 bg-gradient-to-b from-white to-[#E0F7FA]/20 px-6 lg:px-8 text-center"> {/* Soft gradient */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#0d5c63] mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-500 mb-12">
            Our friendly team is always ready to help. Reach out to us through your preferred channel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"> {/* Adjusted gap */}
            {/* Call Us - Adjusted card style */}
            <div className="bg-white p-6 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-gray-100/80 hover:shadow-lg transition-shadow duration-300">
              <FiPhone className="text-3xl text-[#10b981] mx-auto mb-4" /> {/* Adjusted icon color/size */}
              <h3 className="text-xl font-semibold mb-1 text-gray-800">Call Us</h3>
              <p className="text-gray-500 mb-5 text-sm">Speak directly with our team</p>
              {/* Styled phone number like text, not button */}
              <p className="w-full text-center py-2 border border-gray-200 rounded-lg text-gray-600 bg-gray-50 text-base font-medium">
                +91 XXXX XXXX
              </p>
            </div>
            {/* WhatsApp - Adjusted card style */}
            <div className="bg-white p-6 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-gray-100/80 hover:shadow-lg transition-shadow duration-300">
              <FiMessageSquare className="text-3xl text-[#10b981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-1 text-gray-800">WhatsApp</h3>
              <p className="text-gray-500 mb-5 text-sm">Quick chat with our team</p>
              {/* Styled button */}
              <button className="w-full text-center py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">
                Chat Now
              </button>
            </div>
            {/* Book Visit - Adjusted card style */}
            <div className="bg-white p-6 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-gray-100/80 hover:shadow-lg transition-shadow duration-300">
              {/* Changed icon */}
               <FiCalendar className="text-3xl text-[#10b981] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-1 text-gray-800">Book Visit</h3>
              <p className="text-gray-500 mb-5 text-sm">Schedule a consultation</p>
              {/* Styled button */}
              <button className="w-full text-center py-2 bg-[#f59e0b] text-white rounded-lg hover:bg-[#d97706] transition-colors font-medium shadow-sm"> {/* Adjusted gold color */}
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FaqPage;