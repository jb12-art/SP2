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
