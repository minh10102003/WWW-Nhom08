import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Đường dẫn gốc khi chạy production (Deploy vào trong Spring Boot)
  base: '/iphoneshop/',

  define: {
    // Fix cho sockjs-client: define global = window
    global: 'window',
  },

  server: {
    port: 3003,
    // Cấu hình Proxy để fix lỗi 404 khi gọi API từ localhost:3000
    // QUAN TRỌNG: Chỉ proxy các request đến /iphoneshop/api và static resources để tránh redirect loop
    // Không proxy /iphoneshop/vnpay/return và /iphoneshop/assets vì đây là frontend routes
    proxy: {
      '/iphoneshop/api': {
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
      // Proxy cho static resources (images, etc.) - chỉ proxy /img, không proxy /assets
      '/iphoneshop/img': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy cho WebSocket endpoint (bao gồm /ws và /ws/info cho SockJS)
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path, // Giữ nguyên path
      },
      // KHÔNG proxy /iphoneshop/login và /iphoneshop/register vì đây là frontend routes
      // Vite dev server sẽ serve các route này, không cần proxy về backend
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