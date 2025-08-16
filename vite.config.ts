// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(),
//         tailwindcss(),
//   ],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html',
      },
    },
  },
});