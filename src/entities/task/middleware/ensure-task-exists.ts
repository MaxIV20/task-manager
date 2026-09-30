import type { RouteLocationNormalized } from 'vue-router';

import { ROUTE_NAMES } from '@/shared/config';

import { useTasksStore } from '../model';

export async function ensureTaskExists(to: RouteLocationNormalized) {
  const tasksStore = useTasksStore();
  const redirect = { name: ROUTE_NAMES.TASK_LIST, replace: true };
  const taskId = String(to.params.id);

  if (tasksStore.tasks === undefined) {
    try {
      await tasksStore.ensureTasksLoaded();
    } catch (error) {
      console.error(error);
      return redirect;
    }
  }

  const exists = tasksStore.tasks?.some((task) => task.id === taskId);
  return exists ? true : redirect;
}
