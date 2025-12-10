import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/routes/router.js";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";
import api from "@/plugins/api.js";
import utils from "@/utils/index.js";
import swalToast from "@/utils/toast.js";
const pinia = createPinia();
pinia.use(piniaPersist);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
});
const app = createApp(App);
app.config.globalProperties.$api = api;
app.config.globalProperties.$utils = new utils();
app.config.globalProperties.$toast = new swalToast();
app.use(router).use(vuetify).use(pinia).mount("#app");
