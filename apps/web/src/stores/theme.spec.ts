import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { useThemeStore } from "@/stores/theme";

describe("theme store", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    setActivePinia(createPinia());
  });

  it("alterna dark mode e persiste a preferencia", async () => {
    const theme = useThemeStore();

    expect(theme.dark).toBe(false);

    theme.toggle();
    await nextTick();

    expect(theme.dark).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("conecta.theme")).toBe("dark");
  });
});
