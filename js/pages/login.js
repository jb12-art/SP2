// js/pages/login.js

import { login } from '../api/auth.js';

const form = document.querySelector('#loginForm');
const message = document.querySelector('#loginMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('#emailLogin').value;
  const password = document.querySelector('#passwordLogin').value;

  try {
    const result = await login(email, password);
    localStorage.setItem('token', result.data.accessToken);

    window.location.href = 'index.html';
  } catch (error) {
    message.textContent = error.message;
  }
});
