/* import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  server: {
    mimeTypes: {
      "text/css": ["css"],
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "src/components/*", dest: "components" }, // Копируем все компоненты
        { src: "src/pages/*", dest: "pages" }, // Копируем все страницы
        { src: "src/js/", dest: "js" }, // Копируем include.js
      ],
    }),
  ],
});
 */
import { defineConfig } from "vite";
import staticCopy from "vite-plugin-static-copy";

export default defineConfig({
  base: "./",
  plugins: [
    staticCopy({
      targets: [
        {
          src: "src/pages", // Путь к вашим страницам
          dest: "", // Копировать прямо в dist
        },
        {
          src: "src/js", // Путь к вашим страницам
          dest: "", // Копировать прямо в dist
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true, // Очищает папку dist при сборке
  },
  server: {
    port: 4000,
    open: true, // Автоматически открыть браузер
  },
});
