<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeRouteUpdate } from 'vue-router';

import { ensureTaskExists, useTaskStore } from '@/entities/task';
import { TaskComments } from '@/widgets/task-comments';
import { TaskContent } from '@/widgets/task-content';
import { TaskInfoSidebar } from '@/widgets/task-info-sidebar';

const taskStore = useTaskStore();
const { task, error, isPending } = storeToRefs(taskStore);
const { refetch } = taskStore;

onBeforeRouteUpdate(ensureTaskExists);
</script>

<template>
  <el-skeleton v-if="isPending" :rows="10" animated />
  <el-result
    v-else-if="error"
    icon="error"
    sub-title="Повторите попытку."
    title="Не удалось загрузить задачу"
  >
    <template #extra>
      <el-button type="primary" @click="refetch">Повторить</el-button>
    </template>
  </el-result>
  <div v-else-if="task" :key="task.id" :class="$style.taskDetails">
    <TaskContent />
    <TaskInfoSidebar :class="$style.info" />
    <TaskComments :class="$style.comment" />
  </div>
  <el-empty v-else description="Задача не найдена" />
</template>

<style module lang="scss">
.taskDetails {
  display: grid;
  gap: 20px;
  align-items: start;

  @include desktop {
    grid-template-areas:
      'content info'
      'comment info';
  }
}

.comment {
  @include desktop {
    grid-area: comment;
  }
}

.info {
  @include desktop {
    grid-area: info;
  }
}

@include desktop {
  .taskDetails {
    grid-template-columns: minmax(0, 1fr) 300px;
  }
}
</style>
