import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://thethongngu.github.io',
  base: '/',
  output: 'static',
  build: {
    format: 'file'
  }
});
