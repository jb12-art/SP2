// js/pages/listing.js
'use strict';

import {
  getListingDetails,
  getListingWithBids,
} from '../api/listingDetailsApi.js';
import { placeBid } from '../api/bids.js';
import { refreshCredits } from '../api/profileApi.js';
import { deleteListing } from '../api/listingsApi.js';

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

const mainImage = document.querySelector('#mainImage');
const thumbnailRow = document.querySelector('#thumbnailRow');
const title = document.querySelector('#listingTitle');
const description = document.querySelector('#listingDescription');
const seller = document.querySelector('#listingSeller');
const editBtn = document.querySelector('#editListingBtn');
const deleteBtn = document.querySelector('#deleteListingBtn');

const username = localStorage.getItem('username');

// bid button click event
bidBtn.addEventListener('click', async () => {
  // bid login guard
  if (!token) {
    bidMessage.textContent = 'You must be logged in to place a bid.';
    return;
  }

  const bidValue = Number(bidInput.value);

  bidMessage.textContent = '';

  if (!bidValue || bidValue <= currentPrice) {
    bidMessage.textContent = 'Bid must be higher than current price';
    return;
  }

  try {
    await placeBid(listingId, bidValue, token);

    // refresh credits
    await refreshCredits();

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

    // main listing info
    mainImage.src = listing.media?.[0]?.url || 'https://placehold.co/600x400';
    mainImage.alt = listing.title;

    title.textContent = listing.title;
    description.textContent = listing.description || 'No description provided';
    seller.textContent = listing.seller?.name || 'Seller is anonymous';

    // if owner show edit button
    if (listing.seller?.name === username) {
      editBtn.classList.remove('hidden');
      // if owner show delete button
      deleteBtn.classList.remove('hidden');
    }

    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Delete this listing?')) return;

      try {
        await deleteListing(listingId, token);
        window.location.href = 'index.html';
      } catch (error) {
        alert(error.message);
      }
    });

    // media gallery
    const media = listing.media || [];

    mainImage.src = media[0]?.url || 'https://placehold.co/600x400';
    mainImage.alt = listing.title;

    thumbnailRow.innerHTML = '';

    media.forEach((img) => {
      const thumb = document.createElement('img');
      thumb.src = img.url;
      thumb.classList.add('w-20', 'cursor-pointer');

      thumb.addEventListener('click', () => {
        mainImage.src = img.url;
      });

      thumbnailRow.appendChild(thumb);
    });

    // bids
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
setInterval(refreshBids, 5000);
