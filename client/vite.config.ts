import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // IMPORTANT: base should be "/" on Vercel
  base: "/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // DO NOT set `root` when deploying from `client`
  // DO NOT build outside the project

  build: {
  rollupOptions: {
    output: {
      manualChunks: {
        react: ["react", "react-dom"],
        ui: ["@radix-ui/react-dialog", "@radix-ui/react-tabs"]
      }
    }
  }
},
});
