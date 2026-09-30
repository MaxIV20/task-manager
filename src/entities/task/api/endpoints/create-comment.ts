import type { CommentValues } from '../../model';
import { createComment as request } from '../shared/mock-task-transport';
export const name = 'create-comment';

export function createComment(taskId: string, values: CommentValues) {
  return request(taskId, values);
}
