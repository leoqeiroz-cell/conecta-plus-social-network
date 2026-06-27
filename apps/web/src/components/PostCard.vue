<script setup lang="ts">
import { Heart, MessageCircle, Send } from "lucide-vue-next";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref } from "vue";
import type { Post } from "@/types";

const props = defineProps<{ post: Post; liked: boolean }>();
const emit = defineEmits<{ like: [id: string]; comment: [id: string, content: string] }>();
const content = ref("");

function submitComment() {
  if (!content.value.trim()) return;
  emit("comment", props.post.id, content.value);
  content.value = "";
}
</script>

<template>
  <article class="surface rounded-md p-5">
    <header class="mb-4 flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <Avatar :label="post.author.name.slice(0, 1)" shape="circle" class="bg-teal-700 text-white" />
        <div>
          <p class="font-bold">{{ post.author.name }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ post.author.course }} · {{ post.author.points }} pts</p>
        </div>
      </div>
      <span class="chip">{{ post.category.toLowerCase() }}</span>
    </header>

    <h2 class="text-xl font-black leading-tight">{{ post.title }}</h2>
    <p class="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">{{ post.content }}</p>

    <div class="mt-4 flex flex-wrap gap-2">
      <span v-for="item in post.tags" :key="item.tag.id" class="chip">#{{ item.tag.name }}</span>
    </div>

    <footer class="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
      <Button size="small" :severity="liked ? 'danger' : 'secondary'" outlined @click="emit('like', post.id)">
        <Heart :size="16" :fill="liked ? 'currentColor' : 'none'" />
        <span>{{ post.likes.length }}</span>
      </Button>
      <span class="inline-flex items-center gap-1 text-sm text-slate-500">
        <MessageCircle :size="16" /> {{ post.comments.length }} comentarios
      </span>
    </footer>

    <div class="mt-4 space-y-3">
      <div v-for="comment in post.comments.slice(-2)" :key="comment.id" class="rounded-md bg-slate-50 p-3 dark:bg-slate-800">
        <p class="text-sm font-semibold">{{ comment.author.name }}</p>
        <p class="text-sm text-slate-600 dark:text-slate-300">{{ comment.content }}</p>
      </div>

      <form class="flex gap-2" @submit.prevent="submitComment">
        <InputText v-model="content" class="min-w-0 flex-1" placeholder="Adicionar comentario" />
        <Button type="submit" aria-label="Comentar">
          <Send :size="16" />
        </Button>
      </form>
    </div>
  </article>
</template>
