<template>
	<section id="sliderSelection">
    <h2>Choose your ticket</h2>

    <carousel-3d>
      <slide
        v-for="(item, i) in dataTickets" :key="i"
        :index="i"
        :class="{active: i === sliderSelection}"
      >
        <button @click="sliderSelection = i">
          <img
            :src="require(`@/assets/ticket-selection/ticket-${item}.png`)"
            :alt="`${item} ticket`"
          >
        </button>
      </slide>
    </carousel-3d>

    <div class="divcol center" style="width: 100%; gap: 8px">
      <v-btn
        :disabled="sliderSelection === undefined"
        @click="goTo"
      >Choose this one</v-btn>
      <v-btn
        class="ownBtn"
        @click="$router.push(`/events/register:custom`)"
      >Upload my own ticket</v-btn>
    </div>
	</section>
</template>

<script>
export default {
  name: "SelectTicket",
  data() {
    return {
      sliderSelection: undefined,
      dataTickets: ["event", "con", "cinema"],
    };
  },
  methods: {
    goTo(){
      this.$router.push(`/events/register:${this.dataTickets[this.sliderSelection]}`)
      this.$session.set("ticketval", this.dataTickets[this.sliderSelection])
    }
  }
};
</script>

<style lang="scss">
#sliderSelection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-inline: 2.5em !important;
  padding-top: clamp(120px, 1vh, 160px);
  @media (max-width: 880px) {
    padding-top: 100px !important;
    padding-inline: 7.5px !important
  }
  @media (max-height: 900px) and (min-width: 880px) {
    font-size: clamp(10px, 1vh, 15px);
  }

  h2 {
    font-weight: 700;
    font-size: clamp(2em, calc(2.5vw + 1em), 2.5em) !important;
    text-align: center;
    letter-spacing: -0.03em;
    color: #FFFFFF;
    @media (max-width: 880px) {font-size: clamp(1.5em, 2.5vw, 2.5em) !important}
  }

  .carousel-3d-container {
    --height: 29.4375em;
    height: calc(var(--height) + (40px * 2)) !important;
    padding-block: 40px;
    margin: 0 !important;
    .carousel-3d-slider {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      width: max-content !important;
      height: var(--height) !important;
      .carousel-3d-slide {
        border: none !important;
        height: max-content !important;
        width: max-content !important;
        background: transparent !important;
        &:not(.current) {opacity: .4 !important}
        img {
          height: var(--height);
          border-radius: 15px;
        }
        &.current.active {
          border-radius: 15px;
          box-shadow: 0px 0px 19.119px rgba(211, 254, 184, 0.8),
            0px 0px 70.3929px rgba(204, 0, 183, 0.88),
            inset 0px 0px 100px 5px rgba(211, 254, 184, 0.8),
            inset 0px 0px 500px rgba(204, 0, 183, 0.88);
        }
      }
    }
  }

  .v-btn {
    font-size: 1em;
    width: min(100%, 322px);
    height: 42px;
    background: transparent;
    &:not(.ownBtn) {background: linear-gradient(183.29deg, #000000 49.8%, rgba(211, 254, 184, 0) 382.27%) !important}
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    filter: drop-shadow(0px 4px 19px rgba(0, 0, 0, 0.1)) !important;
    backdrop-filter: blur(7px) !important;
    border-radius: 8px !important;
    &--disabled {opacity: .5}
    span {
      font-family: 'Proxima Nova', "SF Pro", sans-serif;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: -0.03em;
      color: #FFFFFF;
    }
  }
}
</style>
