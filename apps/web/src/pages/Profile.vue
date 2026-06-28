<script setup lang="ts">
import { Camera, RotateCcw, Save } from "lucide-vue-next";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { useToast } from "primevue/usetoast";
import { computed, reactive, watch } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const toast = useToast();

const form = reactive({
  name: "",
  course: "",
  bio: "",
  avatarUrl: null as string | null
});

const avatarOptions = [
  makeAvatar("#0f766e", "#ccfbf1", "LQ"),
  makeAvatar("#7c3aed", "#ede9fe", "LQ"),
  makeAvatar("#ea580c", "#ffedd5", "LQ"),
  makeAvatar("#0f172a", "#e2e8f0", "LQ")
];

const previewLabel = computed(() => form.name.trim().slice(0, 1) || "U");

watch(
  () => auth.user,
  (user) => {
    if (!user) return;
    form.name = user.name;
    form.course = user.course;
    form.bio = user.bio ?? "";
    form.avatarUrl = user.avatarUrl;
  },
  { immediate: true }
);

function makeAvatar(background: string, foreground: string, initials: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="${background}"/><circle cx="88" cy="28" r="18" fill="${foreground}" opacity=".24"/><circle cx="28" cy="92" r="20" fill="${foreground}" opacity=".18"/><text x="60" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="${foreground}">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function resetForm() {
  if (!auth.user) return;
  form.name = auth.user.name;
  form.course = auth.user.course;
  form.bio = auth.user.bio ?? "";
  form.avatarUrl = auth.user.avatarUrl;
}

async function saveProfile() {
  try {
    await auth.updateProfile({ ...form });
    toast.add({ severity: "success", summary: "Perfil atualizado", life: 2500 });
  } catch {
    toast.add({ severity: "error", summary: "Nao foi possivel atualizar o perfil", life: 3000 });
  }
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > 180000) {
    toast.add({ severity: "warn", summary: "Escolha uma imagem menor", detail: "Use uma foto de ate 180 KB.", life: 3500 });
    input.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    form.avatarUrl = String(reader.result);
  };
  reader.readAsDataURL(file);
}
</script>

<template>
  <section v-if="auth.user" class="grid gap-6 lg:grid-cols-[360px_1fr]">
    <article class="surface rounded-md p-6">
      <Avatar
        v-if="form.avatarUrl"
        :image="form.avatarUrl"
        shape="circle"
        class="mb-4 bg-teal-700 text-3xl text-white"
        size="xlarge"
      />
      <Avatar v-else :label="previewLabel" shape="circle" class="mb-4 bg-teal-700 text-3xl text-white" size="xlarge" />
      <h1 class="text-2xl font-black">{{ auth.user.name }}</h1>
      <p class="break-all text-slate-500 dark:text-slate-400">{{ auth.user.email }}</p>
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
      <div class="mb-5">
        <p class="text-sm font-bold text-coral">Perfil editavel</p>
        <h2 class="text-2xl font-black">Dados da comunidade</h2>
      </div>

      <form class="grid gap-4" @submit.prevent="saveProfile">
        <div class="grid gap-3 sm:grid-cols-2">
          <InputText v-model="form.name" required placeholder="Nome completo" />
          <InputText v-model="form.course" required placeholder="Curso ou area" />
        </div>

        <Textarea v-model="form.bio" auto-resize rows="4" maxlength="600" placeholder="Bio academica, interesses e objetivos" />

        <div class="grid gap-3">
          <p class="text-sm font-bold text-slate-600 dark:text-slate-300">Avatar</p>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="avatar in avatarOptions"
              :key="avatar"
              type="button"
              class="rounded-md border border-slate-200 p-1 transition hover:border-teal-500 dark:border-slate-700"
              @click="form.avatarUrl = avatar"
            >
              <Avatar :image="avatar" shape="circle" size="large" />
            </button>
            <Button type="button" severity="secondary" outlined label="Sem foto" @click="form.avatarUrl = null" />
          </div>

          <label class="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-500 dark:border-slate-700 dark:text-slate-200">
            <Camera :size="16" />
            Enviar foto
            <input class="sr-only" type="file" accept="image/*" @change="onFileSelected">
          </label>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button type="submit" label="Salvar perfil">
            <Save :size="16" />
          </Button>
          <Button type="button" severity="secondary" outlined label="Restaurar" @click="resetForm">
            <RotateCcw :size="16" />
          </Button>
        </div>
      </form>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-md bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-2xl font-black">{{ auth.user.points }}</p>
          <p class="text-sm text-slate-500">pontos atuais</p>
        </div>
        <div class="rounded-md bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-2xl font-black">12</p>
          <p class="text-sm text-slate-500">por post util</p>
        </div>
        <div class="rounded-md bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-2xl font-black">4</p>
          <p class="text-sm text-slate-500">por comentario</p>
        </div>
      </div>
    </article>
  </section>
</template>
