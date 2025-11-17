import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/se/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist_25R4.2.1(se)",
    minify: "terser",
    terserOptions: {
      format: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
});
