import { ElMessageBox, ElNotification } from 'element-plus';
import { toTypedSchema } from '@vee-validate/yup';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { ref } from 'vue';

import {
  taskUpdateFormSchema,
  useTaskStore,
  useUpdateTaskMutation,
  type TaskFull,
  type TaskUpdateValues,
} from '@/entities/task';

function getInitialValues(task: TaskFull): TaskUpdateValues {
  return {
    title: task.title,
    description: task.description ?? '',
    assignee: task.assignee,
    priority: task.priority,
    status: task.status,
  };
}

export function useEditTask() {
  const { task } = storeToRefs(useTaskStore());
  const { mutateAsync: updateTask } = useUpdateTaskMutation();
  const isOpen = ref(false);
  const { defineField, errors, handleSubmit, isSubmitting, meta, resetForm } =
    useForm<TaskUpdateValues>({
      initialValues: task.value ? getInitialValues(task.value) : undefined,
      validationSchema: toTypedSchema(taskUpdateFormSchema),
    });
  const [title] = defineField('title');
  const [description] = defineField('description');
  const [status] = defineField('status');
  const [assignee] = defineField('assignee');
  const [priority] = defineField('priority');

  function open() {
    if (!task.value) {
      return;
    }

    resetForm({ values: getInitialValues(task.value) });
    isOpen.value = true;
  }

  async function beforeClose(done: () => void) {
    if (isSubmitting.value) {
      return;
    }

    if (meta.value.dirty) {
      try {
        await ElMessageBox.confirm(
          'Несохранённые изменения будут потеряны. Закрыть форму?',
          'Закрытие редактора',
          {
            confirmButtonText: 'Закрыть',
            cancelButtonText: 'Продолжить редактирование',
            type: 'warning',
          },
        );
      } catch {
        return;
      }
    }

    done();
  }

  async function submit() {
    const currentTask = task.value;
    if (!currentTask) {
      return;
    }

    await handleSubmit(async (values) => {
      try {
        await updateTask({ id: currentTask.id, values });
        isOpen.value = false;
        ElNotification.success({ title: 'Задача обновлена' });
      } catch (error: unknown) {
        ElNotification.error({
          title: 'Не удалось обновить задачу',
          message: error instanceof Error ? error.message : undefined,
        });
      }
    })();
  }

  return {
    isOpen,
    title,
    description,
    status,
    assignee,
    priority,
    errors,
    open,
    beforeClose,
    submit,
    isMutating: isSubmitting,
  };
}
