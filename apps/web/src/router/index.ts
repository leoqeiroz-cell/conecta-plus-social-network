import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Admin from "@/pages/Admin.vue";
import Auth from "@/pages/Auth.vue";
import Feed from "@/pages/Feed.vue";
import Groups from "@/pages/Groups.vue";
import Profile from "@/pages/Profile.vue";
import About from "@/pages/About.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "feed", component: Feed, meta: { requiresAuth: true } },
    { path: "/entrar", name: "auth", component: Auth },
    { path: "/grupos", name: "groups", component: Groups, meta: { requiresAuth: true } },
    { path: "/perfil", name: "profile", component: Profile, meta: { requiresAuth: true } },
    { path: "/admin", name: "admin", component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: "/sobre", name: "about", component: About }
  ]
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: "auth" };
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: "feed" };
});
