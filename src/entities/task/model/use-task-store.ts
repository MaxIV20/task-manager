import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';

import { useTaskQuery } from '../api/vue-query/use-task-query';

export const useTaskStore = defineStore('task', () => {
  const route = useRoute();
  const {
    data: task,
    error,
    isPending,
    refetch,
  } = useTaskQuery(() =>
    typeof route.params.id === 'string' ? route.params.id : '',
  );

  return { task, error, isPending, refetch };
});
