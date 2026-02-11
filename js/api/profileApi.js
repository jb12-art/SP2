// js/api/profileApi.js

'use strict';

import { API_BASE, API_KEY } from './config.js';

// get profile
export async function getProfile() {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  if (!token || !name) {
    throw new Error('Not logged in');
  }

  const response = await fetch(
    `${API_BASE}/auction/profiles/${name}?_listings=true&_wins=true`,
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

// update profile
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
