// js/pages/home.js

'use strict';

import { API_BASE } from '../api/config.js';
import { createListingcard } from '../ui/createListingCard.js';

// searchBar input
const searchInput = document.querySelector('#searchItem');
// Container for saleItems
const saleItemsContainer = document.querySelector('#saleItems');
// filter newest item
const filterNewestBtn = document.querySelector('#filterNewest');
// tag filter
const tagFilter = document.querySelector('#tagFilter');

let currentListings = [];

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
searchInput.addEventListener('input', (event) => {
  tagFilter.value = ''; // reset tag filter
});

// function saleItems
async function fetchListings() {
  try {
    const response = await fetch(`${API_BASE}/auction/listings?_seller=true`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch listings...');
    }

    currentListings = data.data;
    renderListings(currentListings);
  } catch (error) {
    saleItemsContainer.textContent = error.message;
  }
}

// tag filter
async function fetchListingsByTag(tag) {
  try {
    const response = await fetch(
      `${API_BASE}/auction/listings?_tag=${encodeURIComponent(tag)}&_active=true&_seller=true`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to filter listings');
    }

    currentListings = data.data;
    renderListings(currentListings);
  } catch (error) {
    saleItemsContainer.textContent = error.message;
  }
}

// saleItemsContainer function
function renderListings(listings) {
  saleItemsContainer.innerHTML = '';

  listings.forEach((item) => {
    const card = createListingcard(item);
    saleItemsContainer.appendChild(card);
  });
}

// tag filter
tagFilter.addEventListener('change', (event) => {
  const selectedTag = event.target.value;

  if (!selectedTag) {
    fetchListings(); // show all listings
  } else {
    fetchListingsByTag(selectedTag); // filter by tag
  }
});

// filter newest item
function sortNewest() {
  const sorted = [...currentListings].sort(
    (a, b) => new Date(b.created) - new Date(a.created),
  );

  renderListings(sorted);
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
filterNewestBtn.addEventListener('click', sortNewest);
