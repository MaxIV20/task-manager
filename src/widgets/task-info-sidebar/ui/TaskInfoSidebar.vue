<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  useTaskStore,
} from '@/entities/task';

const { task } = storeToRefs(useTaskStore());
</script>

<template>
  <aside v-if="task" :class="$style.taskInfo">
    <h2>Информация</h2>
    <dl>
      <div>
        <dt>Статус</dt>
        <dd>{{ TASK_STATUS_LABELS[task.status] }}</dd>
      </div>
      <div>
        <dt>Приоритет</dt>
        <dd>{{ TASK_PRIORITY_LABELS[task.priority] }}</dd>
      </div>
      <div>
        <dt>Исполнитель</dt>
        <dd>{{ task.assignee || 'Не назначен' }}</dd>
      </div>
      <div>
        <dt>Создана</dt>
        <dd>
          {{
            format(parseISO(task.createdAt), "PPP 'в' HH:mm", { locale: ru })
          }}
        </dd>
      </div>
    </dl>
  </aside>
</template>

<style module lang="scss">
.taskInfo {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  min-width: 0;
  padding: 20px;

  h2 {
    font-size: 18px;
    margin: 0 0 16px;
  }

  dl {
    display: grid;
    gap: 16px;
    margin: 0;
  }

  div {
    display: grid;
    gap: 4px;
  }

  dt {
    color: var(--app-muted);
    font-size: 13px;
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
}
</style>
