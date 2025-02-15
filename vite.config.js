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

export default defineConfig({
  root: ".", // Указываем корень проекта
  build: {
    outDir: "dist",
    emptyOutDir: true, // Очищает папку dist при сборке
  },
  server: {
    port: 4000, // Или любой удобный порт
    open: true, // Автоматически открыть браузер
  },
});
