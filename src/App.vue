<template>
  <div id="app">
    <div id="map"></div>
  </div>
</template>

<script>
import Vue from "vue";
import init from "@/init";

export default Vue.extend({
  data() {
    return {
      text: "Hello world",
    };
  },
  mounted() {
    init("map");
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#map {
  width: 100%;
  height: 100%;
  min-width: 400px;
  min-height: 350px;
}
</style>
