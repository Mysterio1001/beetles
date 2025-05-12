import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./locale";
import "@/assets/scss/style.scss";

const app = createApp(App);

// 元件全域註冊
const components = import.meta.glob("./components/**/*.vue", { eager: true });
for (const path in components) {
  const component = components[path].default;
  const name = path.split("/").pop().replace(".vue", ""); // e.g. MyHeader
  app.component(name, component);
}

app.use(router);
app.use(i18n);
app.mount("#app");

window.i18n = i18n;
