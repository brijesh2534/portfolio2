// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     './index.html',
//     './admin.html', // Add this line
//     './src/**/*.{js,ts,jsx,tsx}'
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html',
      },
    },
  },
});