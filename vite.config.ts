import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://merch.factum.work',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    sourcemap: mode === 'production' ? false : true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux']
        }
      }
    }
  }
}));