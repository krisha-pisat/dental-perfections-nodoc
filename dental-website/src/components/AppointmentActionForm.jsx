import React, { useState } from 'react';
import { updateAppointmentStatus } from '../api';
import { FiCheck, FiX, FiLoader, FiAlertCircle, FiCalendar, FiClock, FiUser, FiFileText } from 'react-icons/fi';

// Helper to format date and time for display
const formatDateTime = (date, time) => {
    if (!date) return 'Not yet scheduled';
    const dateObj = new Date(`${date}T${time || '00:00:00'}`);
    if (isNaN(dateObj)) return 'Invalid Date';
    return dateObj.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    }) + (time ? ` • ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : '');
};

const AppointmentActionForm = ({ appointment, onStatusUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Doctor sets these values
    const [finalDate, setFinalDate] = useState(appointment.appointment_date || '');
    const [finalTime, setFinalTime] = useState(appointment.appointment_time || '');

    // Status Badge Styles
    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const handleConfirm = async () => {
        if (!finalDate || !finalTime) {
            alert("Please set an Appointment Date and Time before confirming.");
            return;
        }
        if (!window.confirm(`Confirm appointment for ${finalDate} at ${finalTime}?`)) return;

        setError(null);
        setLoading(true);

        try {
            await updateAppointmentStatus(appointment.id, 'CONFIRMED', finalDate, finalTime);
            onStatusUpdated(); 
        } catch (err) {
            console.error("Status Update Error:", err);
            setError(err.message || `Failed to confirm.`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm(`Are you sure you want to cancel this request?`)) return;
        setLoading(true);
        try {
            await updateAppointmentStatus(appointment.id, 'CANCELLED');
            onStatusUpdated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isActionable = appointment.status === 'PENDING';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
            {/* --- Header: Patient Name & Status --- */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <FiUser className="text-lg" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 text-base leading-tight">
                            {appointment.patient_name || appointment.patient_username || "Unknown Patient"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                            <FiClock className="text-gray-400" />
                            <span>Req: {formatDateTime(appointment.appointment_date, appointment.appointment_time)}</span>
                        </p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(appointment.status)}`}>
                    {appointment.status}
                </span>
            </div>

            {/* --- Body: Service & Notes --- */}
            <div className="space-y-2 mb-5">
                <div className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-gray-700 min-w-[60px]">Service:</span>
                    <span className="text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded text-xs inline-block mt-0.5">
                        {appointment.service_requested}
                    </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-gray-700 min-w-[60px]">Notes:</span>
                    <span className="text-gray-500 italic text-xs mt-0.5">
                        "{appointment.notes || 'No additional notes provided.'}"
                    </span>
                </div>
            </div>

            {/* --- Action Area: Assign Slot --- */}
            {isActionable && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                        <FiCalendar className="text-blue-500" />
                        Assign Appointment Slot
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="relative">
                            <label className="text-[10px] text-gray-400 font-semibold mb-1 block">DATE</label>
                            <input 
                                type="date" 
                                className="w-full text-sm p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
                                value={finalDate}
                                onChange={(e) => setFinalDate(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <label className="text-[10px] text-gray-400 font-semibold mb-1 block">TIME</label>
                            <input 
                                type="time" 
                                className="w-full text-sm p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
                                value={finalTime}
                                onChange={(e) => setFinalTime(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* --- Buttons --- */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                            Confirm
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50"
                        >
                            <span className="sr-only">Cancel</span>
                            <FiX className="text-lg" />
                        </button>
                    </div>
                </div>
            )}

            {/* --- Error Message --- */}
            {error && (
                <div className="mt-3 flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-md border border-red-100">
                    <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default AppointmentActionForm;