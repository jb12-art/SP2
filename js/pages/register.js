// js/pages/register.js

'use-strict';

import { register } from '../api/auth.js';

const form = document.querySelector('#registerForm');
const message = document.querySelector('#registerMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.querySelector('#nameRegistration').value;
  const email = document.querySelector('#emailRegistration').value;
  const password = document.querySelector('#passwordRegistration').value;

  try {
    await register(name, email, password);
    message.textContent = 'Registration success.';

    window.location.href = '/login.html';
  } catch (error) {
    message.textContent = error.message;
  }

  if (!email.endsWith('@stud.noroff.no')) {
    message.textContent = 'You must use a @stud.noroff.no email address';

    return;
  }
});
