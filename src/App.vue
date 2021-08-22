<template>
  <div id="app">
    <a-config-provider>
      <router-view />
    </a-config-provider>
  </div>
</template>
<script lang="ts" setup>
import Layout from './views/layout/Layout.vue';
</script>
