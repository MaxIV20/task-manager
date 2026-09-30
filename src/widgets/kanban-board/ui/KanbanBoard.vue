<script setup lang="ts">
import { TASK_STATUS_OPTIONS, useTasksStore } from '@/entities/task';

import KanbanColumn from './KanbanColumn.vue';

const tasksStore = useTasksStore();
</script>

<template>
  <section :class="$style.kanbanBoard">
    <el-skeleton v-if="tasksStore.isPending" :rows="6" animated />
    <el-result
      v-else-if="tasksStore.error"
      icon="error"
      sub-title="Попробуйте загрузить данные ещё раз."
      title="Не удалось загрузить задачи"
    >
      <template #extra>
        <el-button type="primary" @click="tasksStore.refetch">
          Повторить
        </el-button>
      </template>
    </el-result>
    <div v-else :class="$style.kanbanBoardColumns">
      <KanbanColumn
        v-for="option in TASK_STATUS_OPTIONS"
        :key="option.value"
        :status="option.value"
      />
    </div>
  </section>
</template>

<style module lang="scss">
.kanbanBoard {
  min-width: 0;
}

.kanbanBoardColumns {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;

  @include tablet {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: visible;
  }
}
</style>
