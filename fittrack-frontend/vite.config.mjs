import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for FitTrack frontend (migrated from CRA)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5001',
      '/uploads': 'http://localhost:5001',
    },
  },
  build: {
    outDir: 'build',
  },
});
