<template>
  <v-app class="layout relative">
    <ModalDiscord ref="modalDiscord"></ModalDiscord>
    <Header v-if="renderHeader" style="z-index: 10" ref="header" />
    <v-main
      class="content"
      :class="{events: $router.currentRoute.path.includes('events') || $router.currentRoute.path.includes('profile')}"
      style="overflow: hidden"
    >
      <router-view @renderHeader="RenderHeader"></router-view>
    </v-main>
    <!-- <Footer /> -->
  </v-app>
</template>

<script>
import ModalDiscord from "@/components/modals/ModalDiscord.vue";
import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";
import "./layout.scss";
export default {
  name: "Layout",
  components: { Header, ModalDiscord },
  data() {
    return {
      renderHeader: true,
    };
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
