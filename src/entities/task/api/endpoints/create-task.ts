import type { TaskCreateValues } from '../../model';
import { createTask as request } from '../shared/mock-task-transport';
export const name = 'create';

export function createTask(values: TaskCreateValues) {
  return request(values);
}
