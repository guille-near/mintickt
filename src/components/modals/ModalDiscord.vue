<template>
  <v-dialog v-model="modalDiscord" max-width="420px">
    <v-card id="modalDiscord" class="center">
      <h3 class="p tcenter">Accept Synchronization</h3>

      <section class="divcol center" style="gap: 30px">
        <div class="divcol center">
          <img id="avatar" src="../../assets/profile/user.svg" alt="profile avatar">
          <span>juan</span>
        </div>

        <p class="tcenter">Hey there juan <br>Ready to sync with discord?</p>
      </section>

      <!-- <p class="tcenter">Hey there juan <br>Ready to sync with discord?</p> -->

      <v-btn @click="modalDiscord=false">connect</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ModalSuccess",
  data() {
    return {
      modalDiscord: false,
    };
  },
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