import { createRouter, createWebHistory } from "vue-router";
import { authStore } from "@/store/authStore";
import { toast } from "vue3-toastify";
import { defineAsyncComponent } from "vue";
import "vue3-toastify/dist/index.css";
import { roles } from "@/enums/roles";

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
    meta: { requireAuth: true, requireAdmin: true },
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
  )
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
  import('@/views/LeaveDashboard.vue'))
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
  } else {
    next();
  }
});

export default router;
