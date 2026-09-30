import { queryOptions, useQuery } from '@tanstack/vue-query';

import { Key } from '@/utils/api';

import { getTasks, name } from '../endpoints/get-tasks';
import { SCOPE } from '../shared';

export function getTasksQueryOptions() {
  return queryOptions({
    queryKey: Key.for(SCOPE, name),
    queryFn: getTasks,
  });
}

export function useTasksQuery() {
  return useQuery(getTasksQueryOptions());
}
