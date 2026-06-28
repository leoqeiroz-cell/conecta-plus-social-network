<script setup lang="ts">
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import ProgressSpinner from "primevue/progressspinner";
import { Search } from "lucide-vue-next";
import { computed, onMounted, reactive } from "vue";
import CreatePost from "@/components/CreatePost.vue";
import PostCard from "@/components/PostCard.vue";
import { useAuthStore } from "@/stores/auth";
import { usePostStore } from "@/stores/posts";
import type { PostCategory } from "@/types";

const auth = useAuthStore();
const posts = usePostStore();
const filters = reactive<{ search: string; category: PostCategory | "" }>({ search: "", category: "" });
const categories = [
  { label: "Todas", value: "" },
  { label: "Estudos", value: "ESTUDOS" },
  { label: "Projetos", value: "PROJETOS" },
  { label: "Emprego", value: "EMPREGO" },
  { label: "Duvidas", value: "DUVIDAS" }
];

const filteredCount = computed(() => posts.posts.length);

onMounted(() => posts.fetchPosts());
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[1fr_360px]">
    <section class="space-y-5">
      <div class="surface rounded-md p-5">
        <div class="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p class="text-sm font-bold text-teal-700 dark:text-teal-300">Feed inteligente</p>
            <h1 class="text-2xl font-black">Publicacoes da comunidade</h1>
          </div>
          <span class="chip">{{ filteredCount }} resultados</span>
        </div>

        <form class="grid gap-3 md:grid-cols-[1fr_190px_auto]" @submit.prevent="posts.fetchPosts(filters)">
          <span class="relative">
            <Search class="pointer-events-none absolute left-3 top-3 text-slate-400" :size="18" />
            <InputText v-model="filters.search" class="w-full pl-10" placeholder="Buscar por assunto ou pessoa" />
          </span>
          <Dropdown v-model="filters.category" :options="categories" option-label="label" option-value="value" />
          <Button type="submit" label="Filtrar" />
        </form>
      </div>

      <div v-if="posts.loading" class="grid place-items-center py-16">
        <ProgressSpinner />
      </div>

      <PostCard
        v-for="post in posts.posts"
        v-else
        :key="post.id"
        :post="post"
        :liked="post.likes.some((like) => like.authorId === auth.user?.id)"
        :current-user-id="auth.user?.id"
        :is-admin="auth.isAdmin"
        @like="posts.like"
        @comment="posts.comment"
        @update-post="posts.updatePost"
        @delete-post="posts.deletePost"
        @update-comment="posts.updateComment"
        @delete-comment="posts.deleteComment"
      />
    </section>

    <aside class="space-y-5">
      <CreatePost @submit="posts.createPost" />
      <section class="surface rounded-md p-5">
        <p class="text-sm font-bold text-coral">Como ganhar pontos</p>
        <h2 class="mb-3 text-xl font-black">Ranking de colaboracao</h2>
        <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>Publicar conteudo util: +12 pontos</li>
          <li>Comentar ajudando alguem: +4 pontos</li>
          <li>Receber curtida: +2 pontos</li>
          <li>Entrar em grupo de estudo: +3 pontos</li>
        </ul>
      </section>
    </aside>
  </div>
</template>
