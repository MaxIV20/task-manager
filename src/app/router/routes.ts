import type { RouteRecordRaw } from 'vue-router';

import { useTasksStore } from '@/entities/task';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/tasks',
  },
  {
    path: '/tasks',
    name: 'task-list',
    component: () =>
      import('@/pages/task-list').then(({ TaskListPage }) => TaskListPage),
  },
  {
    path: '/tasks/:id',
    name: 'task-details',
    beforeEnter: async (to) => {
      const tasksStore = useTasksStore();
      const exists = await tasksStore.checkTaskExists(String(to.params.id));

      return exists ? true : { path: '/tasks', replace: true };
    },
    component: () =>
      import('@/pages/task-details').then(
        ({ TaskDetailsPage }) => TaskDetailsPage,
      ),
  },
];
