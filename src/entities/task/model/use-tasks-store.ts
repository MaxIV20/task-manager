import { defineStore } from 'pinia';
import { useQueryClient } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';

import { ROUTE_NAMES } from '@/shared/config';

import {
  getTasksQueryOptions,
  useTasksQuery,
} from '../api/vue-query/use-tasks-query';
import { matchesTaskFilters } from '../utils';
import type { TaskFilters } from './task.types';

function getCurrentFilters(query: LocationQuery): TaskFilters {
  const title = Array.isArray(query.title) ? query.title[0] : query.title;
  const status = Array.isArray(query.status)
    ? query.status.join(',')
    : query.status;
  const priority = Array.isArray(query.priority)
    ? query.priority.join(',')
    : query.priority;

  return {
    title: title || undefined,
    status: status?.split(',').filter(Boolean) as TaskFilters['status'],
    priority: priority?.split(',').filter(Boolean) as TaskFilters['priority'],
  };
}

function sameFilters(left: TaskFilters, right: TaskFilters) {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);

  return [...keys].every((key) => {
    const leftValue = left[key as keyof TaskFilters];
    const rightValue = right[key as keyof TaskFilters];
    const leftQueryValue = Array.isArray(leftValue)
      ? leftValue.join(',')
      : leftValue;
    const rightQueryValue = Array.isArray(rightValue)
      ? rightValue.join(',')
      : rightValue;

    return (leftQueryValue || undefined) === (rightQueryValue || undefined);
  });
}

export const useTasksStore = defineStore('tasks', () => {
  const route = useRoute();
  const router = useRouter();
  const queryClient = useQueryClient();
  const filters = ref<TaskFilters>(getCurrentFilters(route.query));
  const {
    data: tasks,
    error,
    isPending,
    isFetching,
    refetch,
  } = useTasksQuery();
  // Удобнее фильтровать на фронте, а не на бэке, т.к. при создании задачи нужен список всех задач.
  // Иначе при создании таски пришлось бы делать запрос для проверки title, что с ответом в 2сек было бы слишком долго
  // (но в случае нормального бэка да, можно было бы получать список отфильтрованных тасок и при создании проверять наличие таски с title отправкой запроса)
  const filteredTasks = computed(() =>
    (tasks.value ?? []).filter((task) =>
      matchesTaskFilters(task, filters.value),
    ),
  );

  watch(
    () => route.query,
    (query) => {
      if (route.name !== ROUTE_NAMES.TASK_LIST) return;

      const nextFilters = getCurrentFilters(query);

      if (!sameFilters(filters.value, nextFilters)) {
        filters.value = nextFilters;
      }
    },
  );

  function setFilters(nextFilters: TaskFilters) {
    filters.value = { ...nextFilters };
    const query = Object.fromEntries(
      Object.entries(filters.value).map(([key, initialValue]) => {
        const value = Array.isArray(initialValue)
          ? initialValue.join(',')
          : initialValue;
        return [key, value || undefined];
      }),
    );
    router.push({ query });
  }

  async function ensureTasksLoaded() {
    if (tasks.value === undefined) {
      await queryClient.query({
        ...getTasksQueryOptions(),
        staleTime: 'static',
      });
    }
  }

  return {
    tasks,
    filteredTasks,
    filters,
    error,
    isPending,
    isFetching,
    refetch,
    setFilters,
    ensureTasksLoaded,
  };
});
