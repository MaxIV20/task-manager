import { defineStore } from 'pinia';
import { useQueryClient } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import {
  useRoute,
  useRouter,
  type LocationQuery,
  RouteLocationNormalized,
} from 'vue-router';

import {
  getTasksQueryOptions,
  useTasksQuery,
} from '../api/vue-query/use-tasks-query';
import { matchesTaskFilters } from '../utils';
import type { TaskFilters, TaskStatus, TaskPriority } from './task.types';
import { TASK_STATUSES, TASK_PRIORITIES } from './task.constants';

function getFilterValueFromQuery(
  filter: LocationQuery[string],
): string | undefined {
  return (Array.isArray(filter) ? filter[0] : filter) ?? undefined;
}

function getFilterStringValue(
  filter: TaskFilters[keyof TaskFilters],
): string | undefined {
  return Array.isArray(filter) ? filter.join(',') : filter;
}

function getCurrentFilters(query: LocationQuery): TaskFilters {
  const title = getFilterValueFromQuery(query.title);
  const status = getFilterValueFromQuery(query.status);
  const priority = getFilterValueFromQuery(query.priority);

  return {
    title,
    status: status
      ?.split(',')
      .filter((i) =>
        TASK_STATUSES.includes(i as TaskStatus),
      ) as TaskFilters['status'],
    priority: priority
      ?.split(',')
      .filter((i) =>
        TASK_PRIORITIES.includes(i as TaskPriority),
      ) as TaskFilters['priority'],
  };
}

function sameFilters(left: TaskFilters, right: TaskFilters): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  const keys = new Set([...leftKeys, ...rightKeys] as (keyof TaskFilters)[]);

  return [...keys].every((key) => {
    const leftQueryValue = getFilterStringValue(left[key]);
    const rightQueryValue = getFilterStringValue(right[key]);
    return leftQueryValue === rightQueryValue;
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
  const filteredTasks = computed(() =>
    (tasks.value ?? []).filter((task) =>
      matchesTaskFilters(task, filters.value),
    ),
  );

  function syncQueryFilters(to: RouteLocationNormalized) {
    const nextFilters = getCurrentFilters(to.query);

    if (!sameFilters(filters.value, nextFilters)) {
      filters.value = nextFilters;
    }
  }

  function setFilters(nextFilters: TaskFilters) {
    filters.value = structuredClone(nextFilters);
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
    syncQueryFilters,
  };
});
