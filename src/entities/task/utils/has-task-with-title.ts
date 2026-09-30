import type { Task } from '../model';

export function hasTaskWithTitle(
  tasks: Task[],
  title: string,
  excludedId?: string,
) {
  return tasks.some(
    (task) =>
      task.id !== excludedId &&
      task.title.trim().toLocaleLowerCase() ===
        title.trim().toLocaleLowerCase(),
  );
}
