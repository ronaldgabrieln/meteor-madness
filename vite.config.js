import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        simulation: resolve(__dirname, 'simulation.html'),
        datasets: resolve(__dirname, 'useddatasets.html'),
        defend: resolve(__dirname, 'defenderSlide/defendFirst.html'),
        selector: resolve(__dirname, 'defenderSlide/selectorDefender.html'),
        gravity: resolve(__dirname, 'defenderSlide/gravityTractor.html'),
        kinetic: resolve(__dirname, 'defenderSlide/kineticImpactor.html'),
        nuclear: resolve(__dirname, 'defenderSlide/nuclearExplosion.html'),

      }
    }
  }
})