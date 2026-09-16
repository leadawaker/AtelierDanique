import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `vercel dev` serves /api alongside Vite. Plain `npm run dev` has no API,
// so the public pages fall back to their built-in defaults.
export default defineConfig({
  plugins: [react()],
});
