import React, { useState } from 'react';
import { createPrescription } from '../api';
import { FiPlusCircle, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

// Props:
// historyEntryId: The ID of the DentalHistory record to attach the prescription to.
// onPrescriptionAdded: Callback function to refresh the parent view (DoctorDashboard).
const PrescriptionForm = ({ historyEntryId, onPrescriptionAdded }) => {
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Success or Error message

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await createPrescription({
        ...formData,
        history_entry: historyEntryId, // Attach to the current history ID
      });
      
      setMessage({ type: 'success', text: 'Prescription added.' });
      setFormData({ medicine_name: '', dosage: '', instructions: '' }); // Reset form
      onPrescriptionAdded(); // Notify parent to refresh patient data

    } catch (err) {
      console.error("Prescription Error:", err);
      setMessage({ type: 'error', text: err.message || 'Failed to add prescription.' });
    } finally {
      setLoading(false);
      // Clear success/error message after a delay
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 bg-white p-3 rounded-lg shadow-inner">
      <h4 className="font-semibold text-sm text-blue-900 mb-3 flex items-center gap-2">
        <FiPlusCircle /> Add Prescription
      </h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            name="medicine_name"
            placeholder="Medicine Name (e.g., Amoxicillin)"
            value={formData.medicine_name}
            onChange={handleChange}
            required
            className="col-span-1 sm:col-span-2 p-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            name="dosage"
            placeholder="Dosage (e.g., 500mg)"
            value={formData.dosage}
            onChange={handleChange}
            className="col-span-1 p-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            name="instructions"
            placeholder="Instructions (e.g., BID after food)"
            value={formData.instructions}
            onChange={handleChange}
            className="col-span-1 p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        
        {message && (
          <div className={`flex items-center gap-2 text-xs p-2 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
            <span>{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !historyEntryId}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiPlusCircle />}
          Save Prescription
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;