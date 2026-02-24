// js/pages/authState.js
// What the user sees.

'use strict';

// ================
// page protection
// ================
const protectedPages = ['profile.html'];
const currentPage = window.location.pathname.split('/').pop();

const token = localStorage.getItem('token');

if (protectedPages.includes(currentPage) && !token) {
  window.localStorage.href = 'login.html';
}

const email = localStorage.getItem('email');
const avatarUrl = localStorage.getItem('avatar');
const credits = localStorage.getItem('credits');

const guestContent = document.querySelector('#guestContent');
const userContent = document.querySelector('#userContent');
const avatarContainer = document.querySelector('#avatar');
const creditContainer = document.querySelector('#credits');
const logoutBtn = document.querySelector('#logoutBtn');
const createListingLink = document.querySelector('#createListing');

// logged in block
if (token && email) {
  // Logged in
  if (guestContent) {
    guestContent.classList.add('hidden');
  }

  if (userContent) {
    userContent.classList.remove('hidden');
  }

  // show 'create listing <a> tag' in index.html when logged in
  if (createListingLink) {
    createListingLink.classList.remove('hidden');
  }

  // avatar
  if (avatarContainer) {
    avatarContainer.innerHTML = `
    <img src="${avatarUrl || 'https://placehold.co/40x40'}"
    alt="Profile Avatar"/>
    `;
  }

  // credit
  function renderCredits() {
    const credits = localStorage.getItem('credits');

    if (creditContainer) {
      creditContainer.textContent = `Credits: ${credits || 0}`;
    }
  }

  // initial render
  renderCredits();
  // listen for updates from anywhere
  window.addEventListener('creditsUpdated', renderCredits);

  // logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }
} else {
  // Logget out block
  if (guestContent) {
    guestContent.classList.remove('hidden');
  }

  if (userContent) {
    userContent.classList.add('hidden');
  }

  // hide create listing <a> tag in index.html when logged out
  if (createListingLink) {
    createListingLink.classList.add('hidden');
  }
}
