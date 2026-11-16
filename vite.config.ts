import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Suraksha Setu — Vite + React SPA client.
 * Self-contained road safety LMS portal with built-in reactive store and mock engine.
 */
const proxyTarget = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env?.VITE_PROXY_TARGET;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    ...(proxyTarget
      ? {
          proxy: {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
            },
          },
        }
      : {}),
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "es2022",
  },
});
