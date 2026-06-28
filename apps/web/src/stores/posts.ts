import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "@/services/api";
import type { Post, PostCategory } from "@/types";

export const usePostStore = defineStore("posts", () => {
  const posts = ref<Post[]>([]);
  const loading = ref(false);

  async function fetchPosts(filters: { search?: string; category?: PostCategory | ""; tag?: string } = {}) {
    loading.value = true;
    try {
      const { data } = await api.get<Post[]>("/posts", { params: filters });
      posts.value = data;
    } finally {
      loading.value = false;
    }
  }

  async function createPost(input: { title: string; content: string; category: PostCategory; tags: string[] }) {
    await api.post("/posts", input);
    await fetchPosts();
  }

  async function updatePost(postId: string, input: { title: string; content: string; category: PostCategory; tags: string[] }) {
    await api.put(`/posts/${postId}`, input);
    await fetchPosts();
  }

  async function deletePost(postId: string) {
    await api.delete(`/posts/${postId}`);
    await fetchPosts();
  }

  async function like(postId: string) {
    await api.post(`/posts/${postId}/like`);
    await fetchPosts();
  }

  async function comment(postId: string, content: string) {
    await api.post(`/posts/${postId}/comments`, { content });
    await fetchPosts();
  }

  async function updateComment(commentId: string, content: string) {
    await api.put(`/posts/comments/${commentId}`, { content });
    await fetchPosts();
  }

  async function deleteComment(commentId: string) {
    await api.delete(`/posts/comments/${commentId}`);
    await fetchPosts();
  }

  return { posts, loading, fetchPosts, createPost, updatePost, deletePost, like, comment, updateComment, deleteComment };
});
