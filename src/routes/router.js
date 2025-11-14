import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '../store/authStore';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';
import EntireData from '../views/EntireData.vue';
import { toast } from 'vue3-toastify';
import SpendDetails from '../views/SpendDetails.vue'
import 'vue3-toastify/dist/index.css';
import TwoFA from '../views/TwoFA.vue'
import Announcement from '../views/Announcement.vue'
const routes = [
  { name: 'Register', path: '/', component: Register },
  {
    name: 'Profile',
    path: '/Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    name: 'EntireData',
    path: '/EntireData',
    component: EntireData,
    meta: { requiresAuth: true, requiresAdmin: true },
  },                
  {
    name:'SpendDetails',
    path:'/SpendDetails',
    component:SpendDetails
  },
  {
    name:'TwoFA',
    path:'/TwoFA',
    component:TwoFA           
  },
  {
    name:'Announcement',
    path:'/Announcement',
    component:Announcement
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
      if (store.user?.role !== 'admin') {
        toast.error('Only admins can access this page.', { autoClose: 3000 });
        return next({ name: 'Profile' }); 
      }
    }
    next();
  } 
  else {
    next();
  }
});

export default router;
