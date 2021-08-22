<template>
  <a-layout class="custom-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <menu-item></menu-item>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background-color: #ffff; padding: 0">
        <div style="display: flex; justify-content: space-between">
          <div>
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          </div>
          <div style="margin-right: 20px">
            <user-outlined :style="{ fontSize: '20px' }" />
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="custom-content">content</a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import MenuItem from './MenuItem.vue'
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

const collapsed = ref(false)
</script>
<style lang="less" scoped>
.custom-layout {
  height: 100vh;
}
.custom-layout .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}
.custom-layout .trigger:hover {
  color: #1890ff;
}
.custom-layout .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.custom-content {
  margin: 10px;
  padding: 10px;
  background: #fff;
  min-height: 280px;
}
</style>
