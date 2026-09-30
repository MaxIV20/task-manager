import { useQuery } from '@tanstack/vue-query';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import { Key } from '@/utils/api';

import { getTask, name } from '../endpoints/get-task';
import { SCOPE } from '../shared';

export function useTaskQuery(taskId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: Key.for(SCOPE, name, taskId),
    queryFn: () => getTask(toValue(taskId)),
    enabled: computed(() => Boolean(toValue(taskId))),
  });
}
