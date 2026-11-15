import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Connect, Plugin } from "vite";

/** Serve desktop.html for /desktop/* so the desktop app can use real URLs. */
const desktopRoutes = (): Plugin => {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url && /^\/desktop(\/|$|\?)/.test(req.url) && !/\.[a-z0-9]+($|\?)/i.test(req.url)) req.url = "/desktop.html";
    next();
  };
  return {
    name: "ventura-desktop-routes",
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // Two apps from one codebase: index.html is Ventura for mobile (in person),
  // desktop.html is Ventura for desktop (planning). They share src/ and data.
  // `vite build --mode prototype` makes a self-contained, relative-path build
  // that routes in memory, for embedding as an interactive prototype.
  base: mode === "prototype" ? "./" : "/",
  build: {
    ...(mode === "prototype" ? { outDir: "dist-prototype", assetsInlineLimit: 0 } : {}),
    rollupOptions: {
      input: { mobile: path.resolve(__dirname, "index.html"), desktop: path.resolve(__dirname, "desktop.html") },
    },
  },
  plugins: [react(), desktopRoutes(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
