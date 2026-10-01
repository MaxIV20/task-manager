import { computed, ref } from 'vue';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import { storeToRefs } from 'pinia';
import { compareAsc, format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

import { useTaskStore, type TaskComment } from '@/entities/task';
import { useComments } from '@/features/manage-comments';

export function useTaskCommentsViewModel() {
  const { task } = storeToRefs(useTaskStore());
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const isEditOpen = ref(false);
  const editingTarget = ref<{ taskId: string; commentId: string }>();
  const {
    commentText,
    createComment,
    editComment,
    removeComment: removeTaskComment,
    isMutating,
  } = useComments();

  const {
    defineField,
    errors: editErrors,
    handleSubmit,
    isSubmitting: isEditSubmitting,
    resetForm,
  } = useForm<{ text: string }>({
    initialValues: { text: '' },
    validationSchema: toTypedSchema(
      object({ text: string().trim().required('Введите текст комментария') }),
    ),
  });
  const [editText] = defineField('text');

  const comments = computed(() =>
    [...(task.value?.comments ?? [])].sort((left, right) => {
      const difference = compareAsc(
        parseISO(left.createdAt),
        parseISO(right.createdAt),
      );
      return sortOrder.value === 'asc' ? difference : -difference;
    }),
  );

  function formatDate(value: string) {
    return format(parseISO(value), 'PP, HH:mm', { locale: ru });
  }

  async function addComment(text: string) {
    if (task.value) {
      await createComment(task.value.id, text);
    }
  }

  function openEdit(comment: TaskComment) {
    const currentTask = task.value;
    if (!currentTask || isMutating.value || isEditSubmitting.value) {
      return;
    }

    editingTarget.value = { taskId: currentTask.id, commentId: comment.id };
    resetForm({ values: { text: comment.text } });
    isEditOpen.value = true;
  }

  function closeEdit() {
    if (!isEditSubmitting.value) {
      isEditOpen.value = false;
    }
  }

  async function submitEdit() {
    const target = editingTarget.value;
    if (!target || isEditSubmitting.value) {
      return;
    }

    await handleSubmit(async (values) => {
      const success = await editComment(
        target.taskId,
        target.commentId,
        values.text,
      );

      if (success) {
        isEditOpen.value = false;
      }
    })();
  }

  async function removeComment(commentId: string) {
    if (task.value) {
      await removeTaskComment(task.value.id, commentId);
    }
  }

  return {
    task,
    sortOrder,
    comments,
    commentText,
    isMutating,
    isEditOpen,
    editText,
    editErrors,
    isEditSubmitting,
    formatDate,
    addComment,
    openEdit,
    closeEdit,
    submitEdit,
    removeComment,
  };
}
