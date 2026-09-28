import type { RouteRecordRaw } from 'vue-router';

import { HomePage } from '@/pages/home';
import { ROUTE_NAMES } from '@/shared/config';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomePage,
  },
];
