import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { Key } from '@/utils/api';

import type { CommentValues } from '../../model';
import { createComment } from '../endpoints/create-comment';
import { name as detailName } from '../endpoints/get-task';
import { SCOPE } from '../shared';

type CreateCommentParams = {
  taskId: string;
  values: CommentValues;
};

export function useCreateCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, values }: CreateCommentParams) =>
      createComment(taskId, values),
    onSuccess: (task, { taskId }) => {
      queryClient.setQueryData(Key.for(SCOPE, detailName, taskId), task);
    },
  });
}
