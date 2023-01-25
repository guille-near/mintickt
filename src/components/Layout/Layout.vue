<template>
  <v-app class="layout relative">
    <Header v-if="renderHeader" style="z-index: 10" ref="header" />
    <v-main
      class="content"
      :class="{events: $router.currentRoute.path.includes('events')}"
      style="overflow: hidden"
    >
      <router-view @renderHeader="RenderHeader"></router-view>
    </v-main>
    <!-- <Footer /> -->
  </v-app>
</template>

<script>
import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";
import "./layout.scss";
export default {
  name: "Layout",
  components: { Header },
  data() {
    return {
      renderHeader: true,
    };
  },
  watch: {
    $route(curr) {
      if (curr.path === "/events/register" && window.innerHeight >= 940) document.body.style.overflow = "hidden"
    }
  },
  methods: {
    RenderHeader() {
      this.renderHeader = false;
      setTimeout(() => {
        this.renderHeader = true;
      }, 200);
    },
  },
};
</script>

<style src="./layout.scss" lang="scss" />
