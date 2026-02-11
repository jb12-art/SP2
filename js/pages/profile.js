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

// =============
// load profile
// =============
async function loadProfile() {
  try {
    const profile = await getProfile();

    // avatar
    avatar.innerHTML = `
    <img src="${profile.avatar?.url || 'https://placehold.co/40x40'}"
    alt="${profile.avatar?.alt || ''}" />
    `;

    // banner
    banner.innerHTML = `
    <img src="${profile.banner?.url || 'https://placehold.co/1920x80'}"
    alt="${profile.banner?.alt || ''}" />
    `;

    credits.textContent = `Credits: ${profile.credits} 
    `;
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

  const bannerUrl = document.querySelector('#bannerUrl').value.trim();
  const avatarUrl = document.querySelector('#avatarUrl').value.trim();
  const bioText = document.querySelector('#bioText').value.trim();

  const updates = {};

  if (bannerUrl) {
    updates.banner = { url: bannerUrl };
  }

  if (avatarUrl) {
    updates.avatar = { url: avatarUrl };
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
