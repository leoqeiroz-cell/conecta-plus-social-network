<script setup lang="ts">
import { Check, Heart, MessageCircle, Pencil, Send, Trash2, X } from "lucide-vue-next";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Textarea from "primevue/textarea";
import { computed, reactive, ref, watch } from "vue";
import type { Post, PostCategory } from "@/types";

const props = defineProps<{ post: Post; liked: boolean; currentUserId?: string; isAdmin?: boolean }>();
const emit = defineEmits<{
  like: [id: string];
  comment: [id: string, content: string];
  updatePost: [id: string, input: { title: string; content: string; category: PostCategory; tags: string[] }];
  deletePost: [id: string];
  updateComment: [id: string, content: string];
  deleteComment: [id: string];
}>();

const categories = [
  { label: "Estudos", value: "ESTUDOS" },
  { label: "Projetos", value: "PROJETOS" },
  { label: "Emprego", value: "EMPREGO" },
  { label: "Duvidas", value: "DUVIDAS" }
];
const tagOptions = ["estudos", "projetos", "emprego", "duvidas"];
const content = ref("");
const editingPost = ref(false);
const editingCommentId = ref<string | null>(null);
const commentDraft = ref("");
const postForm = reactive<{ title: string; content: string; category: PostCategory; tags: string[] }>({
  title: props.post.title,
  content: props.post.content,
  category: props.post.category,
  tags: props.post.tags.map((item) => item.tag.name)
});

const canManagePost = computed(() => props.post.author.id === props.currentUserId || Boolean(props.isAdmin));

watch(
  () => props.post,
  (post) => {
    postForm.title = post.title;
    postForm.content = post.content;
    postForm.category = post.category;
    postForm.tags = post.tags.map((item) => item.tag.name);
  }
);

function submitComment() {
  if (!content.value.trim()) return;
  emit("comment", props.post.id, content.value);
  content.value = "";
}

function savePost() {
  emit("updatePost", props.post.id, { ...postForm });
  editingPost.value = false;
}

function removePost() {
  if (confirm("Excluir esta publicacao?")) emit("deletePost", props.post.id);
}

function startCommentEdit(commentId: string, value: string) {
  editingCommentId.value = commentId;
  commentDraft.value = value;
}

function saveComment(commentId: string) {
  if (!commentDraft.value.trim()) return;
  emit("updateComment", commentId, commentDraft.value);
  editingCommentId.value = null;
  commentDraft.value = "";
}

function removeComment(commentId: string) {
  if (confirm("Excluir este comentario?")) emit("deleteComment", commentId);
}
</script>

<template>
  <article class="surface rounded-md p-5">
    <header class="mb-4 flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <Avatar v-if="post.author.avatarUrl" :image="post.author.avatarUrl" shape="circle" class="bg-teal-700 text-white" />
        <Avatar v-else :label="post.author.name.slice(0, 1)" shape="circle" class="bg-teal-700 text-white" />
        <div>
          <p class="font-bold">{{ post.author.name }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ post.author.course }} - {{ post.author.points }} pts</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="chip">{{ post.category.toLowerCase() }}</span>
        <Button v-if="canManagePost && !editingPost" size="small" text rounded title="Editar publicacao" @click="editingPost = true">
          <Pencil :size="16" />
        </Button>
        <Button v-if="canManagePost && !editingPost" size="small" severity="danger" text rounded title="Excluir publicacao" @click="removePost">
          <Trash2 :size="16" />
        </Button>
      </div>
    </header>

    <form v-if="editingPost" class="grid gap-3" @submit.prevent="savePost">
      <InputText v-model="postForm.title" required placeholder="Titulo objetivo" />
      <Textarea v-model="postForm.content" required auto-resize rows="4" placeholder="Conteudo da publicacao" />
      <div class="grid gap-3 sm:grid-cols-2">
        <Dropdown v-model="postForm.category" :options="categories" option-label="label" option-value="value" />
        <MultiSelect v-model="postForm.tags" :options="tagOptions" display="chip" />
      </div>
      <div class="flex gap-2">
        <Button type="submit" size="small" label="Salvar">
          <Check :size="16" />
        </Button>
        <Button type="button" size="small" severity="secondary" outlined label="Cancelar" @click="editingPost = false">
          <X :size="16" />
        </Button>
      </div>
    </form>

    <template v-else>
      <h2 class="text-xl font-black leading-tight">{{ post.title }}</h2>
      <p class="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">{{ post.content }}</p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span v-for="item in post.tags" :key="item.tag.id" class="chip">#{{ item.tag.name }}</span>
      </div>
    </template>

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
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">{{ comment.author.name }}</p>
            <form v-if="editingCommentId === comment.id" class="mt-2 flex gap-2" @submit.prevent="saveComment(comment.id)">
              <InputText v-model="commentDraft" class="min-w-0 flex-1" />
              <Button type="submit" size="small" aria-label="Salvar comentario">
                <Check :size="15" />
              </Button>
              <Button type="button" size="small" severity="secondary" outlined aria-label="Cancelar edicao" @click="editingCommentId = null">
                <X :size="15" />
              </Button>
            </form>
            <p v-else class="text-sm text-slate-600 dark:text-slate-300">{{ comment.content }}</p>
          </div>
          <div v-if="comment.author.id === currentUserId || isAdmin" class="flex shrink-0 gap-1">
            <Button size="small" text rounded title="Editar comentario" @click="startCommentEdit(comment.id, comment.content)">
              <Pencil :size="15" />
            </Button>
            <Button size="small" severity="danger" text rounded title="Excluir comentario" @click="removeComment(comment.id)">
              <Trash2 :size="15" />
            </Button>
          </div>
        </div>
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
