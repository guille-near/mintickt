<template>
  <v-dialog v-model="modalDiscord" max-width="420px">
    <v-card id="modalDiscord" class="center">
      <div v-if="!status">
        <h3 class="p tcenter">Accept Synchronization</h3>

        <section class="divcol center" style="gap: 30px">
          <div class="divcol center">
            <img id="avatar" :src="avatar" alt="profile avatar">
            <span>{{ userDc.username }}#{{ userDc.discriminator }}</span>
          </div>

          <p class="tcenter">Hey there {{ userDc.username }}<br>Ready to sync with discord?</p>
        </section>

        <!-- <p class="tcenter">Hey there juan <br>Ready to sync with discord?</p> -->

        <v-btn @click="connectDiscord()">CONNECT</v-btn>
      </div>
      <div v-else>
        <div v-if="status == 'success'">
          <h3 class="p tcenter">Success!</h3>
          <v-icon size="10em" style="color: rgb(62, 195, 68) !important">
          mdi-check-circle</v-icon>
        </div>
        <div v-if="status == 'error'">
          <h3 class="p tcenter">ERROR!</h3>
          <v-icon size="10em" style="color: rgb(181, 11, 11) !important">
          mdi-close-circle</v-icon>
        </div>
      </div>
      
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios"
export default {
  name: "ModalSuccess",
  data() {
    return {
      modalDiscord: false,
      avatar: require("../../assets/profile/user.svg"),
      userDc: {},
      status: null
    };
  },
  methods: {
    connectDiscord () {
      console.log("ENTRO")
      // this.connectBtn = true
      const accountId = this.$ramper.getAccountId()

      axios.post(process.env.VUE_APP_BOTDISCORD_URL + "/api/bot-discord/", { "wallet": accountId, "discordId": this.userDc.id })
        .then(result => {
          console.log("SUCCESS")
          this.status = "success"
          // localStorage.removeItem('discord_sinc')
          setTimeout(this.modalDiscord = false, 10000)
          
        }).catch(err => {
          console.log("ERROR")
          this.status = "error"
          console.error(err);
          // localStorage.removeItem('discord_sinc')
          setTimeout(this.modalDiscord = false, 10000)
        })
    },
  }
};
</script>

<style src="../../pages/pages.scss" lang="scss"></style>
<style lang="scss">
@import '@/styles/_mixins.scss';

#modalDiscord {
  position: relative;
  isolation: isolate;

  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 48px;
  @include borderGradientImageCard(url(../../assets/backgrounds/border-gradient-card-large.png));
  border-radius: 11px !important;
  backdrop-filter: blur(11px) !important;
  background-color: rgba(0, 0, 0, 0.4) !important;

  #avatar {
    width: 150px !important;
    border: 4px solid #fff;
    border-radius: 50%;
  }
  p {
    background-color: black;
    padding: 16px;
    border-radius: 15px;
  }
  a, span.p, p {
    font-weight: 400;
    font-size: 15px;
    color: #6D6D6D;
  }
  .v-btn {
    padding: 17px;
    width: min(90%, 21.6875em);
    height: 2.625em;
    @include backgroundBorderGradientImage(url(../../assets/backgrounds/border-gradient-btn-large.png));
    
    backdrop-filter: blur(3px);
    background-color: transparent;
    background-size: 100% 100% !important;
    background-image: url(../../assets/backgrounds/border-gradient-btn-large.png) !important;

    span {color: #fff}
  }
}
</style>