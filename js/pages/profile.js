// js/pages/profile.js

'use strict';

import {
  getProfile,
  updateProfile,
  getProfileWins,
  getProfileBids,
} from '../api/profileApi.js';
import { createListingcard } from '../ui/createListingCard.js';
import { createListing } from '../api/listingsApi.js';

const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

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
const createListingBtn = document.querySelector('#createListing');
const createForm = document.querySelector('#createListingForm');

// ===============
// create listing
// ===============
createListingBtn.addEventListener('click', () => {
  createForm.classList.toggle('hidden');
});

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
        const card = createListingcard(listing);
        userListingsContainer.appendChild(card);
      });
    } else {
      userListingsContainer.textContent = 'No listings yet.';
    }

    // store for reuse on index.html
    localStorage.setItem('credits', profile.credits);
    localStorage.setItem('avatar', profile.avatar?.url || '');
  } catch (error) {
    console.error(error.message);
  }
}

// =================
// render user bids
// =================
async function loadUserBids() {
  try {
    const name = localStorage.getItem('name');
    const bids = await getProfileBids(name);

    userBidsContainer.innerHTML = '';

    if (!bids.length) {
      userBidsContainer.textContent = 'No bids yet.';
      bidsNr.textContent = 0;
      return;
    }

    bids.forEach((bid) => {
      const card = document.createElement('div');
      card.className = 'border p-2';

      card.innerHTML = `
    <a href="listing.html?id=${bid.listing.id}" class="block cursor-pointer">
    <h5>${bid.listing.title}</h5>
    <p>Your bid: ${bid.amount}</p>
    </a>
    `;

      userBidsContainer.appendChild(card);
    });

    bidsNr.textContent = bids.length;
  } catch (error) {
    console.error('Failed to load bids:', error.message);
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
    localStorage.setItem('avatar', avatarUrl || '');

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

// ======================
// create listing submit
// ======================
const submitListingBtn = document.querySelector('#submitListingBtn');
const createMessage = document.querySelector('#createListingMessage');

submitListingBtn.addEventListener('click', async () => {
  try {
    // const images = document
    //   .querySelector('#listingImageInput')
    //   .value.split(',')
    //   .map((url) => ({ url: url.trim() }));

    const rawImages = document
      .querySelector('#listingImageInput')
      .value.split(',');

    // clean + validate image URLs
    const images = rawImages
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      .map((url) => {
        try {
          // remove tracking query params
          const cleanUrl = new URL(url);
          cleanUrl.search = '';

          return cleanUrl.toString();
        } catch {
          return null;
        }
      })
      .filter((url) => url && url.length <= 300)
      .map((url) => ({ url }));

    if (rawImages.length && images.length === 0) {
      createMessage.textContent =
        'Invalid image URL. Use a direct image link under 300 characters.';
      return;
    }

    // title
    const title = document.querySelector('#listingTitleInput').value.trim();

    const description = document
      .querySelector('#listingDescriptionInput')
      .value.trim();

    const endsAt = document.querySelector('#listingEndDateInput').value;

    const tags = document
      .querySelector('#listingTagsInput')
      .value.split(',')
      .map((tag) => tag.trim());

    if (!title || !endsAt) {
      createMessage.textContent = 'Title and end date required';
      return;
    }

    const listingData = {
      media: images,
      title,
      description,
      endsAt: new Date(endsAt).toISOString(),
      tags,
    };

    await createListing(listingData, token);

    createMessage.textContent = 'Listing created';

    // reload profile so listing appears
    loadProfile();

    createForm.classList.add('hidden');
  } catch (error) {
    createMessage.textContent = error.message;
  }
});

loadProfile();
loadUserBids();
loadWins();
