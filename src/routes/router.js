import { createRouter, createWebHistory } from "vue-router";
import { authStore } from "@/store/authStore";
import { toast } from "vue3-toastify";
import { defineAsyncComponent } from "vue";
import "vue3-toastify/dist/index.css";
import { roles } from "@/enums/roles";
import {PERMISSIONS} from '@/enums/Permissions'
const routes = [
  {
    name: "register",
    path: "/",
    component: defineAsyncComponent(() => import("@/views/Register.vue")),
  },
  {
    name: "profile",
    path: "/profile",
    component: defineAsyncComponent(() => import("@/views/Profile.vue")),
    meta: { requireAuth: true },
  },
  {
    name: "user-list",
    path: "/users",
    component: defineAsyncComponent(() => import("@/views/UserList.vue")),
    meta: { requireAuth: true, requireAdmin: true,permissions:[PERMISSIONS.USER] },
    
  },
  {
    name: "announcements",
    path: "/announcements",
    component: defineAsyncComponent(() =>
      import("@/views/AnnouncementList.vue")
    ),
  },  
  {
  name: "announcement-grid",
  path: "/announcements/grid",
  component: defineAsyncComponent(() =>
    import("@/views/AnnouncementGrid.vue")
  ),
  meta:{permissions: [PERMISSIONS.ANNOUNCEMENT]}
},
{
  name:"dashboard",
  path:"/dashboard",
  component:defineAsyncComponent(()=>
  import("@/views/DashboardView.vue")
)
},
{
  name:"LeaveView",
  path:'/employee/leaves',
  component:defineAsyncComponent(()=>
  import("@/views/LeaveView.vue"))
},
{
  name:"LeaveDashboard",
  path:'/admin/leaves',
  component:defineAsyncComponent(()=>
  import('@/views/LeaveDashboard.vue')),
  meta:{permissions: [PERMISSIONS.LEAVE]}
},
{
  name:"AttendanceMarking",
  path:'/attendance/marking',
  component:defineAsyncComponent(()=>
  import('@/views/AttendanceMarking.vue'))
}
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const store = authStore();
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!store.isLoggedIn()) {
      toast.error("You must be logged in to access this page.", {
        autoClose: 3000,
      });
      return next({ name: "register" });
    }
    if (to.matched.some((record) => record.meta.requireAdmin)) {
      if (store.user.role !== roles.ADMIN) {
        toast.error("Only admins can access this page.", { autoClose: 3000 });
        return next({ name: "profile" });
      }
    }
    next();
  }
  if (to.meta.permissions && Array.isArray(to.meta.permissions)) {
    const userPermissions =store.user.permissions||[]
    const hasPermission = to.meta.permissions.some(p =>
      userPermissions.includes(p)
    )
    if (!hasPermission) {
      toast.error("No permission",{autoclose:2000})
      return next({ name: 'profile' })
    }
    next()
  }
  else {
    next();
  }
    return true
});

export default router;
