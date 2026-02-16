// js/api/bids.js

'use strict';

import { API_BASE, API_KEY } from './config.js';

// bid API function
export async function placeBid(listingId, amount, token) {
  const response = await fetch(
    `${API_BASE}/auction/listings/${listingId}/bids`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': API_KEY,
      },
      body: JSON.stringify({
        amount: Number(amount),
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Bid failed');
  }

  return data;
}
