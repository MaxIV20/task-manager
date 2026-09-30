import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { Key } from '@/utils/api';

import type { CommentValues } from '../../model';
import { name as detailName } from '../endpoints/get-task';
import { updateComment } from '../endpoints/update-comment';
import { SCOPE } from '../shared';

type UpdateCommentParams = {
  taskId: string;
  commentId: string;
  values: CommentValues;
};

export function useUpdateCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, commentId, values }: UpdateCommentParams) =>
      updateComment(taskId, commentId, values),
    onSuccess: (task, { taskId }) => {
      queryClient.setQueryData(Key.for(SCOPE, detailName, taskId), task);
    },
  });
}
