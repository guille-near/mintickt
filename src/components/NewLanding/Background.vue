<template>
  <div id="newLanding" class="divcol">
    <img class="background-landing eliminarxmobile" src="@/assets/newLanding/background-landing.png">
    <img class="background-landing verxmobile" src="@/assets/newLanding/background-landing-mobile.png">
    <div class="lights-up">
      <img class="lights eliminarmobile"  src="@/assets/newLanding/background/lights-merged.png">
      <img class="lights vermobile"  src="@/assets/newLanding/background/lights-merged-mobile.png">
    </div>
    <!-- <img class="lights-up eliminarxmobile" src="@/assets/newLanding/lights-up.png"> -->
    <!-- <img class="lights-up verxmobile" src="@/assets/newLanding/lights-up-mobile.png"> -->

    <slot name="content"></slot>
    
    <img class="lights-down liminarxmobile" src="@/assets/newLanding/lights-up.png">
    <img class="lights-down verxmobile" src="@/assets/newLanding/lights-up-mobile.png">
  </div>
</template>

<script>
export default {
  name: "NewLandingBackground",
  props: {

  },
};
</script>

<style lang="scss">
#newLanding {
  .background-landing {
    width: 100vw !important;
    margin-inline: calc(50% - 50vw) !important;
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: -1;
    object-fit: cover !important;
    filter: brightness(6%);
    background-blend-mode: normal, overlay;
    &.verxmobile {
      top: -150px;
      filter: brightness(4%);
    }
  }

  .lights-up {
    width: 100vw !important;
    display: grid;
    place-items: center;
    margin-inline: calc(50% - 50vw) !important;
    padding-inline: 100px;
    @media (max-width: 880px) {padding-inline: 0px;}
    position: absolute !important;
    top: .5%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: -1;

    img.lights {
      object-fit: cover !important;
      width: 100%;
      max-width: 1728px;
      transform: translateY(-3.5%);
      
      @media (max-width: 1200px) {
        width: 100vw !important;
        margin-inline: calc(50% - 50vw) !important;
        transform: translateY(5%);
      }

      
      @media (max-width: 880px) {
        width: 100% !important;
        margin-inline: 0 !important;
        transform: translateY(-18%);
      }
      @media (max-width: 660px) {transform: translateY(-15%);}
      @media (max-width: 550px) {transform: translateY(-10%);}
      @media (max-width: 400px) {transform: translateY(-5%);}
      @media (max-width: 310px) {transform: translateY(0);}
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 994.548px;
      height: 343.979px;
      border-radius: 994.548px;
      background: linear-gradient(180deg, #CC00B7 0%, rgba(93, 247, 164, 0.38) 100%);
      filter: blur(345.22515869140625px);
      @media (max-width: 880px) {
        width: 391.125px;
        height: 135.277px;
        border-radius: 391.125px;
        filter: blur(135.76663208007812px);
      }
    }

    // &::after {
    //   content: "";
    //   position: absolute;
    //   left: 0;
    //   right: 0;
    //   bottom: -349.618px;
    //   margin: auto;
    //   width: 100%;
    //   height: 349.618px;

    //   background: rgba(0, 0, 0, 0.01);
    //   filter: blur(93.47252655029297px);
    //   backdrop-filter: blur(186.94505310058594px);
    // }
  }

  .lights-down {
    width: 100vw !important;
    margin-inline: calc(50% - 50vw) !important;
    position: absolute !important;
    rotate: 180deg !important;
    bottom: 0;
    @media (max-width: 880px) {bottom: 250px !important;}
    left: 0;
    right: 0;
    margin: auto;
    z-index: -1;
    object-fit: cover !important;
  }
}
</style>
