import { cloneTask as request } from '../shared/mock-task-transport';
export const name = 'clone';
export function cloneTask(id: string) {
  return request(id);
}
