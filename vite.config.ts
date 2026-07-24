import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  // base: '/redruum/',
  // build: {
  //   chunkSizeWarningLimit: 800,
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('node_modules')) {
  //           if (id.includes('react-dom') || id.includes('react')) {
  //             return 'react-vendor';
  //           }
  //           if (id.includes('@supabase')) {
  //             return 'supabase-vendor';
  //           }
  //           if (id.includes('motion')) {
  //             return 'motion-vendor';
  //           }
  //           if (
  //             id.includes('@vercel/analytics') ||
  //             id.includes('@vercel/speed-insights')
  //           ) {
  //             return 'vercel-vendor';
  //           }
  //           return 'vendor';
  //         }
  //       },
  //     },
  //   },
  // },
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
