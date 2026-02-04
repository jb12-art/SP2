// js/pages/register.js

'use-strict';

import { register } from '../api/auth.js';

const form = document.querySelector('#registerForm');
const registerMessage = document.querySelector('#registerMessage');
const emailError = document.querySelector('#emailError');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.querySelector('#nameRegistration').value;
  const email = document.querySelector('#emailRegistration').value.trim();
  const password = document.querySelector('#passwordRegistration').value;

  // clear old messages
  registerMessage.textContent = '';
  emailError.textContent = '';

  // check if email is ending with @stud.noroff.no
  if (!email.endsWith('@stud.noroff.no')) {
    emailError.textContent = 'You must use a @stud.noroff.no email address';

    return;
  }

  // Only correct emails are valid
  try {
    await register(name, email, password);
    registerMessage.textContent = 'Registration success.';

    window.location.href = '/login.html';
  } catch (error) {
    registerMessage.textContent = error.message;
  }
});
