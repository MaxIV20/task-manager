import type {
  TaskPriority,
  TaskPriorityOption,
  TaskStatus,
  TaskStatusOption,
} from './task.types';

export const TASK_STATUS_OPTIONS: TaskStatusOption[] = [
  { value: 'todo', label: 'TODO' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

export const TASK_PRIORITY_OPTIONS: TaskPriorityOption[] = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> =
  Object.fromEntries(
    TASK_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
  ) as Record<TaskStatus, string>;

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> =
  Object.fromEntries(
    TASK_PRIORITY_OPTIONS.map(({ value, label }) => [value, label]),
  ) as Record<TaskPriority, string>;
