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

if (token && email) {
  // Logged in
  if (guestContent) {
    guestContent.classList.add('hidden');
  }

  if (userContent) {
    userContent.classList.remove('hidden');
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
  window.addEventListener('creditsUpdates', renderCredits);

  // logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }
} else {
  // Logget out
  if (guestContent) {
    guestContent.classList.remove('hidden');
  }

  if (userContent) {
    userContent.classList.add('hidden');
  }
}
