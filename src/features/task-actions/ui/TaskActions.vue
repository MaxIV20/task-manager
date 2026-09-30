<script setup lang="ts">
import { useTaskActions } from '../model';

const { isMutating, cloneTask, removeTask } = useTaskActions();
</script>

<template>
  <div :class="$style.taskActions">
    <el-button :loading="isMutating" @click="cloneTask">Клонировать</el-button>
    <el-button :loading="isMutating" type="danger" @click="removeTask">
      Удалить
    </el-button>
  </div>
</template>

<style module>
.taskActions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
