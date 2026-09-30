<script setup lang="ts">
import { DefaultLayout } from '@/layouts/default';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <DefaultLayout>
      <component :is="Component" v-if="Component" />
      <el-skeleton v-else :rows="10" animated />
    </DefaultLayout>
  </RouterView>
</template>
