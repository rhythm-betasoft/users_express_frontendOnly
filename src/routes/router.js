import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '@/store/authStore';
import { toast } from 'vue3-toastify';
import { defineAsyncComponent } from 'vue';
import 'vue3-toastify/dist/index.css';
import { roles } from '@/enums/roles';
const Register = defineAsyncComponent(() => import('@/views/Register.vue'));
const Profile = defineAsyncComponent(() => import('@/views/Profile.vue'));
const UserList = defineAsyncComponent(() => import('@/views/UserList.vue'));
const TwoFA = defineAsyncComponent(() => import('@/views/TwoFA.vue'));
const AnnouncementList = defineAsyncComponent(() => import('@/views/AnnouncementList.vue'));
const routes = [
  { name: 'register', path: '/', component: Register },
  {
    name: 'profile',
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    name: 'user-list',
    path: '/users',
    component: UserList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },                
  {
    name:'two-fa',
    path:'/two-fa',
    component:TwoFA           
  },
  {
    name:'announcements',
    path:'/announcements',
    component:AnnouncementList
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const store = authStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.isLoggedIn()) {
      toast.error('You must be logged in to access this page.', { autoClose: 3000 });
      return next({ name: 'Register' });
    }
    store.userRole(); 
    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      if (store.user?.role !== roles.ADMIN) {
        toast.error('Only admins can access this page.', { autoClose: 3000 });
        return next({ name: 'profile' }); 
      }
    }
    next();
  } 
  else {
    next();
  }
});
export default router;