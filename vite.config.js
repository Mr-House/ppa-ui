// const path = require('path')
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['jsuites'],
  },
});

// module.exports = {
//     hostname: 'localhost',
//     port: '3000',
//     open: true,
//     https: false,
//     ssr: false,
//     base: './',
//     outDir: 'dist',
//     proxy: {
//         '/api': {
//             target: 'http://localhost:7001',
//             changeOrigin: true,
//             rewrite: path => path.replace(/^\/api/, '')
//         }
//     }
// }
