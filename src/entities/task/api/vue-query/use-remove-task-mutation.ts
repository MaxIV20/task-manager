import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { Key } from '@/utils/api';

import type { Task } from '../../model';
import { name as detailName } from '../endpoints/get-task';
import { name as listName } from '../endpoints/get-tasks';
import { removeTask } from '../endpoints/remove-task';
import { SCOPE } from '../shared';

export function useRemoveTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTask,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Task[]>(Key.for(SCOPE, listName), (tasks) =>
        tasks?.filter((task) => task.id !== id),
      );
      queryClient.removeQueries({
        queryKey: Key.for(SCOPE, detailName, id),
      });
    },
  });
}
