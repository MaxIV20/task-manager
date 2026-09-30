<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ isLoading: boolean }>();

const emit = defineEmits<{ submit: [text: string] }>();
const text = defineModel<string>({ required: true });
const isSubmitDisabled = computed(() => !text.value.trim());

function submit() {
  const value = text.value.trim();
  if (!value || props.isLoading) {
    return;
  }

  emit('submit', value);
}
</script>

<template>
  <el-form @submit.prevent="submit">
    <el-input
      v-model="text"
      :disabled="isLoading"
      :rows="3"
      placeholder="Напишите комментарий"
      type="textarea"
    />
    <el-button
      :class="$style.submitButton"
      :disabled="isSubmitDisabled"
      :loading="isLoading"
      native-type="submit"
      type="primary"
    >
      Добавить комментарий
    </el-button>
  </el-form>
</template>

<style module>
.submitButton {
  margin-top: 10px;
}
</style>
