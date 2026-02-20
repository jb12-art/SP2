// js/api/listingDetailsApi.js

'use strict';

import { API_BASE, API_KEY } from './config.js';

// get single listing details
export async function getListingDetails(id) {
  const response = await fetch(
    `${API_BASE}/auction/listings/${id}?_seller=true&_bids=true`,
    {
      headers: {
        'X-Noroff-API-Key': API_KEY,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Failed to load listing');
  }

  return data.data;
}

// get listing with bids refresh
export async function getListingWithBids(id) {
  const response = await fetch(
    `${API_BASE}/auction/listings/${id}?_bids=true&_seller=true`,
    {
      headers: {
        'X-Noroff-API-Key': API_KEY,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Failed to load bids');
  }

  return data.data;
}
