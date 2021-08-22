<template>
  <a-menu theme="dark" inline v-model:selectedKeys="selectedKeys">
    <a-menu-item key="customer">
      <router-link to="customer">
        <user-outlined></user-outlined>
        <span>客户管理</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="contract">
      <router-link to="contract">
        <file-word-outlined />
        <span>合同管理</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="workOrder">
      <router-link to="workOrder">
        <solution-outlined />
        <span>工单管理</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>
<script lang="ts" setup>
import {
  UserOutlined,
  FileWordOutlined,
  SolutionOutlined,
} from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const selectedKeys: any = ref([]);

const route = useRoute();

selectedKeys.value[0] = route.name;
</script>
