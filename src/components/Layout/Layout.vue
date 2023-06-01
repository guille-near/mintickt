<template>
  <v-app class="layout relative">
    <ModalDiscord ref="modalDiscord"></ModalDiscord>
    <Header v-if="renderHeader" style="z-index: 10" ref="header" />
    <v-main
      class="content"
      :class="{
        events: $router.currentRoute.path.includes('events') || $router.currentRoute.path.includes('profile'),
        landing: $router.currentRoute.name == 'Landing'
      }"
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
import axios from "axios"
// import Footer from "@/components/Layout/Footer";
import "./layout.scss";
export default {
  name: "Layout",
  components: { Header, ModalDiscord },
  data() {
    return {
      renderHeader: true,
      connectBtn: false,
      varDialog: false,
      userDc: {},
      resultOperation: undefined,
      account: null
    };
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('discord_sinc'))) {
      if (this.$ramper.getUser()) {
        const itemDiscord = JSON.parse(localStorage.getItem('discord_sinc'))
        fetch('https://discord.com/api/users/@me', {
          headers: {
            authorization: `${itemDiscord.token_type} ${itemDiscord.access_token}`,
          },
        })
        .then(result => result.json())
        .then(response => {
          console.log(response)
          let avatar
          if (response.avatar) {
            avatar = `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.png`
          }

          this.userDc = response

          console.log(response)

          this.$refs.modalDiscord.userDc = response
          this.$refs.modalDiscord.avatar = avatar || require("../../assets/profile/user.svg")

          this.$refs.modalDiscord.modalDiscord = true
        })
        .catch(console.error);
      } else {
        this.connectRamper()
      }
    }
  },
  methods: {
    async connectRamper() {
      const login = await this.$ramper.signIn()
      console.log(login)
      if (login && login.user) // location.reload();

      // setTimeout(() => location.reload(), 200)
      this.$router.push("/");
    },
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
