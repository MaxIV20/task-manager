import { getTask as request } from '../shared/mock-task-transport';
export const name = 'detail';
export function getTask(id: string) {
  return request(id);
}
