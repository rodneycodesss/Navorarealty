import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    // Rolldown (Vite 8) handles automatic splitting; manual chunks are not yet supported.
    // Keep a generous warning limit and minify CSS for faster loads.
    chunkSizeWarningLimit: 1000,
    cssMinify: true,
  }
})

