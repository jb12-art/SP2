// js/pages/register.js

'use-strict';

import { register } from '../api/auth.js';

const form = document.querySelector('#registerForm');
const registerMessage = document.querySelector('#registerMessage');
const emailError = document.querySelector('#emailError');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // 1. Reset all error displays
  document
    .querySelectorAll('.error-message')
    .forEach((el) => (el.textContent = ''));
  registerMessage.textContent = '';

  // 2. HTML Validation check
  // Double security with both JS/ HTML that guards the input
  if (!form.checkValidity()) {
    form.reportValidity(); // browser validation bubble
    return;
  }

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
    registerMessage.className = 'text-green-600';
    registerMessage.textContent = 'Registration success! Redirecting...';

    setTimeout(() => (window.location.href = '/login.html'), 2000);
  } catch (error) {
    const msg = error.message.toLowerCase();

    // 3. Map the error to the correct input field
    if (msg.includes('email')) {
      emailError.textContent = error.message;
    } else if (msg.includes('name') || msg.includes('username')) {
      document.querySelector('#nameError').textContent = error.message;
    } else if (msg.includes('password')) {
      document.querySelector('#passwordError').textContent = error.message;
    } else {
      // fallback for general errors
      registerMessage.textContent = error.message;
    }
  }
});
