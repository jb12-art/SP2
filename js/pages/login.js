// js/pages/login.js

'use strict';

import { login } from '../api/auth.js';
import { getProfile } from '../api/profileApi.js';

const form = document.querySelector('#loginForm');
const message = document.querySelector('#loginMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('#emailLogin').value;
  const password = document.querySelector('#passwordLogin').value;

  try {
    const result = await login(email, password);

    // store token, name, email in localStorage
    localStorage.setItem('token', result.data.accessToken);
    localStorage.setItem('name', result.data.name);
    localStorage.setItem('email', result.data.email);

    // fetch profile info/ credits /avatar
    const profile = await getProfile();

    localStorage.setItem('credits', profile.credits);
    localStorage.setItem('avatar', profile.avatar?.url || '');

    window.location.href = 'index.html';
  } catch (error) {
    message.textContent = error.message;
  }
});
