// src/api.js

// Get the base API VITE_API_URL (from .env or fallback to localhost)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// -------------------- PUBLIC API FUNCTIONS --------------------

export async function getBlogPosts() {
  const res = await fetch(`${API_BASE}/api/blog/posts/`);
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return await res.json();
}

export async function getFaqCategories() {
  const res = await fetch(`${API_BASE}/api/faq/categories/`);
  if (!res.ok) throw new Error('Failed to fetch FAQ categories');
  return await res.json();
}

export async function getReviews() {
  // Updated URL based on your reviews/urls.py
  const res = await fetch(`${API_BASE}/api/reviews/`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return await res.json();
}

// -------------------- PATIENT AUTH FUNCTIONS (JWT) --------------------

/**
 * Logs in a user and stores tokens in localStorage.
 * @param {string} username
 * @param {string} password
 */
export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/api/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to log in');
  }

  const data = await res.json();
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
}

/**
 * Registers a new user.
 * @param {object} userData - { username, password, email, first_name, last_name }
 */
export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/api/users/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessages = Object.values(errorData).join(' ');
    throw new Error(errorMessages || 'Failed to register');
  }

  return await res.json();
}

/**
 * Logs out the user by clearing tokens.
 */
export function logoutUser() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/**
 * Fetches the current user's details using the stored token.
 */
export async function getCurrentUser() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found');
  }

  const res = await fetch(`${API_BASE}/api/users/me/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user details');
  }
  return await res.json();
}

// -------------------- DOCTOR/ADMIN SECURE FUNCTIONS (COOKIES) --------------------

/**
 * Fetches all patient data for the dashboard.
 * Uses admin cookie.
 */
export async function getPatients() {
  const res = await fetch(`${API_BASE}/api/patients/patients/`, {
    credentials: 'include', // Uses admin cookie
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error('Not authorized. Please log in via the /admin panel.');
  }
  if (!res.ok) {
    throw new Error('Failed to fetch patients');
  }
  return await res.json();
}

/**
 * Creates a new dental history entry.
 * Uses admin cookie.
 * @param {object} historyData - { patient (ID), notes, treatment_provided }
 */
export async function createHistoryEntry(historyData) {
  const res = await fetch(`${API_BASE}/api/patients/history/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Uses admin cookie
    body: JSON.stringify(historyData),
  });
  if (!res.ok) throw new Error('Failed to create history entry');
  return await res.json();
}

/**
 * Creates a new prescription.
 * Uses admin cookie.
 * @param {object} presData - { history_entry (ID), medicine_name, dosage, instructions }
 */
export async function createPrescription(presData) {
  const res = await fetch(`${API_BASE}/api/patients/prescriptions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Uses admin cookie
    body: JSON.stringify(presData),
  });
  if (!res.ok) throw new Error('Failed to create prescription');
  return await res.json();
}

// --- NEW FUNCTION: Fetch all appointments for staff ---
export async function getAppointments() {
    const res = await fetch(`${API_BASE}/api/patients/appointments/`, {
        credentials: 'include', // Uses admin cookie
    });
    if (res.status === 401 || res.status === 403) {
        throw new Error('Not authorized. Please log in via the /admin panel.');
    }
    if (!res.ok) {
        throw new Error('Failed to fetch appointments');
    }
    return await res.json();
}

// --- NEW FUNCTION: Update appointment status for staff ---
/**
 * Updates an appointment's status (used by the staff dashboard).
 * @param {number} id - Appointment ID
 * @param {string} status - New status (e.g., 'CONFIRMED', 'CANCELLED')
 */
export async function updateAppointmentStatus(id, status) {
    const res = await fetch(`${API_BASE}/api/patients/appointments/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Uses admin cookie
        body: JSON.stringify({ status }),
    });
    if (res.status === 401 || res.status === 403) {
        throw new Error('Not authorized. Please log in via the /admin panel.');
    }
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessages = Object.values(errorData).flat().join(' ');
        throw new Error(errorMessages || 'Failed to update appointment status.');
    }
    return await res.json();
}


// -------------------- PATIENT SECURE FUNCTIONS (JWT) --------------------

/**
 * Fetches the logged-in patient's own profile and history.
 * Uses JWT Token.
 */
export async function getMyProfile() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found. Please log in.');
  }

  const res = await fetch(`${API_BASE}/api/patients/me/`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Uses JWT token
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('Authorization failed. Please log in again.');
  }
  if (!res.ok) {
    throw new Error('Failed to fetch your profile');
  }
  return await res.json();
}

/**
 * Submits a new review.
 * Uses JWT Token.
 * @param {object} reviewData - { rating (number), review_text (string) }
 */
export async function addReview(reviewData) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found. Please log in.');
  }

  const res = await fetch(`${API_BASE}/api/reviews/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // <-- Send the auth token
    },
    body: JSON.stringify(reviewData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit your review.');
  }
  return await res.json();
}

// --- NEW FUNCTION: APPOINTMENT BOOKING ---
/**
 * Submits a new appointment request.
 * Uses JWT Token.
 * @param {object} appointmentData - { service_requested (string), appointment_date (string 'YYYY-MM-DD'), appointment_time (string 'HH:MM:SS'), notes (string) }
 */
export async function createAppointment(appointmentData) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token found. Please log in.');
  }

  const res = await fetch(`${API_BASE}/api/patients/appointments/`, { // <-- New API Endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // <-- Send the auth token
    },
    body: JSON.stringify(appointmentData),
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('Authorization failed. Please log in again.');
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // Flatten and join error messages for display
    const errorMessages = Object.values(errorData).flat().join(' ');
    throw new Error(errorMessages || 'Failed to book appointment.');
  }
  return await res.json();
}