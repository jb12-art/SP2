// auth.js

'use strict';

import { API_BASE, API_AUTH, API_LOGIN, API_REGISTER } from './config.js';

// Register user
export async function register(name, email, password) {
  const response = await fetch(`${API_BASE}${API_AUTH}${API_REGISTER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.errors?.[0]?.message || 'Account is already registered.',
    );
  }

  return data;
}

// Login user
export async function login(email, password) {
  const response = await fetch(`${API_BASE}${API_AUTH}${API_LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'Login failed');
  }

  return data;
}
