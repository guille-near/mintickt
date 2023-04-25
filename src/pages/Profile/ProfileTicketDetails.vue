<template>
  <div id="profile" class="details">
    <section id="profile-header" :style="`--bg-image: url(${banner})`">
      <div class="container-avatar">
        <img :src="avatar" alt="user img">
      </div>

      <v-btn class="btn-social" v-ripple="false" :href="near_social" target="_blank" text>
        <span style="margin-block">NEAR Social</span>
        <v-icon color="#fff" size="16px">mdi-open-in-new</v-icon>
      </v-btn> 
    </section>

    <section id="profile-content" class="center">
      <div class="container-title">
        <v-btn icon @click="$router.go(-1)">
          <v-icon color="#fff">mdi-arrow-left</v-icon>
        </v-btn>
        <h2 class="title-tabs p">My Tickets / {{"Nearcon"}}</h2>
      </div>

      <article>
        <div class="container-ticket">
          <img src="@/assets/profile/ticket-test.svg" alt="tikcet test">

          <div class="divcol center">
            <span>Terminator (Let me in)</span>
            <span>Burn this NFT so event staff let you in at the venue.</span>
          </div>
        </div>



        <div class="container-btn">
          <v-btn class="btn-bordered">
            <img src="@/assets/profile/transfer.svg" alt="transfer" width="15px" height="15px">
            <span>Transfer</span>
          </v-btn>
          <v-btn class="btn-bordered">
            <img src="@/assets/profile/burn.svg" alt="burn" width="15px" height="15px">
            <span>Burn</span>
          </v-btn>
          <v-btn class="btn-filled">
            <img src="@/assets/profile/discord.svg" alt="discord" width="15px" height="15px">
            <span>Unlock your invitation</span>
          </v-btn>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: "ProfileTicketDetails",
  data() {
    return {
      avatar: undefined,
      banner: undefined,
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      // * avatar
      if(!this.$session.get("nearSocialProfileImage")) {
        this.avatar = process.env.VUE_APP_API_BASE_URL_PINATA + "QmQDtJ4TEdsQZZssAYtL61ZJ645XvtszUggfqbmHpee1fr"
        this.banner = process.env.VUE_APP_API_BASE_URL_PINATA + "QmbV4rGbzD8ss7DAUkjg1fbR3RudfUHCDD4QC5XTF8pBHE"
        document.querySelector(".container-avatar").classList.add("default-avatar")
      } else {
        this.avatar = process.env.VUE_APP_API_BASE_URL_SOCIAL + this.$session.get("nearSocialProfileImage")
        this.banner = process.env.VUE_APP_API_BASE_URL_SOCIAL + this.$session.get("nearSocialProfileBackgroundImage")
      }

      // * banner
      if(!this.$session.get("nearSocialProfileBackgroundImage")) {
        this.banner = process.env.VUE_APP_API_BASE_URL_PINATA + "QmbV4rGbzD8ss7DAUkjg1fbR3RudfUHCDD4QC5XTF8pBHE"
      } else {
        this.banner = process.env.VUE_APP_API_BASE_URL_SOCIAL + this.$session.get("nearSocialProfileBackgroundImage")
      }
    },
  },
}
</script>

<style src="./Profile.scss" lang="scss" />
