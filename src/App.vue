<template>
  <div id="app">
    <main>
      <router-view></router-view>
    </main>

    <footer></footer>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  methods: {
    handleClick() {
      console.log("Button clicked");
    },
  },
};
</script>

<style></style>
