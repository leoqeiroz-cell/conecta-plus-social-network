<script setup lang="ts">
import { BarChart3, BookOpen, LogOut, Moon, Network, Sun, UsersRound, UserRound } from "lucide-vue-next";
import Button from "primevue/button";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const auth = useAuthStore();
const theme = useThemeStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push({ name: "auth" });
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-ink dark:bg-slate-950 dark:text-slate-100">
    <aside
      class="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 lg:block"
    >
      <div class="mb-8 flex items-center gap-3">
        <div class="grid h-10 w-10 place-items-center rounded-md bg-teal-700 text-white">
          <Network :size="22" />
        </div>
        <div>
          <p class="text-lg font-black">Conecta+</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Comunidade academica</p>
        </div>
      </div>

      <nav class="space-y-1">
        <RouterLink class="nav-link" to="/">
          <BookOpen :size="18" /> Feed
        </RouterLink>
        <RouterLink class="nav-link" to="/grupos">
          <UsersRound :size="18" /> Grupos
        </RouterLink>
        <RouterLink class="nav-link" to="/perfil">
          <UserRound :size="18" /> Perfil
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" class="nav-link" to="/admin">
          <BarChart3 :size="18" /> Admin
        </RouterLink>
        <RouterLink class="nav-link" to="/sobre">
          <Network :size="18" /> Impacto
        </RouterLink>
      </nav>
    </aside>

    <main class="lg:pl-64">
      <header
        class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6"
      >
        <div class="min-w-0">
          <p class="truncate text-sm text-slate-500 dark:text-slate-400">
            {{ auth.user ? `Ola, ${auth.user.name}` : "Rede social de apoio academico" }}
          </p>
          <h1 class="truncate text-base font-bold sm:text-lg">Conecta+ Social Network</h1>
        </div>

        <div class="flex items-center gap-2">
          <Button
            text
            rounded
            severity="secondary"
            :aria-label="theme.dark ? 'Ativar tema claro' : 'Ativar tema escuro'"
            @click="theme.toggle"
          >
            <Moon v-if="!theme.dark" :size="19" />
            <Sun v-else :size="19" />
          </Button>
          <Button v-if="auth.isAuthenticated" text rounded severity="secondary" aria-label="Sair" @click="logout">
            <LogOut :size="19" />
          </Button>
        </div>
      </header>

      <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <RouterView />
      </section>
    </main>

    <nav
      class="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white px-2 py-2 dark:border-slate-800 dark:bg-slate-900 lg:hidden"
    >
      <RouterLink class="nav-link justify-center px-2" to="/"><BookOpen :size="18" /></RouterLink>
      <RouterLink class="nav-link justify-center px-2" to="/grupos"><UsersRound :size="18" /></RouterLink>
      <RouterLink class="nav-link justify-center px-2" to="/perfil"><UserRound :size="18" /></RouterLink>
      <RouterLink class="nav-link justify-center px-2" to="/admin"><BarChart3 :size="18" /></RouterLink>
      <RouterLink class="nav-link justify-center px-2" to="/sobre"><Network :size="18" /></RouterLink>
    </nav>
  </div>
</template>
