import "./styles.css";
import "primeicons/primeicons.css";

import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "@/App.vue";
import { router } from "@/router";

createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: ".dark"
      }
    }
  })
  .use(ToastService)
  .mount("#app");
