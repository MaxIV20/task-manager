import { object, string } from 'yup';

import type { TaskPriority, TaskStatus } from './task.types';

const taskFormFields = {
  title: string()
    .trim()
    .required('Введите название')
    .min(3, 'Минимум 3 символа')
    .max(200, 'Максимум 200 символов'),
  description: string().max(2000, 'Максимум 2000 символов'),
  assignee: string().trim().email('Введите корректный email'),
  priority: string<TaskPriority>()
    .oneOf(['low', 'medium', 'high'], 'Выберите допустимый приоритет')
    .required('Выберите приоритет'),
};

export const taskFormSchema = object(taskFormFields);

export const taskUpdateFormSchema = object({
  ...taskFormFields,
  status: string<TaskStatus>()
    .required('Выберите статус')
    .oneOf(['todo', 'in_progress', 'done'], 'Выберите допустимый статус'),
});
