import React, { useState, useEffect } from 'react';
import { getReviews } from '../api';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const PatientReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch reviews from your Django API
    getReviews()
      .then(data => setReviews(data))
      .catch(error => console.error("There was an error fetching the reviews!", error));
  }, []);

  if (reviews.length === 0) {
    return null; // Don't render anything if there are no reviews
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">What Our Patients Say</h2>
        <p className="text-lg text-gray-600 mb-12">
          Read the experiences of our valued patients.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg text-left"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
              </div>
              <p className="text-gray-600 italic mb-4">"{review.review_text}"</p>
              <h3 className="font-semibold text-right">- {review.patient_name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PatientReviews;