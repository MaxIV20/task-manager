import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { Key } from '@/utils/api';

import type { Task, TaskUpdateValues } from '../../model';
import { name as detailName } from '../endpoints/get-task';
import { name as listName } from '../endpoints/get-tasks';
import { updateTask } from '../endpoints/update-task';
import { SCOPE } from '../shared';

type UpdateTaskParams = {
  id: string;
  values: TaskUpdateValues;
};

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: UpdateTaskParams) => updateTask(id, values),
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(Key.for(SCOPE, listName), (tasks) =>
        tasks?.map((currentTask) =>
          currentTask.id === task.id ? task : currentTask,
        ),
      );
      queryClient.setQueryData(Key.for(SCOPE, detailName, task.id), task);
    },
  });
}
