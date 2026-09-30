import { removeComment as request } from '../shared/mock-task-transport';
export const name = 'remove-comment';
export function removeComment(taskId: string, commentId: string) {
  return request(taskId, commentId);
}
