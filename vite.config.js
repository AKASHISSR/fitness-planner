import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/fitness-planner/',
  plugins: [react()],
  build: {
    // Генерация уникальных имен файлов с хешем для предотвращения кеширования
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Принудительное добавление временной метки к именам файлов
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
      },
    },
  },
  server: {
    // Настройки для локального сервера
    port: 3000,
    strictPort: true,
    open: true,
  },
  preview: {
    // Настройки для предпросмотра сборки
    port: 4173,
    open: true,
  },
})