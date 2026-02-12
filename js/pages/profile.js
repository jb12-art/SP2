// js/pages/profile.js

'use strict';

import { getProfile, updateProfile } from '../api/profileApi.js';

const credits = document.querySelector('#credits');
const avatar = document.querySelector('#avatar');
const banner = document.querySelector('#bannerImg');
const userName = document.querySelector('#userName');
const userEmail = document.querySelector('#userEmail');
const listingsNr = document.querySelector('#listingsNr');
const bidsNr = document.querySelector('#bidsNr');
const winsNr = document.querySelector('#winsNr');
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
    <img src="${profile.avatar?.url || 'images\bailey-zindel-NRQV-hBF10M-unsplash.jpg'}"
    alt="${profile.avatar?.alt || ''}" />
    `;

    // banner
    banner.innerHTML = `
    <img src="${profile.banner?.url || 'images\andrei-castanha-raGhqxN-0A0-unsplash.jpg'}"
    alt="${profile.banner?.alt || ''}" />
    `;

    profileText.textContent = profile.bio || 'No bio added.';

    userName.textContent = profile.name;
    userEmail.textContent = profile.email;

    listingsNr.textContent = profile._count?.listings || 0;
    bidsNr.textContent = profile._count?.bids || 0;
    winsNr.textContent = profile._count?.wins || 0;

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
