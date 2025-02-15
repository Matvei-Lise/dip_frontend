import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "./",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/pages",
          dest: "",
        },
        {
          src: "src/js",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 4000,
    open: true,
  },
});
