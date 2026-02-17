// js/pages/profile.js

'use strict';

import {
  getProfile,
  updateProfile,
  getProfileWins,
} from '../api/profileApi.js';

const credits = document.querySelector('#credits');
const avatar = document.querySelector('#avatar');
const banner = document.querySelector('#bannerImg');
const userName = document.querySelector('#userName');
const userEmail = document.querySelector('#userEmail');
const listingsNr = document.querySelector('#listingsNr');
const userListingsContainer = document.querySelector('#userListings');
const bidsNr = document.querySelector('#bidsNr');
const userBidsContainer = document.querySelector('#userBids');
const winsNr = document.querySelector('#winsNr');
const userWinsContainer = document.querySelector('#userWins');
const profileFormError = document.querySelector('#profileFormError');
const profileText = document.querySelector('#profileText');

// =============
// load profile
// =============
async function loadProfile() {
  try {
    const profile = await getProfile();

    credits.textContent = `Credits: ${profile.credits} 
    `;

    // avatar
    avatar.innerHTML = `
    <img src="${profile.avatar?.url || 'images/bailey-zindel-NRQV-hBF10M-unsplash.jpg'}"
    alt="${profile.avatar?.alt || ''}" />
    `;

    // banner
    banner.innerHTML = `
    <img src="${profile.banner?.url || 'images/andrei-castanha-raGhqxN-0A0-unsplash.jpg'}"
    alt="${profile.banner?.alt || ''}" />
    `;

    profileText.textContent = profile.bio || 'No bio added.';

    userName.textContent = profile.name;
    userEmail.textContent = profile.email;

    listingsNr.textContent = profile._count?.listings || 0;
    bidsNr.textContent = profile._count?.bids || 0;

    // =====================
    // render user listings
    // =====================
    userListingsContainer.innerHTML = '';

    if (profile.listings?.length) {
      profile.listings.forEach((listing) => {
        const card = document.createElement('div');

        card.className = 'border p-2';

        card.innerHTML = `
        <a href="listing.html?id=${listing.id}" class="block cursor-pointer">
        <h5>${listing.title}</h5>
        <p>${listing.description || ''}</p>
        <p>Bids: ${listing._count?.bids || 0}</p>
        </a>
        `;

        userListingsContainer.appendChild(card);
      });
    } else {
      userListingsContainer.textContent = 'No listings yet.';
    }

    // =================
    // render user bids
    // =================
    userBidsContainer.innerHTML = '';

    if (profile.bids?.length) {
      profile.bids.forEach((bid) => {
        const card = document.createElement('div');

        card.className = 'border p-2';

        card.innerHTML = `
        <a href="listing.html?id=${bid.listing?.id}" class="block cursor-pointer">
        <h5>${bid.listing?.title || 'Listing'}</h5>
        <p>Your bid: ${bid.amount}</p>
        </a>
        `;

        userBidsContainer.appendChild(card);
      });
    } else {
      userBidsContainer.textContent = 'No bids yet.';
    }

    // store for reuse on index.html
    localStorage.setItem('credits', profile.credits);
    localStorage.setItem('avatar', profile.avatar?.url || '');
  } catch (error) {
    console.error(error.message);
  }
}

// =============
// profile form
// =============
const profileForm = document.querySelector('#profileForm');

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  profileFormError.textContent = '';

  const avatarUrl = document.querySelector('#avatarUrl').value.trim();
  const bannerUrl = document.querySelector('#bannerUrl').value.trim();
  const bioText = document.querySelector('#bioText').value.trim();

  const updates = {};

  if (avatarUrl) {
    updates.avatar = { url: avatarUrl };
  }

  if (bannerUrl) {
    updates.banner = { url: bannerUrl };
  }

  if (bioText) {
    updates.bio = bioText;
  }

  try {
    await updateProfile(updates);

    loadProfile(); // refresh data
    profileForm.reset();
  } catch (error) {
    profileFormError.textContent =
      error.message || 'Error, profile could not update.';
  }
});

// reload updated data
loadProfile();

// ===============
// load user wins
// ===============
async function loadWins() {
  try {
    const name = localStorage.getItem('name');

    const wins = await getProfileWins(name);

    userWinsContainer.innerHTML = '';

    if (wins.length) {
      wins.forEach((win) => {
        const card = document.createElement('div');

        card.className = 'border p-2';

        card.innerHTML = `
              <a href="listing.html?id=${win.listing?.id}"
              class="block cursor-pointer">
              <h5>${win.listing?.title || 'Listing'}</h5>
              <p>Winning bid: ${win.amount}</p>
              </a>
            `;

        userWinsContainer.appendChild(card);
      });

      winsNr.textContent = wins.length;
    } else {
      userWinsContainer.textContent = 'No wins yet.';
      winsNr.textContent = 0;
    }
  } catch (error) {
    console.error('Failed to load wins:', error.message);
  }
}
loadWins();
