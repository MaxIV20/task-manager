import { createRouter, createWebHashHistory, type Router } from 'vue-router';

import { routes } from './routes';

export function initializeRouter(): Router {
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });

  return router;
}
