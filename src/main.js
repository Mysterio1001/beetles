import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./locale";
import "@/style/main.scss";
// 字體
import "@fontsource/noto-sans-tc/400.css";
import "@fontsource/noto-sans-tc/700.css";
import "@fontsource/yuji-boku/400.css";

const app = createApp(App);

// 元件全域註冊
const components = import.meta.glob("./components/**/*.vue", { eager: true });
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}
for (const path in components) {
  const component = components[path].default;
  const name = path.split("/").pop().replace(".vue", ""); // e.g. BeHeader
  app.component(name, component); // PascalCase
  app.component(toKebabCase(name), component); // kebab-case
}

app.use(router);
app.use(i18n);
app.mount("#app");

window.i18n = i18n;
