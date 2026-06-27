<script setup lang="ts">
import { BarChart3, FileText, UsersRound } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { api } from "@/services/api";
import type { Post, User } from "@/types";

type Metrics = {
  users: number;
  posts: number;
  groups: number;
  admins: number;
  leaderboard: User[];
  recentPosts: Post[];
};

const metrics = ref<Metrics | null>(null);

onMounted(async () => {
  const { data } = await api.get<Metrics>("/admin/metrics");
  metrics.value = data;
});
</script>

<template>
  <div v-if="metrics" class="space-y-6">
    <header>
      <p class="text-sm font-bold text-teal-700 dark:text-teal-300">Painel administrativo</p>
      <h1 class="text-3xl font-black">Saude da comunidade</h1>
    </header>

    <section class="grid gap-4 md:grid-cols-3">
      <div class="surface rounded-md p-5">
        <UsersRound class="mb-3 text-teal-700" :size="24" />
        <p class="text-3xl font-black">{{ metrics.users }}</p>
        <p class="text-sm text-slate-500">usuarios cadastrados</p>
      </div>
      <div class="surface rounded-md p-5">
        <FileText class="mb-3 text-coral" :size="24" />
        <p class="text-3xl font-black">{{ metrics.posts }}</p>
        <p class="text-sm text-slate-500">publicacoes</p>
      </div>
      <div class="surface rounded-md p-5">
        <BarChart3 class="mb-3 text-grape" :size="24" />
        <p class="text-3xl font-black">{{ metrics.groups }}</p>
        <p class="text-sm text-slate-500">grupos ativos</p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <article class="surface rounded-md p-5">
        <h2 class="mb-4 text-xl font-black">Ranking</h2>
        <div v-for="user in metrics.leaderboard" :key="user.id" class="flex items-center justify-between border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
          <span>{{ user.name }}</span>
          <strong>{{ user.points }} pts</strong>
        </div>
      </article>

      <article class="surface rounded-md p-5">
        <h2 class="mb-4 text-xl font-black">Posts recentes</h2>
        <div v-for="post in metrics.recentPosts" :key="post.id" class="border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
          <p class="font-semibold">{{ post.title }}</p>
          <p class="text-sm text-slate-500">{{ post.author.name }} · {{ post.likes.length }} curtidas</p>
        </div>
      </article>
    </section>
  </div>
</template>
