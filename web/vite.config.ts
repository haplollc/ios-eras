import { defineConfig } from 'vite'

// Relative asset paths, so the same build serves from a domain root (Vercel)
// or a sub-path (GitHub Pages).
export default defineConfig({
  base: './',
  build: { target: 'es2022' },
})
