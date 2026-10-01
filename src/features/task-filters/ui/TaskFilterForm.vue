<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';

import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '@/entities/task';

import { useTaskFilters } from '../model';

const isTablet = useMediaQuery('(min-width: 1280px)');
const { title, status, priority, errors, isLoading, apply, reset } =
  useTaskFilters();
</script>

<template>
  <el-form
    :class="$style.taskFilterForm"
    :label-position="isTablet ? 'right' : 'top'"
    @submit.prevent="apply"
  >
    <el-form-item :error="errors.title" label="Название">
      <el-input
        v-model="title"
        clearable
        :disabled="isLoading"
        placeholder="Поиск по названию"
      />
    </el-form-item>
    <el-form-item :error="errors.status" label="Статус">
      <el-select
        v-model="status"
        clearable
        :disabled="isLoading"
        multiple
        placeholder="Все статусы"
      >
        <el-option
          v-for="option in TASK_STATUS_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :error="errors.priority" label="Приоритет">
      <el-select
        v-model="priority"
        clearable
        :disabled="isLoading"
        multiple
        placeholder="Все приоритеты"
      >
        <el-option
          v-for="option in TASK_PRIORITY_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <div :class="$style.taskFilterFormActions">
      <el-button :disabled="isLoading" native-type="submit" type="primary">
        Применить
      </el-button>
      <el-button :disabled="isLoading" @click="reset">
        Сбросить фильтры
      </el-button>
    </div>
  </el-form>
</template>

<style module lang="scss">
.taskFilterForm {
  display: grid;
  gap: 4px 16px;

  @include desktop {
    grid-template-columns:
      minmax(210px, 1fr) minmax(180px, 0.7fr) minmax(180px, 0.7fr)
      auto;
    align-items: end;
  }

  :global(.el-form-item) {
    margin-bottom: 12px;
  }
}

.taskFilterFormActions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
