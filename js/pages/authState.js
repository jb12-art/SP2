// js/pages/authState.js
// What the user sees.

'use-strict';

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
const avatarUrl = localStorage.getItem('avatar');

const guestContent = document.querySelector('#guestContent');
const userContent = document.querySelector('#userContent');
const avatarContainer = document.querySelector('#avatar');
const logoutBtn = document.querySelector('#logoutBtn');

if (token && email) {
  // Logged in
  guestContent.classList.add('hidden');
  userContent.classList.remove('hidden');

  // avatar
  avatarContainer.innerHTML = `
  <img src="${avatarUrl || 'https://placehold.co/40x40'}"
  alt="Profile avatar" />
  `;

  // logout button

  // Logout logic
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
  });
} else {
  // Logget out
  guestContent.classList.remove('hidden');
  userContent.classList.add('hidden');
}
