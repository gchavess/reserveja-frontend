<template>
  <div id="app">
    <main>
      <router-view></router-view>
    </main>

    <footer></footer>
  </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.css";

export default {
  name: "App",
  components: {},
  methods: {},
};
</script>

<style>
@import "@/assets/styles/input.scss";
@import "@/assets/styles/title.scss";
@import "@/assets/styles/spacing.scss";
@import "@/assets/styles/span.scss";
@import "@/assets/styles/divider.scss";

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #eeeeee;
}

a {
  color: #555555;
  transition: color 0.3s ease;
}

a:hover {
  color: #f4a266;
}

hr {
  color: #555555;
}
</style>
