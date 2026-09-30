import { getTasks as request } from '../shared/mock-task-transport';
export const name = 'list';

export function getTasks() {
  return request();
}
