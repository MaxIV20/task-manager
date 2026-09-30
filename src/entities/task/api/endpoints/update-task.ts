import type { TaskUpdateValues } from '../../model';
import { updateTask as request } from '../shared/mock-task-transport';
export const name = 'update';
export function updateTask(id: string, values: TaskUpdateValues) {
  return request(id, values);
}
