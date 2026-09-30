<script setup lang="ts">
import { TaskFilterForm } from '@/features/apply-task-filters';
</script>

<template>
  <section :class="$style.taskFilters">
    <h1 :class="$style.taskFiltersTitle">Задачи</h1>
    <TaskFilterForm />
  </section>
</template>

<style module lang="scss">
.taskFilters {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 16px;
}

.taskFiltersTitle {
  font-size: 24px;
  margin: 0 0 18px;
}
</style>
