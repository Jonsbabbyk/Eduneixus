import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <-- ADD THIS IMPORT

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: { // <-- ADD THIS RESOLVE OBJECT
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});