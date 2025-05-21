import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 全域引入變數和mixin
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/base/var.scss";
          @import "@/assets/scss/mixin/mixin.scss";
          @import "@/assets/scss/function/function.scss";
        `,
      },
    },
  },
});
