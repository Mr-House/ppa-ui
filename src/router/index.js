import { createRouter, createWebHistory } from 'vue-router'

const routerHistory = createWebHistory()

const router = createRouter({
    history: routerHistory,
    routes: [
        { path: '/', redirect: '/home' }
    ]
})

export default router