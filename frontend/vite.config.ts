import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxie toutes les routes /api vers ton backend Laravel
      "/api": {
        target: "http://localhost:8000", // ← backend
        changeOrigin: true,
        secure: false,
      },
      // (si tu utilises Sanctum)
      "/sanctum": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
