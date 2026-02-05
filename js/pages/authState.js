// js/pages/authState.js
// What the user sees.

'use-strict';

// import { API_BASE } from '../api/config';

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
const avatarUrl = localStorage.getItem('avatar');
const credits = localStorage.getItem('credits');
// const searchItem = localStorage.getItem('searchItem');

const guestContent = document.querySelector('#guestContent');
const userContent = document.querySelector('#userContent');
const avatarContainer = document.querySelector('#avatar');
const creditContainer = document.querySelector('#credits');
const logoutBtn = document.querySelector('#logoutBtn');
// const searchAuctionItem = document.querySelector('#searchItem');

if (token && email) {
  // Logged in
  guestContent.classList.add('hidden');
  userContent.classList.remove('hidden');

  // avatar
  avatarContainer.innerHTML = `
  <img src="${avatarUrl || 'https://placehold.co/40x40'}"
  alt="Avatar" />
  `;

  // credit
  creditContainer.textContent = `Credits: ${credits || 0}`;

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

// search bar - search for auction items
// export async function searchAuctionItem(query) {
//   const response = await fetch(
//     `${API_BASE}/auction/listings/search?q=${encodeURIComponent(query)}&title=true&description=true`,
//     {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${load(token)}`,
//         'X-Noroff-API-Key': API_KEY.data.key,
//       },
//     },
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     console.error('Search feiled:', data);
//     throw new Error(data.errors?.[0]?.message || 'Could not find item');
//   }
//   return data;
// }
