import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./locale";
import "@/assets/css/reset.css";
import "@/assets/css/base.css";

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount("#app");

window.i18n = i18n;
