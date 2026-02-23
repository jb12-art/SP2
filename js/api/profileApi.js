// js/api/profileApi.js

'use strict';

import { API_BASE, API_KEY } from './config.js';

// ============
// get single profile
// ============
export async function getProfile() {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  if (!token || !name) {
    throw new Error('Not logged in');
  }

  const response = await fetch(
    `${API_BASE}/auction/profiles/${name}?_listings=true&_bids=true&_count=true&_seller=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': API_KEY,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Failed to load profile');
  }

  return data.data;
}

// ===============
// update profile
// ===============
export async function updateProfile(updates) {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const response = await fetch(`${API_BASE}/auction/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Failed to update profile');
  }

  return data.data;
}

// =================
// get all profiles
// =================
export async function getAllProfiles() {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Not logged in');
  }

  const response = await fetch(`${API_BASE}/auction/profiles`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Failed to load profiles');
  }

  return data.data;
}

// ============================
// get all listings by profile
// ============================
export async function getProfileListings(name) {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `${API_BASE}/auction/profiles/${name}/listings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': API_KEY,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.errors?.[0]?.message || 'Failed to load profile listings',
    );
  }

  return data.data;
}

// ========================
// get all bids by profile
// ========================
export async function getProfileBids(name) {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `${API_BASE}/auction/profiles/${name}/bids?_listings=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': API_KEY,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Failed to load profile bids');
  }

  return data.data;
}

// ========================
// get all wins by profile
// ========================
export async function getProfileWins(name) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Not logged in');
  }

  const response = await fetch(`${API_BASE}/auction/profiles/${name}/wins`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Failed to load profile wins');
  }

  return data.data;
}

// =====================
// refresh user credits
// =====================
export async function refreshCredits() {
  const profile = await getProfile();

  // store latest credits globally
  localStorage.setItem('credits', profile.credits);

  // notify UI that credits changed
  window.dispatchEvent(new Event('creditsUpdated'));

  return profile.credits;
}
