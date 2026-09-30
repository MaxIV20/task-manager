import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import 'element-plus/dist/index.css';
import App from './App.vue';
import '@/assets/styles/main.scss';
import { initializeRouter } from '@/app/router';
import { queryClient } from '@/utils/api';

function init() {
  const app = createApp(App);
  const router = initializeRouter();

  app.use(VueQueryPlugin, { queryClient });
  app.use(createPinia());
  app.use(router);
  app.use(ElementPlus);
  app.mount('#app');
}

init();
