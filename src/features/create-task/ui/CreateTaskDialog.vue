<script setup lang="ts">
import { useRouter } from 'vue-router';

import { TASK_PRIORITY_OPTIONS } from '@/entities/task';

import { useCreateTask } from '../model';

const router = useRouter();
const {
  isOpen,
  title,
  description,
  assignee,
  priority,
  errors,
  open,
  close,
  beforeClose,
  submit,
  isDisabled,
  isMutating,
} = useCreateTask((id) => {
  router.push(`/tasks/${id}`);
});
</script>

<template>
  <el-button :disabled="isDisabled" type="primary" @click="open">
    Создать задачу
  </el-button>
  <el-dialog
    v-model="isOpen"
    :before-close="beforeClose"
    destroy-on-close
    title="Создать задачу"
    width="min(560px, calc(100% - 32px))"
    @closed="close"
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
      <el-form-item :error="errors.assignee" label="Исполнитель">
        <el-input v-model="assignee" placeholder="email@example.com" />
      </el-form-item>
      <el-form-item :error="errors.priority" label="Приоритет" required>
        <el-select v-model="priority" placeholder="Выберите приоритет">
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
      <el-button :disabled="isMutating" @click="close">Отмена</el-button>
      <el-button
        :disabled="isDisabled"
        :loading="isMutating"
        type="primary"
        @click="submit"
      >
        Создать
      </el-button>
    </template>
  </el-dialog>
</template>
