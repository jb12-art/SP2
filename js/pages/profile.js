// js/pages/profile.js

'use-strict';

import { getProfile } from '../api/profileApi.js';

const credits = document.querySelector('#credits');
const avatar = document.querySelector('#avatar');
const banner = document.querySelector('#bannerImg');
const userName = document.querySelector('#userName');
const userEmail = document.querySelector('#userEmail');
const listingsNr = document.querySelector('#listingsNr');
const winsNr = document.querySelector('#winsNr');

// avatar
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
    listingsNr.textContent = profile._count.listings;
    winsNr.textContent = profile._count.wins;

    // store for reuse on index.html
    localStorage.setItem('credits', profile.credits);
    localStorage.setItem('avatar', profile.avatar?.url || '');
  } catch (error) {
    console.error(error.message);
  }
}

loadProfile();
