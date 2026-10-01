<script setup lang="ts">
import { DIALOG_WIDTH } from '@/shared/config';

const props = defineProps<{
  error?: string;
  isLoading: boolean;
}>();

const emit = defineEmits<{ submit: []; cancel: [] }>();
const isOpen = defineModel<boolean>({ required: true });
const text = defineModel<string>('text', { required: true });
</script>

<template>
  <el-dialog
    v-model="isOpen"
    :close-on-click-modal="!props.isLoading"
    :close-on-press-escape="!props.isLoading"
    :show-close="!props.isLoading"
    :width="DIALOG_WIDTH"
    title="Редактировать комментарий"
  >
    <el-form label-position="top" @submit.prevent="emit('submit')">
      <el-form-item :error="props.error" label="Текст комментария" required>
        <el-input
          v-model="text"
          :disabled="props.isLoading"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="props.isLoading" @click="emit('cancel')">
        Отмена
      </el-button>
      <el-button
        :loading="props.isLoading"
        type="primary"
        @click="emit('submit')"
      >
        Сохранить
      </el-button>
    </template>
  </el-dialog>
</template>
