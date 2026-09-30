<script setup lang="ts">
import { CreateTaskDialog } from '@/features/create-task';
import { ROUTE_NAMES } from '@/shared/config';
</script>

<template>
  <div :class="$style.appShell">
    <header :class="$style.appHeader">
      <RouterLink
        :class="$style.appBrand"
        :to="{ name: ROUTE_NAMES.TASK_LIST }"
      >
        Taskflow
      </RouterLink>
      <div :class="$style.appHeaderActions"><CreateTaskDialog /></div>
    </header>
    <main :class="$style.appMain"><slot /></main>
  </div>
</template>

<style module lang="scss">
.appShell {
  min-height: 100vh;
  background: var(--app-canvas);
  color: var(--app-text);
}

.appHeader {
  align-items: center;
  background: var(--app-header);
  display: flex;
  justify-content: space-between;
  min-height: 58px;
  padding: 0 16px;
}

.appBrand {
  color: var(--app-header-text);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.appMain {
  margin: 0 auto;
  max-width: 1680px;
  padding: 20px 16px 28px;

  @include tablet {
    padding: 28px 24px 40px;
  }
}
</style>
