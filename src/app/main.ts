import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import '@/assets/styles/main.scss';
import { initializeRouter } from '@/app/router';

function init(): void {
  const app = createApp(App);
  const router = initializeRouter();

  app.use(createPinia());
  app.use(router);
  app.use(ElementPlus);
  app.mount('#app');
}

init();
