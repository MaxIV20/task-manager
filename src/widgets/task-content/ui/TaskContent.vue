<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useTaskStore } from '@/entities/task';
import { EditTaskDialog } from '@/features/edit-task';
import { TaskActions } from '@/features/task-actions';

const { task } = storeToRefs(useTaskStore());
</script>

<template>
  <section v-if="task" :class="$style.taskContent">
    <RouterLink :class="$style.taskContentBack" to="/tasks">
      ← Назад к задачам
    </RouterLink>
    <div :class="$style.taskContentHeading">
      <h1>{{ task.title }}</h1>
      <div :class="$style.taskContentActions">
        <EditTaskDialog />
        <TaskActions />
      </div>
    </div>
    <p :class="$style.taskContentDescription">
      {{ task.description || 'Описание не добавлено' }}
    </p>
  </section>
</template>

<style module lang="scss">
.taskContent {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  min-width: 0;
  overflow-wrap: anywhere;
  padding: 20px;

  h1 {
    font-size: 28px;
    line-height: 1.25;
    margin: 0;
  }
}

.taskContentBack {
  color: var(--app-link);
  display: inline-block;
  margin-bottom: 16px;
  text-decoration: none;
}

.taskContentHeading {
  align-items: start;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: space-between;

  h1 {
    min-width: 0;
  }
}

.taskContentActions {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.taskContentDescription {
  line-height: 1.6;
  margin: 28px 0 0;
  white-space: pre-wrap;
}

@include tablet {
  .taskContentHeading {
    align-items: center;
    flex-direction: row;
  }
}
</style>
