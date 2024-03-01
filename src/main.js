import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/routes.ts";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const app = createApp(App);
app.use(router);
app.mount("#app");
