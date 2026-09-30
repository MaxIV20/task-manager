import type { Task, TaskFilters } from '../model';

export function matchesTaskFilters(task: Task, filters?: TaskFilters) {
  if (!filters) {
    return true;
  }

  return (
    (!filters.title ||
      task.title
        .toLocaleLowerCase()
        .includes(filters.title.trim().toLocaleLowerCase())) &&
    (!filters.status?.length || filters.status.includes(task.status)) &&
    (!filters.priority?.length || filters.priority.includes(task.priority))
  );
}
