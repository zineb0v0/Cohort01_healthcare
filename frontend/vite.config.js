import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // new Port for Vite (React)
    proxy: {
      "/api": "http://localhost:8000", // Proxy API requests to Laravel backend
      "/sanctum/csrf-cookie": "http://localhost:8000", // Proxy CSRF route
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
