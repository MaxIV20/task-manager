import type { Task, TaskFilters } from '../model';

export function matchesTaskFilters(task: Task, filters?: TaskFilters) {
  if (!filters) {
    return true;
  }

  const matchedTitle =
    !filters.title ||
    task.title
      .toLocaleLowerCase()
      .includes(filters.title.trim().toLocaleLowerCase());
  const matchedStatus =
    !filters.status?.length || filters.status.includes(task.status);
  const matchedPriority =
    !filters.priority?.length || filters.priority.includes(task.priority);

  return matchedTitle && matchedStatus && matchedPriority;
}
