<script setup lang="ts">
import Avatar from "primevue/avatar";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>

<template>
  <section v-if="auth.user" class="grid gap-6 lg:grid-cols-[360px_1fr]">
    <article class="surface rounded-md p-6">
      <Avatar :label="auth.user.name.slice(0, 1)" shape="circle" class="mb-4 bg-teal-700 text-3xl text-white" size="xlarge" />
      <h1 class="text-2xl font-black">{{ auth.user.name }}</h1>
      <p class="text-slate-500 dark:text-slate-400">{{ auth.user.email }}</p>
      <div class="mt-5 space-y-3">
        <div>
          <p class="text-xs font-bold uppercase text-slate-400">Curso</p>
          <p>{{ auth.user.course }}</p>
        </div>
        <div>
          <p class="text-xs font-bold uppercase text-slate-400">Bio</p>
          <p>{{ auth.user.bio || "Sem bio cadastrada." }}</p>
        </div>
      </div>
    </article>

    <article class="surface rounded-md p-6">
      <p class="text-sm font-bold text-coral">Performance comunitaria</p>
      <h2 class="text-2xl font-black">{{ auth.user.points }} pontos</h2>
      <div class="mt-5 grid gap-4 sm:grid-cols-3">
        <div class="rounded-md bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-2xl font-black">12</p>
          <p class="text-sm text-slate-500">por post util</p>
        </div>
        <div class="rounded-md bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-2xl font-black">4</p>
          <p class="text-sm text-slate-500">por comentario</p>
        </div>
        <div class="rounded-md bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-2xl font-black">3</p>
          <p class="text-sm text-slate-500">por grupo</p>
        </div>
      </div>
    </article>
  </section>
</template>
