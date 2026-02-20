// js/ui/createListingcard.js

'use strict';

export function createListingcard(listing) {
  const card = document.createElement('div');

  card.className = 'listing-card border p-1';

  card.innerHTML = `
  <a href="listing.html?id=${listing.id}" class="block">
  <img
  src="${listing.media?.[0]?.url || 'https://placehold.co/600x400'}"
  alt="${listing.title}"
  onerror="this.onerror=null; this.src='https://placehold.co/600x400';" />

  <hr/>
  <h3>
  <strong>Title:</strong>
  ${listing.title}</h3>
  <hr/>
  <p>
  <strong>Seller:</strong>
  ${listing.seller?.name || 'Seller is anonymous'}
  </p>
  <hr/>
  <p><strong>Ends:</strong> ${new Date(listing.endsAt).toLocaleDateString()}</p>
  </a>
  `;

  return card;
}
