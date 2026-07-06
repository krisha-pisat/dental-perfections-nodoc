import React, { useState, useRef } from 'react';
import { addReview } from '../api';
import { FaStar } from 'react-icons/fa';
import { FiUpload, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((val) => (
        <label key={val}>
          <input type="radio" name="rating" value={val} onClick={() => setRating(val)} className="hidden" />
          <FaStar
            className="cursor-pointer transition-colors"
            color={val <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
            size={28}
            onMouseEnter={() => setHover(val)}
            onMouseLeave={() => setHover(null)}
          />
        </label>
      ))}
    </div>
  );
};

const AddReviewForm = ({ onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [review_text, setReviewText] = useState('');
  const [images, setImages] = useState([]); // array of File objects
  const [previews, setPreviews] = useState([]); // array of object URLs
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const oversized = files.find(f => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setError(`"${oversized.name}" exceeds 5MB. Please choose a smaller file.`);
      return;
    }

    const combined = [...images, ...files].slice(0, 5); // max 5 photos
    setImages(combined);
    setPreviews(combined.map(f => URL.createObjectURL(f)));
    setError(null);
    // reset input so same file can be re-added after removal
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await addReview({ rating, review_text, images });
      setSuccess(true);
      setRating(0);
      setReviewText('');
      setImages([]);
      setPreviews([]);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Write a Review</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
          <textarea
            rows="4"
            value={review_text}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your experience at Dental Perfections..."
            required
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos <span className="text-gray-400 font-normal">(optional, up to 5)</span>
          </label>

          {/* Previews grid */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt={`preview ${i + 1}`} className="w-24 h-20 object-cover rounded-lg border border-gray-200" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <FiX size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button — hide when 5 reached */}
          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-5 py-4 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center"
            >
              <FiUpload />
              {images.length === 0 ? 'Click to upload photos (max 5MB each)' : `Add more (${images.length}/5)`}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            <FiCheckCircle /> Thank you! Your review has been submitted and will appear after approval.
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;
