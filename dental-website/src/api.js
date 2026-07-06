// src/api.js

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
  const res = await fetch(`${API_BASE}/api/reviews/`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return await res.json();
}

// -------------------- PATIENT AUTH FUNCTIONS (JWT) --------------------

export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to log in');
  }

  const data = await res.json();
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  // clear any leftover staff session
  localStorage.removeItem('staff_access_token');
  localStorage.removeItem('staff_refresh_token');
  return data;
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/api/users/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessages = Object.values(errorData).join(' ');
    throw new Error(errorMessages || 'Failed to register');
  }

  return await res.json();
}

export function logoutUser() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export async function loginStaff(username, password) {
  const res = await fetch(`${API_BASE}/api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Invalid credentials');
  }
  const data = await res.json();
  localStorage.setItem('staff_access_token', data.access);
  localStorage.setItem('staff_refresh_token', data.refresh);
  // clear any leftover patient session
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return data;
}

export async function getStaffUser() {
  const token = localStorage.getItem('staff_access_token');
  if (!token) throw new Error('No staff token found');
  const res = await fetch(`${API_BASE}/api/users/me/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch staff details');
  return await res.json();
}

export function logoutStaff() {
  localStorage.removeItem('staff_access_token');
  localStorage.removeItem('staff_refresh_token');
}

export async function getCurrentUser() {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found');

  const res = await fetch(`${API_BASE}/api/users/me/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Failed to fetch user details');
  return await res.json();
}

// -------------------- DOCTOR/ADMIN SECURE FUNCTIONS (COOKIES) --------------------

export async function getPatients() {
  const res = await fetch(`${API_BASE}/api/patients/patients/`, {
    credentials: 'include',
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error('Not authorized. Please log in via the /admin panel.');
  }
  if (!res.ok) throw new Error('Failed to fetch patients');
  return await res.json();
}

export async function createHistoryEntry(historyData) {
  const res = await fetch(`${API_BASE}/api/patients/history/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(historyData),
  });
  if (!res.ok) throw new Error('Failed to create history entry');
  return await res.json();
}

export async function createPrescription(presData) {
  const res = await fetch(`${API_BASE}/api/patients/prescriptions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(presData),
  });
  if (!res.ok) throw new Error('Failed to create prescription');
  return await res.json();
}

export async function getAppointments() {
    const res = await fetch(`${API_BASE}/api/patients/appointments/`, {
        credentials: 'include',
    });
    if (res.status === 401 || res.status === 403) {
        throw new Error('Not authorized. Please log in via the /admin panel.');
    }
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return await res.json();
}

// *** UPDATED FUNCTION: Now supports sending date and time ***
export async function updateAppointmentStatus(id, status, date = null, time = null) {
    const payload = { status };
    if (date) payload.appointment_date = date; 
    if (time) payload.appointment_time = time; 

    const res = await fetch(`${API_BASE}/api/patients/appointments/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
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

export async function updateMyProfile(data) {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');

  const res = await fetch(`${API_BASE}/api/patients/me/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
}

export async function getMyProfile() {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');

  const res = await fetch(`${API_BASE}/api/patients/me/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('Authorization failed. Please log in again.');
  }
  if (!res.ok) throw new Error('Failed to fetch your profile');
  return await res.json();
}

export async function addReview(reviewData) {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');

  const res = await fetch(`${API_BASE}/api/reviews/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit your review.');
  }
  return await res.json();
}

export async function createAppointment(appointmentData) {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token found. Please log in.');

  const res = await fetch(`${API_BASE}/api/patients/appointments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error('Authorization failed. Please log in again.');
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessages = Object.values(errorData).flat().join(' ');
    throw new Error(errorMessages || 'Failed to book appointment.');
  }
  return await res.json();
}