// js/pages/listing.js
'use strict';

import { getListing } from '../api/listingsApi.js';

// Get id from URL
const params = new URLSearchParams(window.location.search);
const listingId = params.get('id');

const title = document.querySelector('#listingTitle');
const description = document.querySelector('#listingDescription');

async function loadListing() {
  try {
    const listing = await getListing(listingId);

    title.textContent = listing.title;
    description.textContent = listing.description;
  } catch (error) {
    console.error(error);
  }
}

loadListing();
