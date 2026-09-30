export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatusOption = {
  value: TaskStatus;
  label: string;
};

export type TaskPriorityOption = {
  value: TaskPriority;
  label: string;
};

export type TaskComment = {
  id: string;
  text: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: string;
  priority: TaskPriority;
  createdAt: string;
};

export type TaskFull = Task & {
  comments: TaskComment[];
};

export type TaskFilters = {
  title?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
};

export type TaskCreateValues = {
  title: string;
  description?: string;
  assignee: string;
  priority: TaskPriority;
};

export type TaskUpdateValues = TaskCreateValues & {
  status: TaskStatus;
};

export type CommentValues = {
  text: string;
};
