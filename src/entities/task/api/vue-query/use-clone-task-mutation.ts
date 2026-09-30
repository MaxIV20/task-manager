import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { Key } from '@/utils/api';

import type { Task } from '../../model';
import { cloneTask } from '../endpoints/clone-task';
import { name as listName } from '../endpoints/get-tasks';
import { SCOPE } from '../shared';

export function useCloneTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cloneTask,
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(Key.for(SCOPE, listName), (tasks) =>
        tasks ? [...tasks, task] : tasks,
      );
    },
  });
}
