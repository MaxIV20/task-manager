import { toTypedSchema } from '@vee-validate/yup';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { watch } from 'vue';
import { array, object, string } from 'yup';

import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  useTasksStore,
  type TaskFilters,
} from '@/entities/task';

const filtersSchema = object({
  title: string()
    .trim()
    .test(
      'title-length',
      'Введите от 3 до 200 символов',
      (value) => !value || (value.length >= 3 && value.length <= 200),
    ),
  status: array()
    .of(string())
    .test(
      'valid-statuses',
      'Выберите допустимый статус',
      (values) =>
        !values ||
        values.every((value) =>
          TASK_STATUS_OPTIONS.some((option) => option.value === value),
        ),
    ),
  priority: array()
    .of(string())
    .test(
      'valid-priorities',
      'Выберите допустимый приоритет',
      (values) =>
        !values ||
        values.every((value) =>
          TASK_PRIORITY_OPTIONS.some((option) => option.value === value),
        ),
    ),
});

function emptyFilters(): TaskFilters {
  return { status: [], priority: [] };
}

function copyFilters(filters: TaskFilters): TaskFilters {
  return {
    title: filters.title,
    status: [...(filters.status ?? [])],
    priority: [...(filters.priority ?? [])],
  };
}

export function useTaskFilters() {
  const tasksStore = useTasksStore();
  const { filters, isPending: isLoading } = storeToRefs(tasksStore);
  const { defineField, errors, handleSubmit, resetForm } = useForm<TaskFilters>(
    {
      initialValues: copyFilters(filters.value),
      validationSchema: toTypedSchema(filtersSchema),
    },
  );
  const [title] = defineField('title');
  const [status] = defineField('status');
  const [priority] = defineField('priority');

  watch(filters, () => {
    resetForm({ values: copyFilters(filters.value) }, { force: true });
  });

  const apply = handleSubmit((values) => {
    tasksStore.setFilters({
      title: values.title || undefined,
      status: [...(values.status ?? [])],
      priority: [...(values.priority ?? [])],
    });
  });

  function reset() {
    const empty = emptyFilters();
    resetForm({ values: empty }, { force: true });
    tasksStore.setFilters(empty);
  }

  return { title, status, priority, errors, isLoading, apply, reset };
}
