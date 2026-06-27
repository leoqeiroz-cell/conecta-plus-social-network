import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const dark = ref(localStorage.getItem("conecta.theme") === "dark");

  watchEffect(() => {
    document.documentElement.classList.toggle("dark", dark.value);
    localStorage.setItem("conecta.theme", dark.value ? "dark" : "light");
  });

  function toggle() {
    dark.value = !dark.value;
  }

  return { dark, toggle };
});
