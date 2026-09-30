import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { Key } from '@/utils/api';

import { name as detailName } from '../endpoints/get-task';
import { removeComment } from '../endpoints/remove-comment';
import { SCOPE } from '../shared';

type RemoveCommentParams = {
  taskId: string;
  commentId: string;
};

export function useRemoveCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, commentId }: RemoveCommentParams) =>
      removeComment(taskId, commentId),
    onSuccess: (task, { taskId }) => {
      queryClient.setQueryData(Key.for(SCOPE, detailName, taskId), task);
    },
  });
}
