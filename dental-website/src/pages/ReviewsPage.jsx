import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddReviewForm from '../components/AddReviewForm';
import { getReviews } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const StarDisplay = ({ rating, size = 'sm' }) => {
  const s = size === 'lg' ? 20 : 14;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        i <= rating
          ? <FaStar key={i} size={s} className="text-yellow-400" />
          : <FaRegStar key={i} size={s} className="text-gray-300" />
      ))}
    </div>
  );
};

const ReviewText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 160;
  const isLong = text.length > limit;
  return (
    <p className="text-gray-600 text-sm leading-relaxed mt-3 flex-1 italic">
      "{isLong && !expanded ? text.slice(0, limit).trimEnd() + '…' : text}"
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="ml-1 text-blue-600 font-medium not-italic hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </p>
  );
};

const AVATAR_COLORS = [
  'bg-blue-700', 'bg-emerald-600', 'bg-violet-600',
  'bg-rose-600', 'bg-amber-600', 'bg-cyan-600',
];

// ── Lightbox ──
const Lightbox = ({ photos, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent(c => (c - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % photos.length), [photos.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        onClick={onClose}
      >
        <FiX size={22} />
      </button>

      {/* Counter */}
      {photos.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {current + 1} / {photos.length}
        </div>
      )}

      {/* Prev */}
      {photos.length > 1 && (
        <button
          className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <FiChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={photos[current]}
          alt="Review photo"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>

      {/* Next */}
      {photos.length > 1 && (
        <button
          className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <FiChevronRight size={24} />
        </button>
      )}

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0);
  const [lightbox, setLightbox] = useState(null); // { photos: [...], index: 0 }
  const { user } = useAuth();

  const fetchReviews = () => {
    setLoading(true);
    getReviews()
      .then(data => { setReviews(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const total = reviews.length;
  const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '—';
  const countByRating = (star) => reviews.filter(r => r.rating === star).length;
  const filtered = filterRating === 0 ? reviews : reviews.filter(r => r.rating === filterRating);

  return (
    <div>
      <Navbar />

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* ── Hero ── */}
      <section className="bg-[#1e3a8a] pt-36 pb-16 px-6 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">
          Patient Reviews
        </h1>
        <p className="text-blue-200 text-lg max-w-xl mx-auto">
          Real experiences from real patients. See what our community has to say.
        </p>
      </section>

      {/* ── Rating Summary ── */}
      <section className="bg-white border-b border-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="text-center flex-shrink-0">
            <div className="text-7xl font-bold text-blue-900">{avg}</div>
            <StarDisplay rating={Math.round(Number(avg))} size="lg" />
            <p className="text-gray-500 text-sm mt-2">{total} review{total !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = countByRating(star);
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                  className={`w-full flex items-center gap-3 text-sm group ${filterRating === star ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                >
                  <span className="w-6 text-right font-medium text-gray-600">{star}</span>
                  <FaStar className="text-yellow-400 flex-shrink-0" size={14} />
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${filterRating === star ? 'bg-blue-900' : 'bg-yellow-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-left text-gray-500">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Filter Pills ── */}
      <section className="bg-gray-50 py-6 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex gap-2 flex-wrap">
          {[0, 5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterRating === star
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {star === 0 ? `All (${total})` : `${star}★ (${countByRating(star)})`}
            </button>
          ))}
        </div>
      </section>

      {/* ── Reviews Grid ── */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-400 py-16">Loading reviews...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No reviews yet for this rating.</p>
              <button onClick={() => setFilterRating(0)} className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                Show all reviews
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((review, index) => {
                const photos = (review.images || []).map(img => img.image).filter(Boolean);
                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
                  >
                    {/* Avatar + name + date */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-11 w-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
                        {getInitials(review.patient_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{review.patient_name || 'Anonymous'}</p>
                        {review.created_at && (
                          <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                        )}
                      </div>
                    </div>

                    {/* Stars */}
                    <StarDisplay rating={review.rating} />

                    {/* Review text */}
                    <ReviewText text={review.review_text} />

                    {/* Photo thumbnails — click to open lightbox */}
                    {photos.length > 0 && (
                      <div className={`mt-4 grid gap-1.5 ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {photos.slice(0, 4).map((src, i) => (
                          <button
                            key={i}
                            onClick={() => setLightbox({ photos, index: i })}
                            className={`relative overflow-hidden rounded-xl focus:outline-none group ${photos.length === 1 ? 'aspect-[4/3]' : 'aspect-square'}`}
                          >
                            <img
                              src={src}
                              alt="Review photo"
                              className="absolute inset-0 w-full h-full object-cover group-hover:brightness-90 transition-all duration-200"
                            />
                            {i === 3 && photos.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                +{photos.length - 4}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Write a Review ── */}
      <section className="bg-white py-16 px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl font-bold text-blue-900 mb-2">Share Your Experience</h2>
            <p className="text-gray-500">Visited Dental Perfections? We'd love to hear from you.</p>
          </div>

          {user ? (
            <AddReviewForm onReviewAdded={fetchReviews} />
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-10 text-center">
              <p className="text-gray-700 font-medium mb-2">You need to be logged in to leave a review.</p>
              <p className="text-gray-500 text-sm mb-6">Only registered patients can submit reviews.</p>
              <Link
                to="/login"
                className="bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Patient Login
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
