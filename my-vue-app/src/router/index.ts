import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '../pages/Home.vue';
import AboutPage from '../pages/About.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/', name: 'HomePage', component: HomePage },
    { path: '/about', name: 'AboutPage', component: AboutPage },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
    routes,
});

export default router;
