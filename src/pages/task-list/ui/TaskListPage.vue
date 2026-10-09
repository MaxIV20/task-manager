<script setup lang="ts">
import { TaskFilters } from '@/widgets/task-filters';
import { KanbanBoard } from '@/widgets/kanban-board';
import { onBeforeRouteUpdate } from 'vue-router';
import { useTasksStore } from '@/entities/task';

const { syncQueryFilters } = useTasksStore();

onBeforeRouteUpdate(syncQueryFilters);
</script>

<template>
  <TaskFilters />
  <KanbanBoard />
</template>
