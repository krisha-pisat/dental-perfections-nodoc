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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await addReview({ rating, review_text, image });
      setSuccess(true);
      setRating(0);
      setReviewText('');
      removeImage();
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
            Add a Photo <span className="text-gray-400 font-normal">(optional)</span>
          </label>

          {preview ? (
            <div className="relative w-40">
              <img src={preview} alt="Preview" className="w-40 h-32 object-cover rounded-lg border border-gray-200" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <FiX size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-5 py-4 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center"
            >
              <FiUpload /> Click to upload a photo (max 5MB)
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
