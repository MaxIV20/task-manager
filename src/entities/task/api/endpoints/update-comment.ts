import type { CommentValues } from '../../model';
import { updateComment as request } from '../shared/mock-task-transport';
export const name = 'update-comment';
export function updateComment(
  taskId: string,
  commentId: string,
  values: CommentValues,
) {
  return request(taskId, commentId, values);
}
