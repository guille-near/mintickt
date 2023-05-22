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
      connectBtn: false,
      varDialog: false,
      userDc: {},
      resultOperation: undefined,
      account: null
    };
  },
  mounted() {
    this.$refs.modalDiscord.modalDiscord = true
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken] = [fragment.get('access_token'), fragment.get('token_type')];

    if (accessToken) {
      const item = {
        access_token: fragment.get('access_token'),
        token_type: fragment.get('token_type')
      }
      localStorage.setItem('discord_sinc', JSON.stringify(item))
      this.$router.push("/profile")
    }

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

          console.log(avatar)

          this.connectDiscord()
        })
        .catch(console.error);
      } else {
        this.connectRamper()
      }
    }
  },
  methods: {
    connectDiscord () {
      console.log("ENTRO")
      // this.connectBtn = true
      const accountId = this.$ramper.getAccountId()

      axios.post(process.env.VUE_APP_BOTDISCORD_URL + "/api/bot-discord/", { "wallet": accountId, "discordId": this.userDc.id })
        .then(result => {
          console.log("SUCCESS")
          localStorage.removeItem('discord_sinc')
        }).catch(err => {
          console.log("ERROR")
          console.error(err);
          localStorage.removeItem('discord_sinc')
        })
    },
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
