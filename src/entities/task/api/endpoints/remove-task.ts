import { removeTask as request } from '../shared/mock-task-transport';
export const name = 'remove';
export function removeTask(id: string) {
  return request(id);
}
