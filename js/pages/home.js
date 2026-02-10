// js/pages/home.js

'use-strict';

import { API_BASE } from '../api/config.js';
// import { createApiKey } from '../api/createApiKey.js';

// searchBar input
const searchInput = document.querySelector('#searchItem');
// Container for saleItems
const saleItemsContainer = document.querySelector('#saleItems');

// search bar function
async function searchListings(query) {
  try {
    const response = await fetch(
      `${API_BASE}/auction/listings/search?q=${encodeURIComponent(query)}&title=true&description=true`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Search failed');
    }

    renderListings(data.data);
  } catch (error) {
    saleItemsContainer.textContent = error.message;
  }
}

// function saleItems
async function fetchListings() {
  try {
    const response = await fetch(`${API_BASE}/auction/listings`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch listings...');
    }

    renderListings(data.data);
  } catch (error) {
    saleItemsContainer.textContent = error.message;
  }
}

// saleItemsContainer function
function renderListings(listings) {
  saleItemsContainer.innerHTML = '';

  listings.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('listing-card');

    card.innerHTML = `
    <img
    src="${item.media?.[0]?.url || 'https://placehold.co/600x400'}"
    alt="${item.title}"
    onerror="this.onerror=null; this.src='https://placehold.co/600x400';"
    />
    <h3>${item.title}</h3>
    <p>${item.description || ' No description provided'}</p>
    <p><strong>Ends:</strong> ${new Date(item.endsAt).toLocaleDateString()}</p>
    `;

    saleItemsContainer.appendChild(card);
  });
}

// search bar function
searchInput.addEventListener('input', (event) => {
  const query = event.target.value.trim();

  if (query === '') {
    fetchListings(); // show all items again
  } else {
    searchListings(query);
  }
});

fetchListings();
// createApiKey();
