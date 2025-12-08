import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Đường dẫn gốc khi chạy production (Deploy vào trong Spring Boot)
  base: '/iphoneshop/',

  server: {
    port: 3000,
    // Cấu hình Proxy để fix lỗi 404 khi gọi API từ localhost:3000
    proxy: {
      '/iphoneshop/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/iphoneshop/img': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
    }
  },


  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    assetsDir: 'assets',
    sourcemap: false
  }
})