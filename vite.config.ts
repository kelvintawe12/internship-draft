import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensure static files in public/ are served correctly
    fs: {
      // Allow serving files from the public/ directory
      allow: ['.'],
    },
  },
  // Optional: Explicitly configure MIME types for static assets
  // This is not strictly necessary if the file is served from public/
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'js', // Ensure .js files are treated as JavaScript
      },
    },
  },
});