import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router.js';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import api from './plugins/api.js';

const pinia = createPinia();
pinia.use(piniaPersist);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});
const app = createApp(App);
app.config.globalProperties.$api = api;
app.use(router).use(vuetify).use(pinia).mount('#app');
