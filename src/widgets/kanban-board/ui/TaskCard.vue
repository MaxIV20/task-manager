<script setup lang="ts">
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type Task,
} from '@/entities/task';

defineProps<{ task: Task }>();

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(
    new Date(value),
  );
}
</script>

<template>
  <RouterLink :class="$style.taskCard" :to="`/tasks/${task.id}`">
    <strong :class="$style.taskCardTitle">{{ task.title }}</strong>
    <span :class="$style.taskCardMeta">
      {{ TASK_STATUS_LABELS[task.status] }}
    </span>
    <span :class="$style.taskCardMeta">
      Приоритет: {{ TASK_PRIORITY_LABELS[task.priority] }}
    </span>
    <span :class="$style.taskCardMeta">{{ task.assignee }}</span>
    <span :class="$style.taskCardMeta">
      Создана: {{ formatDate(task.createdAt) }}
    </span>
  </RouterLink>
</template>

<style module lang="scss">
.taskCard {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgb(9 30 66 / 12%);
  color: inherit;
  display: grid;
  gap: 7px;
  min-width: 0;
  overflow-wrap: anywhere;
  padding: 12px;
  text-decoration: none;

  &:hover {
    border-color: var(--app-link);
  }
}

.taskCardTitle {
  line-height: 1.35;
}

.taskCardMeta {
  color: var(--app-muted);
  font-size: 13px;
  line-height: 1.3;
}
</style>
