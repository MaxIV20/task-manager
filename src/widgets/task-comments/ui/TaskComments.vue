<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { storeToRefs } from 'pinia';

import { useTaskStore, type TaskComment } from '@/entities/task';
import { CommentForm, useComments } from '@/features/manage-comments';

const { task } = storeToRefs(useTaskStore());
const sortOrder = ref<'asc' | 'desc'>('desc');
const { commentText, createComment, editComment, removeComment, isMutating } =
  useComments();

const comments = computed(() =>
  [...(task.value?.comments ?? [])].sort((left, right) => {
    const difference =
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    return sortOrder.value === 'asc' ? difference : -difference;
  }),
);

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

async function addComment(text: string) {
  if (task.value) {
    await createComment(task.value.id, text);
  }
}

async function promptEdit(comment: TaskComment) {
  const currentTask = task.value;
  if (!currentTask) {
    return;
  }

  try {
    const { value } = await ElMessageBox.prompt(
      'Текст комментария',
      'Редактировать комментарий',
      {
        inputValue: comment.text,
        inputPattern: /\S+/,
        inputErrorMessage: 'Введите текст комментария',
        confirmButtonText: 'Сохранить',
        cancelButtonText: 'Отмена',
      },
    );
    await editComment(currentTask.id, comment.id, value.trim());
  } catch {
    // Cancel keeps the existing comment unchanged.
  }
}
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
    <article
      v-for="comment in comments"
      :key="comment.id"
      :class="$style.taskComment"
    >
      <p>{{ comment.text }}</p>
      <footer>
        <time :datetime="comment.createdAt">
          {{ formatDate(comment.createdAt) }}
        </time>
        <div>
          <el-button
            :disabled="isMutating"
            link
            type="primary"
            @click="promptEdit(comment)"
          >
            Изменить
          </el-button>
          <el-button
            :disabled="isMutating"
            link
            type="danger"
            @click="removeComment(task.id, comment.id)"
          >
            Удалить
          </el-button>
        </div>
      </footer>
    </article>
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

  .taskComment {
    p {
      line-height: 1.5;
      margin: 0 0 10px;
      white-space: pre-wrap;
    }
  }

  footer {
    align-items: center;
    color: var(--app-muted);
    display: flex;
    flex-wrap: wrap;
    font-size: 13px;
    gap: 8px;
    justify-content: space-between;
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

.taskComment {
  border-top: 1px solid var(--app-border);
  margin-top: 18px;
  padding-top: 14px;
}
</style>
