<script setup lang="ts">
import { computed } from 'vue';

import {
  TASK_STATUS_LABELS,
  useTasksStore,
  type TaskStatus,
} from '@/entities/task';

import TaskCard from './TaskCard.vue';

const props = defineProps<{
  status: TaskStatus;
}>();
const tasksStore = useTasksStore();
const tasks = computed(() =>
  tasksStore.filteredTasks.filter((task) => task.status === props.status),
);
</script>

<template>
  <section :class="$style.kanbanColumn">
    <h2>
      {{ TASK_STATUS_LABELS[status] }}
      <span>({{ tasks.length }})</span>
    </h2>
    <div :class="$style.kanbanColumnCards">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
      <p v-if="!tasks.length" :class="$style.kanbanColumnEmpty">Нет задач</p>
    </div>
  </section>
</template>

<style module lang="scss">
.kanbanColumn {
  background: var(--app-column);
  border-radius: 8px;
  min-height: 280px;
  padding: 12px;
  width: min(88vw, 360px);

  h2 {
    font-size: 15px;
    margin: 0 0 12px;

    span {
      color: var(--app-muted);
      font-weight: 400;
    }
  }

  @include tablet {
    min-width: 0;
    width: auto;
  }
}

.kanbanColumnCards {
  display: grid;
  gap: 10px;
}

.kanbanColumnEmpty {
  color: var(--app-muted);
  font-size: 14px;
  margin: 8px 0;
}
</style>
