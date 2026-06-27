<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const login = reactive({ email: "admin@conectamais.edu", password: "Conecta@123" });
const register = reactive({ name: "", email: "", password: "", course: "", bio: "" });

async function run(action: "login" | "register") {
  loading.value = true;
  try {
    if (action === "login") await auth.login(login.email, login.password);
    else await auth.register(register);
    router.push({ name: "feed" });
  } catch {
    toast.add({ severity: "error", summary: "Nao foi possivel autenticar", life: 3000 });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="grid min-h-[calc(100vh-8rem)] items-center gap-8 lg:grid-cols-[1fr_420px]">
    <section>
      <span class="chip mb-4 border-teal-200 text-teal-700 dark:border-teal-700 dark:text-teal-200">Conecta+</span>
      <h1 class="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
        Uma comunidade academica para aprender, compartilhar e crescer junto.
      </h1>
      <p class="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
        Centralize duvidas, projetos, conquistas, materiais e grupos de estudo em uma experiencia simples, responsiva e preparada para apresentacao.
      </p>
      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div class="surface rounded-md p-4">
          <p class="text-2xl font-black text-teal-700">JWT</p>
          <p class="text-sm text-slate-500">Rotas protegidas</p>
        </div>
        <div class="surface rounded-md p-4">
          <p class="text-2xl font-black text-coral">+pts</p>
          <p class="text-sm text-slate-500">Ranking colaborativo</p>
        </div>
        <div class="surface rounded-md p-4">
          <p class="text-2xl font-black text-grape">API</p>
          <p class="text-sm text-slate-500">Swagger e Prisma</p>
        </div>
      </div>
    </section>

    <section class="surface rounded-md p-5">
      <TabView>
        <TabPanel header="Entrar" value="0">
          <form class="grid gap-3" @submit.prevent="run('login')">
            <InputText v-model="login.email" type="email" placeholder="E-mail" />
            <Password v-model="login.password" toggle-mask :feedback="false" placeholder="Senha" />
            <Button type="submit" label="Entrar" :loading="loading" />
          </form>
        </TabPanel>
        <TabPanel header="Cadastrar" value="1">
          <form class="grid gap-3" @submit.prevent="run('register')">
            <InputText v-model="register.name" placeholder="Nome" />
            <InputText v-model="register.email" type="email" placeholder="E-mail" />
            <Password v-model="register.password" toggle-mask placeholder="Senha" />
            <InputText v-model="register.course" placeholder="Curso" />
            <InputText v-model="register.bio" placeholder="Bio curta" />
            <Button type="submit" label="Criar conta" :loading="loading" />
          </form>
        </TabPanel>
      </TabView>
    </section>
  </div>
</template>
