import type { Task } from '../model';

export function hasTaskWithTitle(tasks: Task[], title: string) {
  const normalizedTitle = title.trim().toLocaleLowerCase();

  return tasks.some(
    (task) => task.title.trim().toLocaleLowerCase() === normalizedTitle,
  );
}
