import Layout from '../views/layout/Layout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routerHistory = createWebHistory();

const router = createRouter(
  {
    history: routerHistory,
    routes: [
      {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
          {
            path: 'dashboard',
            component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/index.vue'),
            name: 'dashboard',
          },
          {
            path: 'customer',
            component: () => import(/* webpackChunkName: "customer" */ '../views/pages/customer/index.vue'),
            name: 'customer',
          },
          {
            path: 'contract',
            component: () => import(/* webpackChunkName: "customer" */ '../views/pages/contract/index.vue'),
            name: 'contract',
          },
        ]
      },
      {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue'),
      },
    ],
  }
);

export default router;