import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src-v2',
  build: {
    outDir: '../dist-v2',
    emptyOutDir: true,
  },
  base: './',
});