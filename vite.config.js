import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        institucional: resolve(__dirname, 'institucional.html'),
        contacto: resolve(__dirname, 'contacto.html'),
      },
    },
  },
});
