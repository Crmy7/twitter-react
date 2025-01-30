import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "public",
      filename: "service-worker.js",
      manifest: {
        name: "Mini Twitter",
        short_name: "Mini Twitter",
        start_url: "/",
        icons: [
          {
            src: "/icons/Logo_of_Twitter_144_144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
        ],
        display: "standalone",
        id: "com.mini-twitter",
      },
    }),
  ],
});
