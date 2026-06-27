<script setup lang="ts">
import { UsersRound } from "lucide-vue-next";
import Button from "primevue/button";
import { onMounted, ref } from "vue";
import { api } from "@/services/api";
import type { StudyGroup } from "@/types";

const groups = ref<StudyGroup[]>([]);

async function load() {
  const { data } = await api.get<StudyGroup[]>("/groups");
  groups.value = data;
}

async function toggle(groupId: string) {
  await api.post(`/groups/${groupId}/join`);
  await load();
}

onMounted(load);
</script>

<template>
  <div>
    <header class="mb-6">
      <p class="text-sm font-bold text-teal-700 dark:text-teal-300">Modo comunidade</p>
      <h1 class="text-3xl font-black">Grupos de estudo</h1>
      <p class="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
        Encontre pessoas com objetivos parecidos e organize praticas, revisoes e projetos colaborativos.
      </p>
    </header>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="group in groups" :key="group.id" class="surface rounded-md p-5">
        <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200">
          <UsersRound :size="22" />
        </div>
        <h2 class="text-xl font-black">{{ group.name }}</h2>
        <p class="mt-2 min-h-16 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ group.description }}</p>
        <div class="mt-4 flex items-center justify-between">
          <span class="chip">{{ group.membersCount }} membros</span>
          <Button size="small" :label="group.isMember ? 'Sair' : 'Participar'" @click="toggle(group.id)" />
        </div>
      </article>
    </section>
  </div>
</template>
