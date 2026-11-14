import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // `vite build --mode prototype` makes a self-contained, relative-path build
  // that routes in memory, for embedding as an interactive prototype.
  base: mode === "prototype" ? "./" : "/",
  build: mode === "prototype" ? { outDir: "dist-prototype", assetsInlineLimit: 0 } : undefined,
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
