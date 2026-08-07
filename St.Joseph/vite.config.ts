import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reticle } from "@reticlehq/vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [react(), reticle()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // must match tsconfig paths
    },
  },
});