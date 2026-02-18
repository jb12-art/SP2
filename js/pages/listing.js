// js/pages/listing.js
'use strict';

import {
  getListingDetails,
  getListingWithBids,
} from '../api/listingDetailsApi.js';
import { placeBid } from '../api/bids.js';

// Get id from URL
const params = new URLSearchParams(window.location.search);
const listingId = params.get('id');
console.log('Listing ID:', listingId);

if (!listingId) {
  console.error('No listing ID found in URL');
}

const bidBtn = document.querySelector('#placeBidBtn');
const bidInput = document.querySelector('#bidAmount');
const bidMessage = document.querySelector('#bidMessage');

const token = localStorage.getItem('token');

const bidHistory = document.querySelector('#bidHistory');
const highestBidElement = document.querySelector('#currentBid');

let currentPrice = 0;

const image = document.querySelector('#listingImage');
const title = document.querySelector('#listingTitle');
const description = document.querySelector('#listingDescription');
const seller = document.querySelector('#listingSeller');

// bid button click event
bidBtn.addEventListener('click', async () => {
  const bidValue = Number(bidInput.value);

  bidMessage.textContent = '';

  if (!bidValue || bidValue <= currentPrice) {
    bidMessage.textContent = 'Bid must be higher than current price';
    return;
  }

  try {
    await placeBid(listingId, bidValue, token);

    bidMessage.textContent = 'Bid placed!';
    currentPrice = bidValue;
  } catch (error) {
    bidMessage.textContent = error.message;
  }
});

// render bids
function renderBids(bids) {
  bidHistory.innerHTML = '';

  // newest bid first
  bids
    .sort((a, b) => b.amount - a.amount)
    .forEach((bid) => {
      const li = document.createElement('li');
      li.textContent = `${bid.bidder.name}: ${bid.amount} credits`;
      bidHistory.appendChild(li);
    });
}

// latest bid
async function refreshBids() {
  try {
    const listing = await getListingWithBids(listingId);

    const bids = listing.bids || [];

    if (bids.length > 0) {
      const highestBid = Math.max(...bids.map((b) => b.amount));

      currentPrice = highestBid;
      highestBidElement.textContent = `${highestBid} credits`;
    }

    renderBids(bids);
  } catch (error) {
    console.error(error);
  }
}

async function loadListing() {
  try {
    const listing = await getListingWithBids(listingId);

    image.src = listing.media?.[0]?.url || 'https://placehold.co/600x400';
    image.alt = listing.title;

    title.textContent = listing.title;
    description.textContent = listing.description || 'No description provided';
    seller.textContent = listing.seller?.name || 'Seller is anonymous';

    const bids = listing.bids || [];

    renderBids(bids);

    if (bids.length > 0) {
      const highestBid = Math.max(...bids.map((b) => b.amount));
      currentPrice = highestBid;
      highestBidElement.textContent = `${highestBid} credits`;
    }
  } catch (error) {
    console.error(error.message);
  }
}

loadListing();
setInterval(refreshBids, 1000);
