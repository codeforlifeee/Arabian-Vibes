import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 7999,
    proxy: {
      // Proxy API requests to avoid CORS issues in development
      '/api': {
        target: 'https://b2b.arabianvibesllc.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      '/jsonapi': {
        target: 'https://b2b.arabianvibesllc.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      '/sites': {
        target: 'https://b2b.arabianvibesllc.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
