import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Đường dẫn gốc khi chạy production (Deploy vào trong Spring Boot)
  base: '/iphoneshop/',

  server: {
    port: 3002,
    // Cấu hình Proxy để fix lỗi 404 khi gọi API từ localhost:3000
    proxy: {
      '/iphoneshop': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable websocket proxy
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url, '->', proxyReq.path);
          });
        }
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