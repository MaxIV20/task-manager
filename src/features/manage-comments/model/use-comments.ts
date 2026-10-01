import { ElMessageBox, ElNotification } from 'element-plus';
import { computed, ref } from 'vue';

import {
  useCreateCommentMutation,
  useRemoveCommentMutation,
  useUpdateCommentMutation,
  type TaskFull,
} from '@/entities/task';

function notifyError(title: string, error: unknown) {
  ElNotification.error({
    title,
    message: error instanceof Error ? error.message : undefined,
  });
}

export function useComments() {
  const commentText = ref('');
  const { isPending: isCreating, mutateAsync: createCommentMutation } =
    useCreateCommentMutation();
  const { isPending: isUpdating, mutateAsync: updateCommentMutation } =
    useUpdateCommentMutation();
  const { isPending: isRemoving, mutateAsync: removeCommentMutation } =
    useRemoveCommentMutation();
  const isMutating = computed(
    () => isCreating.value || isUpdating.value || isRemoving.value,
  );

  async function runMutation(
    operation: () => Promise<TaskFull>,
    successTitle: string,
  ) {
    try {
      await operation();
      ElNotification.success({ title: successTitle });
      return true;
    } catch (error: unknown) {
      notifyError('Не удалось изменить комментарий', error);
      console.error(error);
      return false;
    }
  }

  async function createComment(taskId: string, text: string) {
    const success = await runMutation(
      () => createCommentMutation({ taskId, values: { text } }),
      'Комментарий добавлен',
    );

    if (success) {
      commentText.value = '';
    }
  }

  function editComment(taskId: string, commentId: string, text: string) {
    return runMutation(
      () => updateCommentMutation({ taskId, commentId, values: { text } }),
      'Комментарий обновлён',
    );
  }

  async function removeComment(taskId: string, commentId: string) {
    try {
      await ElMessageBox.confirm(
        'Удалить комментарий?',
        'Удаление комментария',
        {
          confirmButtonText: 'Удалить',
          cancelButtonText: 'Отмена',
          type: 'warning',
        },
      );
    } catch {
      return;
    }

    await runMutation(
      () => removeCommentMutation({ taskId, commentId }),
      'Комментарий удалён',
    );
  }

  return {
    commentText,
    createComment,
    editComment,
    removeComment,
    isMutating,
  };
}
