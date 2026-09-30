import type {
  CommentValues,
  Task,
  TaskCreateValues,
  TaskFull,
  TaskUpdateValues,
} from '../../model';

const READ_DELAY = 2000;
const MUTATION_DELAY = 300;

let tasks: TaskFull[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Подготовить дизайн-систему',
    description: 'Определить типографику, цвета и базовые компоненты',
    status: 'done',
    assignee: 'ivanov@smile.ru',
    priority: 'high',
    createdAt: '2024-03-15T10:30:00Z',
    comments: [
      {
        id: 'comment-1',
        text: 'При разработке дизайна использовать Pixso',
        createdAt: '2024-03-15T11:00:00Z',
      },
      {
        id: 'comment-2',
        text: 'Дизайн-система должна быть готова к запуску',
        createdAt: '2024-03-16T09:15:00Z',
      },
    ],
  },
  {
    id: '6ba7b810-9dad-11d1-84b6-00c04fd21f14',
    title: 'Настроить CI/CD',
    status: 'in_progress',
    assignee: 'petrova@smile.ru',
    priority: 'high',
    createdAt: '2024-03-20T14:00:00Z',
    comments: [],
  },
  {
    id: '6ba7b811-9dad-11d1-84b6-00c04fd21f15',
    title: 'Написать документацию API',
    status: 'todo',
    assignee: 'sidorov@smile.ru',
    priority: 'medium',
    createdAt: '2024-04-01T09:15:00Z',
    comments: [],
  },
];

function clone(task: TaskFull): TaskFull {
  return {
    ...task,
    comments: task.comments.map((comment) => ({ ...comment })),
  };
}

function toPreview(task: TaskFull): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    assignee: task.assignee,
    priority: task.priority,
    createdAt: task.createdAt,
  };
}

function delay(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function getTaskIndex(id: string) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) throw new Error('Task not found');
  return index;
}

export async function getTasks() {
  await delay(READ_DELAY);
  return tasks.map(toPreview);
}

export async function getTask(id: string) {
  await delay(READ_DELAY);
  const task = tasks.find((currentTask) => currentTask.id === id);
  return task ? clone(task) : null;
}

export async function createTask(values: TaskCreateValues) {
  await delay(MUTATION_DELAY);
  const task: TaskFull = {
    ...values,
    description: values.description || undefined,
    id: crypto.randomUUID(),
    status: 'todo',
    createdAt: new Date().toISOString(),
    comments: [],
  };
  tasks = [...tasks, task];
  return clone(task);
}

export async function updateTask(id: string, values: TaskUpdateValues) {
  await delay(MUTATION_DELAY);
  const index = getTaskIndex(id);
  const task: TaskFull = {
    ...tasks[index],
    ...values,
    description: values.description || undefined,
  };
  tasks.splice(index, 1, task);
  return clone(task);
}

export async function cloneTask(id: string) {
  await delay(MUTATION_DELAY);
  const task = { ...clone(tasks[getTaskIndex(id)]), id: crypto.randomUUID() };
  tasks = [...tasks, task];
  return clone(task);
}

export async function removeTask(id: string) {
  await delay(MUTATION_DELAY);
  tasks.splice(getTaskIndex(id), 1);
}

function updateComments(
  taskId: string,
  callback: (comments: TaskFull['comments']) => TaskFull['comments'],
) {
  const index = getTaskIndex(taskId);
  const task = { ...tasks[index], comments: callback(tasks[index].comments) };
  tasks.splice(index, 1, task);
  return clone(task);
}

export async function createComment(taskId: string, values: CommentValues) {
  await delay(MUTATION_DELAY);
  return updateComments(taskId, (comments) => [
    ...comments,
    {
      id: crypto.randomUUID(),
      text: values.text,
      createdAt: new Date().toISOString(),
    },
  ]);
}

export async function updateComment(
  taskId: string,
  commentId: string,
  values: CommentValues,
) {
  await delay(MUTATION_DELAY);
  return updateComments(taskId, (comments) => {
    if (!comments.some((comment) => comment.id === commentId))
      throw new Error('Comment not found');
    return comments.map((comment) =>
      comment.id === commentId ? { ...comment, text: values.text } : comment,
    );
  });
}

export async function removeComment(taskId: string, commentId: string) {
  await delay(MUTATION_DELAY);
  return updateComments(taskId, (comments) => {
    if (!comments.some((comment) => comment.id === commentId))
      throw new Error('Comment not found');
    return comments.filter((comment) => comment.id !== commentId);
  });
}
