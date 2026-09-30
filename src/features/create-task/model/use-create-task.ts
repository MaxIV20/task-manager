import { ElNotification } from 'element-plus';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';

import {
  hasTaskWithTitle,
  taskFormSchema,
  useCreateTaskMutation,
  useTasksStore,
  type TaskCreateValues,
} from '@/entities/task';

function createDefaultValues(): TaskCreateValues {
  return {
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
  };
}

export function useCreateTask(onSuccess: (id: string) => void) {
  const tasksStore = useTasksStore();
  const isOpen = ref(false);
  const { mutateAsync: createTask } = useCreateTaskMutation();
  const {
    defineField,
    errors,
    handleSubmit,
    isSubmitting,
    resetForm,
    setFieldError,
  } = useForm<TaskCreateValues>({
    initialValues: createDefaultValues(),
    validationSchema: toTypedSchema(taskFormSchema),
  });

  const [title] = defineField('title');
  const [description] = defineField('description');
  const [assignee] = defineField('assignee');
  const [priority] = defineField('priority');
  const isTasksUnavailable = computed(
    () =>
      tasksStore.isFetching || !tasksStore.tasks || Boolean(tasksStore.error),
  );
  const isDisabled = computed(
    () => isTasksUnavailable.value || isSubmitting.value,
  );

  function open() {
    if (isDisabled.value) {
      return;
    }

    resetForm({ values: createDefaultValues() });
    isOpen.value = true;
  }

  function close() {
    if (isSubmitting.value) {
      return;
    }

    isOpen.value = false;
  }

  function beforeClose(done: () => void) {
    if (isSubmitting.value) {
      return;
    }

    done();
  }

  const submit = handleSubmit(async (values) => {
    if (isTasksUnavailable.value) {
      return;
    }

    try {
      if (hasTaskWithTitle(tasksStore.tasks ?? [], values.title)) {
        setFieldError('title', 'Задача с таким названием уже существует');
        return;
      }
      const task = await createTask(values);
      isOpen.value = false;
      ElNotification.success({ title: 'Задача создана' });
      onSuccess(task.id);
    } catch (error: unknown) {
      ElNotification.error({
        title: 'Не удалось создать задачу',
        message: error instanceof Error ? error.message : undefined,
      });
    }
  });

  return {
    isOpen,
    title,
    description,
    assignee,
    priority,
    errors,
    open,
    close,
    beforeClose,
    submit,
    isDisabled,
    isMutating: isSubmitting,
  };
}
