// js/api/createApiKey.js
// creating API_KEY
// see home.js to find the rest of the code

// import { API_BASE } from './config.js';

// export async function createApiKey() {
//   const token = localStorage.getItem('token');

//   if (!token) {
//     throw new Error('You must be logged in first');
//   }

//   const response = await fetch(`${API_BASE}/auth/create-api-key`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.errors?.[0]?.message || 'Failed to create API key');
//   }

//   console.log('API Key:', data.data.key);

//   return data.data.key;
// }
