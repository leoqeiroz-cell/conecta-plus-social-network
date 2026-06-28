import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CreatePost from "@/components/CreatePost.vue";

const stubs = {
  InputText: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
  },
  Textarea: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `<textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
  },
  Dropdown: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `<select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)"><option value="PROJETOS">Projetos</option></select>`
  },
  MultiSelect: {
    props: ["modelValue"],
    template: `<div data-test="tags">{{ modelValue.join(',') }}</div>`
  },
  Button: {
    template: `<button type="submit"><slot />Publicar</button>`
  }
};

describe("CreatePost", () => {
  it("emite dados de uma nova publicacao", async () => {
    const wrapper = mount(CreatePost, {
      global: { stubs }
    });

    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Projeto de estudos comunitario");
    await wrapper.find("textarea").setValue("Conteudo suficiente para criar uma publicacao de teste.");
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted("submit")?.[0]).toEqual([
      {
        title: "Projeto de estudos comunitario",
        content: "Conteudo suficiente para criar uma publicacao de teste.",
        category: "ESTUDOS",
        tags: ["estudos"]
      }
    ]);
  });
});
