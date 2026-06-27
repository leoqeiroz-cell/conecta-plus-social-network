<script setup lang="ts">
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Textarea from "primevue/textarea";
import { reactive } from "vue";
import type { PostCategory } from "@/types";

const emit = defineEmits<{ submit: [input: { title: string; content: string; category: PostCategory; tags: string[] }] }>();

const categories = [
  { label: "Estudos", value: "ESTUDOS" },
  { label: "Projetos", value: "PROJETOS" },
  { label: "Emprego", value: "EMPREGO" },
  { label: "Duvidas", value: "DUVIDAS" }
];

const tags = ["estudos", "projetos", "emprego", "duvidas"];
const form = reactive<{ title: string; content: string; category: PostCategory; tags: string[] }>({
  title: "",
  content: "",
  category: "ESTUDOS",
  tags: ["estudos"]
});

function submit() {
  emit("submit", { ...form });
  form.title = "";
  form.content = "";
  form.category = "ESTUDOS";
  form.tags = ["estudos"];
}
</script>

<template>
  <form class="surface rounded-md p-5" @submit.prevent="submit">
    <div class="mb-4">
      <p class="text-sm font-bold text-teal-700 dark:text-teal-300">Compartilhe com a comunidade</p>
      <h2 class="text-xl font-black">Nova publicacao</h2>
    </div>
    <div class="grid gap-3">
      <InputText v-model="form.title" required placeholder="Titulo objetivo" />
      <Textarea v-model="form.content" required auto-resize rows="4" placeholder="Conteudo, contexto e pedido de ajuda" />
      <div class="grid gap-3 sm:grid-cols-2">
        <Dropdown v-model="form.category" :options="categories" option-label="label" option-value="value" />
        <MultiSelect v-model="form.tags" :options="tags" display="chip" />
      </div>
      <Button type="submit" label="Publicar" />
    </div>
  </form>
</template>
