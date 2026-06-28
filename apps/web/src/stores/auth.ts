import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { api } from "@/services/api";
import type { User } from "@/types";

type AuthPayload = {
  token: string;
  user: User;
};

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("conecta.token"));
  const user = ref<User | null>(JSON.parse(localStorage.getItem("conecta.user") ?? "null"));
  const isAuthenticated = computed(() => Boolean(token.value && user.value));
  const isAdmin = computed(() => user.value?.role === "ADMIN");

  function persist(payload: AuthPayload) {
    token.value = payload.token;
    user.value = payload.user;
    localStorage.setItem("conecta.token", payload.token);
    localStorage.setItem("conecta.user", JSON.stringify(payload.user));
  }

  async function login(email: string, password: string) {
    const { data } = await api.post<AuthPayload>("/auth/login", { email, password });
    persist(data);
  }

  async function register(input: { name: string; email: string; password: string; course: string; bio?: string }) {
    const { data } = await api.post<AuthPayload>("/auth/register", input);
    persist(data);
  }

  async function refresh() {
    if (!token.value) return;
    const { data } = await api.get<User>("/auth/me");
    user.value = data;
    localStorage.setItem("conecta.user", JSON.stringify(data));
  }

  async function updateProfile(input: { name: string; course: string; bio: string; avatarUrl: string | null }) {
    const { data } = await api.put<User>("/users/me", input);
    user.value = data;
    localStorage.setItem("conecta.user", JSON.stringify(data));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("conecta.token");
    localStorage.removeItem("conecta.user");
  }

  return { token, user, isAuthenticated, isAdmin, login, register, refresh, updateProfile, logout };
});
