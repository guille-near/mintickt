<template>
  <section id="home" class="center align">
    <div class="filtro1"></div>
    <div class="filtro2"></div>
    <div class="filtro3"></div>
    <div class="filtro4"></div>
    <span class="center h6" style="text-align: center">
      Choose a kind of ticket to customize it <br />
      for your event
    </span>
    <v-carousel hide-delimiter-background hide-delimiters height="auto">
      <v-carousel-item>
        <img class="hover imgCarousel" src="@/assets/logo/c3.jpg" />
        <img class="hover imgCarousel" src="@/assets/logo/c2.jpg" />
        <img class="hover imgCarousel" src="@/assets/logo/c1.jpg" />
        <img class="hover imgCarousel" src="@/assets/logo/c4.jpg" />
      </v-carousel-item>
    </v-carousel>
  </section>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  // mounted() {
  //   // window.addEventListener('resize', this.getDimensions);
  //   this.responsive();
  // },
  // // unmounted() {
  // //   window.removeEventListener('resize', this.getDimensions)
  // // },
  // methods: {
  //   // getDimensions() {
  //   //   this.responsive();
  //   // },
  //   responsive() {
  //     if (window.innerWidth <= 880) {
  //       this.leftCard = false;
  //       this.centerCard = true;
  //       this.rightCard = false;
  //     } else {
  //       this.leftCard = true;
  //       this.centerCard = true;
  //       this.rightCard = true;
  //     }
  //   }
  // },
};
</script>

<style src="../pages.scss" lang="scss" />
