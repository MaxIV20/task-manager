<script setup lang="ts">
import { CommentEditDialog, CommentForm } from '@/features/manage-comments';

import { useTaskCommentsViewModel } from '../model';
import TaskComment from './TaskComment.vue';

const {
  task,
  sortOrder,
  comments,
  commentText,
  isMutating,
  isEditOpen,
  editText,
  editErrors,
  isEditSubmitting,
  formatDate,
  addComment,
  openEdit,
  closeEdit,
  submitEdit,
  removeComment,
} = useTaskCommentsViewModel();
</script>

<template>
  <section v-if="task" :class="$style.taskComments">
    <div :class="$style.taskCommentsHeading">
      <h2>Комментарии</h2>
      <el-select v-model="sortOrder">
        <el-option label="Сначала новые" value="desc" />
        <el-option label="Сначала старые" value="asc" />
      </el-select>
    </div>
    <CommentForm
      v-model="commentText"
      :is-loading="isMutating"
      @submit="addComment"
    />
    <p v-if="!comments.length" :class="$style.taskCommentsEmpty">
      Комментариев пока нет.
    </p>
    <TaskComment
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :formatted-date="formatDate(comment.createdAt)"
      :is-loading="isMutating"
      @edit="openEdit"
      @remove="removeComment"
    />
    <CommentEditDialog
      v-model="isEditOpen"
      v-model:text="editText"
      :error="editErrors.text"
      :is-loading="isEditSubmitting"
      @cancel="closeEdit"
      @submit="submitEdit"
    />
  </section>
</template>

<style module lang="scss">
.taskComments {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  min-width: 0;
  overflow-wrap: anywhere;
  padding: 20px;

  h2 {
    font-size: 20px;
    margin: 0;
  }
}

.taskCommentsHeading {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.taskCommentsEmpty {
  color: var(--app-muted);
  margin: 20px 0 0;
}
</style>
