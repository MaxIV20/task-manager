import { ElMessageBox, ElNotification } from 'element-plus';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import {
  useCloneTaskMutation,
  useRemoveTaskMutation,
  useTaskStore,
} from '@/entities/task';
import { ROUTE_NAMES } from '@/shared/config';

export function useTaskActions() {
  const router = useRouter();
  const taskStore = useTaskStore();
  const { isPending: isCloning, mutateAsync: cloneTaskMutation } =
    useCloneTaskMutation();
  const { isPending: isRemoving, mutateAsync: removeTaskMutation } =
    useRemoveTaskMutation();
  const isMutating = computed(() => isCloning.value || isRemoving.value);

  async function cloneTask() {
    const task = taskStore.task;
    if (!task) return;

    try {
      const copy = await cloneTaskMutation(task.id);
      ElNotification.success({ title: 'Задача клонирована' });
      await router.push({
        name: ROUTE_NAMES.TASK_DETAILS,
        params: { id: copy.id },
      });
    } catch (error: unknown) {
      ElNotification.error({
        title: 'Не удалось клонировать задачу',
        message: error instanceof Error ? error.message : undefined,
      });
    }
  }

  async function removeTask() {
    const task = taskStore.task;
    if (!task) {
      return;
    }

    try {
      await ElMessageBox.confirm(
        'Удалить задачу без возможности восстановления?',
        'Удаление задачи',
        {
          confirmButtonText: 'Удалить',
          cancelButtonText: 'Отмена',
          type: 'warning',
        },
      );
    } catch {
      return;
    }

    try {
      await removeTaskMutation(task.id);
      ElNotification.success({ title: 'Задача удалена' });
      await router.push({ name: ROUTE_NAMES.TASK_LIST });
    } catch (error: unknown) {
      ElNotification.error({
        title: 'Не удалось удалить задачу',
        message: error instanceof Error ? error.message : undefined,
      });
    }
  }

  return {
    isMutating,
    cloneTask,
    removeTask,
  };
}
