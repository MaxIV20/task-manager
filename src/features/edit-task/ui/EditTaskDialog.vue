<script setup lang="ts">
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '@/entities/task';
import { DIALOG_WIDTH } from '@/shared/config';

import { useEditTask } from '../model';

const {
  isOpen,
  title,
  description,
  status,
  assignee,
  priority,
  errors,
  open,
  beforeClose,
  submit,
  isMutating,
} = useEditTask();
</script>

<template>
  <el-button @click="open">Редактировать</el-button>
  <el-dialog
    v-model="isOpen"
    :before-close="beforeClose"
    :width="DIALOG_WIDTH"
    title="Редактировать задачу"
  >
    <el-form label-position="top" @submit.prevent="submit">
      <el-form-item :error="errors.title" label="Название" required>
        <el-input v-model="title" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item :error="errors.description" label="Описание">
        <el-input
          v-model="description"
          :rows="4"
          maxlength="2000"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="Статус">
        <el-select v-model="status">
          <el-option
            v-for="option in TASK_STATUS_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :error="errors.assignee" label="Исполнитель">
        <el-input v-model="assignee" />
      </el-form-item>
      <el-form-item :error="errors.priority" label="Приоритет" required>
        <el-select v-model="priority">
          <el-option
            v-for="option in TASK_PRIORITY_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="isMutating" type="primary" @click="submit">
        Сохранить
      </el-button>
    </template>
  </el-dialog>
</template>
