<template>
  <div id="newLanding" class="divcol">
    <img class="background-landing eliminarxmobile" src="@/assets/newLanding/background-landing.png">
    <img class="background-landing verxmobile" src="@/assets/newLanding/background-landing-mobile.png">

    <img class="lights-up eliminarxmobile" src="@/assets/newLanding/lights-up.png">
    <img class="lights-up verxmobile" src="@/assets/newLanding/lights-up-mobile.png">

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
    margin-inline: calc(50% - 50vw) !important;
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: -1;
    object-fit: cover !important;
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
