import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { Key } from '@/utils/api';

import type { Task } from '../../model';
import { createTask } from '../endpoints/create-task';
import { name as detailName } from '../endpoints/get-task';
import { name as listName } from '../endpoints/get-tasks';
import { SCOPE } from '../shared';

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(Key.for(SCOPE, listName), (tasks) =>
        tasks ? [...tasks, task] : tasks,
      );
      queryClient.setQueryData(Key.for(SCOPE, detailName, task.id), task);
    },
  });
}
