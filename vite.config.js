import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    /* El manifiesto es lo que permite que scripts/paginas-html.mjs sepa qué
       trozo corresponde a cada ruta y lo precargue en su propio HTML. Sin
       eso, al montar React el hueco de Suspense mide distinto que la página
       real y todo lo de abajo se recoloca: 0.3 de CLS en /precios. */
    manifest: true,
    // El chunk de three.js ya se separa por el import dinámico del hero.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react-vendor';
          if (id.includes('motion') || id.includes('framer')) return 'motion';
          return undefined;
        },
      },
    },
  },
});
