<template>
  <Header />
  <router-view />
  <Footer />
</template>

<script setup>
import Header from "./components/layout/Header.vue";
</script>

<style lang="scss">
body {
  background-color: #5d7c71;
  font-family: "Noto Sans TC", serif;
  color: #dfe8e4;
  font-size: 16px;
}
</style>
