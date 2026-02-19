// js/api/listingsApi.js

'use strict';

import { API_BASE, API_KEY } from './config.js';

export async function getListing(id) {
  const response = await fetch(`${API_BASE}/auction/listings/${id}`, {
    headers: {
      'X-Noroff-API-Key': API_KEY,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to load listing');
  }

  return data.data;
}

// update title/description/media to API
export async function updateListing(id, updateData, token) {
  const response = await fetch(`${API_BASE}/auction/listings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(updateData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to update listing');
  }

  return data.data;
}

// delete listing
export async function deleteListing(id, token) {
  const response = await fetch(`${API_BASE}/auction/listings/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Noroff-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete listing');
  }
}
