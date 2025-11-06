import React, { useState } from 'react';
import { updateAppointmentStatus } from '../api';
import { FiCheck, FiX, FiLoader, FiAlertCircle, FiCalendar } from 'react-icons/fi'; // <-- ADD FiCalendar

// Helper to format date and time
const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    if (isNaN(dateObj)) return 'Invalid Date';
    return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }) + ' on ' + dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const AppointmentActionForm = ({ appointment, onStatusUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Determines the appropriate color for the status pill
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-300';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) {
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await updateAppointmentStatus(appointment.id, newStatus);
            onStatusUpdated(); // Refresh the list
        } catch (err) {
            console.error("Status Update Error:", err);
            setError(err.message || `Failed to update status to ${newStatus}.`);
        } finally {
            setLoading(false);
        }
    };

    // If the appointment is already confirmed/cancelled/completed, we show status and not buttons
    const isActionable = appointment.status === 'PENDING';

    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-3">
                {/* Patient Info */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {appointment.patient_name || appointment.patient_username}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FiCalendar className="text-blue-500" /> {/* <-- FiCalendar is used here */}
                        {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                    </p>
                </div>
                {/* Status Pill */}
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                </span>
            </div>

            <p className="text-sm font-medium text-blue-700 mb-2">
                Service: <span className="font-normal text-gray-600">{appointment.service_requested}</span>
            </p>
            <p className="text-sm font-medium text-gray-700">
                Notes: <span className="font-normal text-gray-600">{appointment.notes || 'N/A'}</span>
            </p>

            {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-md mt-3">
                    <FiAlertCircle />
                    <span>{error}</span>
                </div>
            )}

            {isActionable && (
                <div className="mt-4 pt-4 border-t flex gap-3">
                    <button
                        onClick={() => handleStatusChange('CONFIRMED')}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                        Confirm
                    </button>
                    <button
                        onClick={() => handleStatusChange('CANCELLED')}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                    >
                        <FiX />
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentActionForm;