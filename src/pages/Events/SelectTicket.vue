<template>
	<section id="sliderSelection">
    <h2>Choose your ticket</h2>

    <carousel-3d>
      <slide
        v-for="(item, i) in dataTickets" :key="i"
        :index="i"
        :class="{active: item.active}"
      >
        <button @click="item.active ? item.active = !item.active : dataTickets.forEach(e => {e.active = false; item.active = true})">
          <img
            :src="require(`@/assets/ticket-selection/ticket-${item.name}.svg`)"
            :alt="`${item.name} ticket`"
          >
        </button>
      </slide>
    </carousel-3d>

    <div class="divcol center" style="width: 100%; gap: 8px">
      <v-btn
        :disabled="!dataTickets.some(el => el.active)"
        @click="goTo"
      >Choose this one</v-btn>
      <v-btn
        class="ownBtn"
        @click="goToCustom"
      >Upload my own ticket</v-btn>
    </div>
	</section>
</template>

<script>
export default {
  name: "SelectTicket",
  data() {
    return {
      dataTickets: [
        {name: "con", active: false},
        {name: "cinema", active: false},
        {name: "event", active: false},
      ],
    };
  },
  methods: {
    goTo() {
      const currentSelection = this.dataTickets.find(el => el.active)?.name
      this.$router.push(`/events/register:${currentSelection}`)
      this.$session.set("ticketval", currentSelection)
    },
    goToCustom() {
      this.$router.push(`/events/register:custom`)
      this.$session.set("ticketval", "custom")
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
    font-size: clamp(10px, 1.5vh, 15px);
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
    overflow: visible !important;
    --height: clamp(20em, 29vw, 29.4375em);
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
        max-height: max-content !important;
        max-width: max-content !important;
        min-height: max-content !important;
        min-width: max-content !important;
        background: transparent !important;
        overflow: visible !important;
        isolation: isolate;
        &:not(.current) {opacity: .4 !important}
        img {
          min-height: var(--height) !important;
          height: var(--height) !important;
          max-height: var(--height) !important;
          // aspect-ratio: 1.3 / 2;
          // border-radius: 15px;
        }
        &.current.active {
          // border-radius: 15px !important;
          // box-shadow: 0px 0px 16.7089px rgba(211, 254, 184, 0.8), 0px 0px 61.519px rgba(204, 0, 183, 0.88); // ? figma
          // box-shadow:
          //   // 0px 0px 19.119px rgba(211, 254, 184, 0.8),
          //   0px 0px 3.8449375em rgba(204, 0, 183, 0.88),
          //   // inset 0px 0px 100px 5px rgba(211, 254, 184, 0.8),
          //   inset 0px 0px 1500px rgba(204, 0, 183, 0.58) !important;
          // ? Added here
          &::before {
            content: "";
            position: absolute !important;
            inset: 0;
            z-index: -1;
            filter: blur(30px) !important;
            @media (max-width: 880px) {
              inset: 0 50px;
              -ms-inset: 0 50px;
              -webkit-inset: 0;
              -moz-inset: 0;
              -o-inset: 0;
            } // for mobile device
            background-color: rgba(204, 0, 183, 0.88) !important;
          }
          // ? Added here
        }
        &.left-1 {
          transform: translateX(-19em) translateZ(-400px) rotateY(35deg) !important;
          @media (max-width: 880px) {
            transform: translateX(-14em) translateZ(-400px) rotateY(35deg) !important;
          }
        }
        &.right-1 {
          transform: translateX(19em) translateZ(-400px) rotateY(-35deg) !important;
          @media (max-width: 880px) {
            transform: translateX(14em) translateZ(-400px) rotateY(-35deg) !important;
          }
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
