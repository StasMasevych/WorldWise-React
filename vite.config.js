import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0, // Ensure that all assets are included
    chunkSizeWarningLimit: 1000, // Adjust the chunk size warning limit as needed
    rollupOptions: {
      output: {
        manualChunks: {
          // You can define manual chunks here if needed
        },
      },
    },
  },
});
