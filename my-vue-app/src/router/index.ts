import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '../pages/Home.vue';
import AboutPage from '../pages/About.vue';
import PasswordGate from '../pages/PasswordGate.vue';
import PrivateIndex from '../pages/PrivateIndex.vue';
import Umra from '../pages/Umra.vue';
import Dua from '../pages/Dua.vue';
import Food from '../pages/Food.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/', name: 'HomePage', component: HomePage },
    { path: '/about', name: 'AboutPage', component: AboutPage },
    { 
        path: '/private', 
        name: 'PasswordGate', 
        component: PasswordGate,
        meta: { requiresAuth: false } // Password gate itself doesn't require auth
    },
    { 
        path: '/private/index', 
        name: 'PrivateIndex', 
        component: PrivateIndex,
        meta: { requiresAuth: true, protectedRoute: true }
    },
    { 
        path: '/umra', 
        name: 'Umra', 
        component: Umra,
        meta: { requiresAuth: true, protectedRoute: true }
    },
    { 
        path: '/dua', 
        name: 'Dua', 
        component: Dua,
        meta: { requiresAuth: true, protectedRoute: true }
    },
    { 
        path: '/food', 
        name: 'Food', 
        component: Food,
        meta: { requiresAuth: true, protectedRoute: true }
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
    routes,
});

// Session storage key (must match PasswordGate.vue)
const SESSION_STORAGE_KEY = 'auth_permissions';

// Check if user is authorized for a specific route (client-side)
function isAuthorizedForRoute(route: string): boolean {
    try {
        const authData = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!authData) {
            return false;
        }

        const parsed = JSON.parse(authData);
        if (!parsed.permissions || !Array.isArray(parsed.permissions)) {
            return false;
        }

        // Check if the requested route is in the permissions array
        return parsed.permissions.includes(route);
    } catch (error) {
        console.error('Error checking authorization:', error);
        return false;
    }
}

// Check if user has any permissions (for special routes like /private/index)
function hasAnyPermissions(): boolean {
    try {
        const authData = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!authData) {
            return false;
        }

        const parsed = JSON.parse(authData);
        return parsed.permissions && Array.isArray(parsed.permissions) && parsed.permissions.length > 0;
    } catch (error) {
        return false;
    }
}

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
    // Check if route requires authentication
    if (to.meta.requiresAuth) {
        // Special case: /private/index is accessible if user has any permissions
        if (to.path === '/private/index') {
            if (hasAnyPermissions()) {
                next();
                return;
            }
        } else {
            // For other protected routes, check if the specific route is authorized
            if (isAuthorizedForRoute(to.path)) {
                next();
                return;
            }
        }

        // If client-side check fails, try API (for Vercel deployment)
        try {
            const response = await fetch('/api/check-auth', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authorized) {
                    // User is authorized, allow access
                    next();
                    return;
                }
            }
        } catch (error) {
            // API not available (local dev) or error - fall through to redirect
            console.log('API check failed (expected in local dev):', error);
        }

        // Not authorized, redirect to password gate
        next({ name: 'PasswordGate' });
    } else {
        // Route doesn't require auth, allow access
        next();
    }
});

export default router;
