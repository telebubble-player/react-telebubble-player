import { defineConfig } from 'vite';
import { resolve } from 'path'
import react from '@vitejs/plugin-react';
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  // Development configuration
  if (command === 'serve') {
    return {
      plugins: [react()],
      server: {
        open: true,
      },
    };
  }

  // Build configuration (library)
  return {
    plugins: [
      react(),
      libInjectCss(),
      dts({
        tsconfigPath: resolve(__dirname, 'tsconfig.build.json'),
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: () => 'index.js',
      },
      rollupOptions: {
        external: ['react', 'react/jsx-runtime'],

      }
    },
  };
});