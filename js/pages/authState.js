// js/pages/authState.js

'use-strict';

const token = localStorage.getItem('token');

if (token) {
  document.body.classList.add('logged-in');
}
