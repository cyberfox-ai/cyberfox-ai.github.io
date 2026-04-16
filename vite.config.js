import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For a user/org site (vivekchoudary.github.io) the base is '/'
// For a project site (username.github.io/repo-name) change base to '/repo-name/'
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'r3f':        ['@react-three/fiber', '@react-three/drei'],
          'gsap':       ['gsap'],
          'react':      ['react', 'react-dom'],
        },
      },
    },
  },
})
