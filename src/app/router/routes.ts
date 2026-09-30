import type { RouteRecordRaw } from 'vue-router';

import { ensureTaskExists } from '@/entities/task';
import { ROUTE_NAMES } from '@/shared/config';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.TASK_LIST },
  },
  {
    path: '/tasks',
    name: ROUTE_NAMES.TASK_LIST,
    component: () =>
      import('@/pages/task-list').then(({ TaskListPage }) => TaskListPage),
  },
  {
    path: '/tasks/:id',
    name: ROUTE_NAMES.TASK_DETAILS,
    beforeEnter: ensureTaskExists,
    component: () =>
      import('@/pages/task-details').then(
        ({ TaskDetailsPage }) => TaskDetailsPage,
      ),
  },
];
