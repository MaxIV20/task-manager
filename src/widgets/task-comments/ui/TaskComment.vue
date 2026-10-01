<script setup lang="ts">
import type { TaskComment } from '@/entities/task';

const props = defineProps<{
  comment: TaskComment;
  formattedDate: string;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  edit: [comment: TaskComment];
  remove: [commentId: string];
}>();
</script>

<template>
  <article :class="$style.taskComment">
    <p>{{ props.comment.text }}</p>
    <footer>
      <time :datetime="props.comment.createdAt">
        {{ props.formattedDate }}
      </time>
      <div>
        <el-button
          :disabled="props.isLoading"
          link
          type="primary"
          @click="emit('edit', props.comment)"
        >
          Изменить
        </el-button>
        <el-button
          :disabled="props.isLoading"
          link
          type="danger"
          @click="emit('remove', props.comment.id)"
        >
          Удалить
        </el-button>
      </div>
    </footer>
  </article>
</template>

<style module lang="scss">
.taskComment {
  border-top: 1px solid var(--app-border);
  margin-top: 18px;
  padding-top: 14px;

  p {
    line-height: 1.5;
    margin: 0 0 10px;
    white-space: pre-wrap;
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
</style>
