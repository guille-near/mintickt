<template>
  <div id="burn" class="center" style="margin-block: 140px 80px">
    <v-sheet color="transparent" class="tcenter divcol center" style="gap: 1em" max-width="max-content">
      <img src="@/assets/img/burn-ticket.jpg" alt="burn ticket">
      <div class="divcol" style="gap: .5em">
        <h3 class="p">Terminator (Let me in)</h3>
        <p>Burn this NFT so event staff let you in at the venue.</p>
      </div>
      <v-btn class="fill-w">Burn it</v-btn>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: "Burn",
  data() {
    return {
    };
  },
};
</script>

<style scoped lang="scss">
img {
  max-width: clamp(208px, 20vw, 265px);
  background: linear-gradient(338.88deg, #EFE1D4 28.41%, #FFFFFF 101.9%), linear-gradient(180deg, #000000 0%, #272727 100%);
}
h3 {
  font-family: sans-serif;
  font-weight: 600;
  font-size: 25px;
  line-height: 25px;
  letter-spacing: -0.03em;
  color: #FFFFFF !important;
}
p {
  font-family: 'SF Pro', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.5) !important;
}
.v-btn {
  margin-top: 1.5em;
  min-height: 39px !important;
  color: #FFFFFF !important;
  background: linear-gradient(0deg, #000000 -42.31%, rgba(0, 0, 0, 0) 50%), #CC00B7 !important;
  border-radius: 10px;
  span {
    font-family: 'Proxima Nova', sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 15px;
    letter-spacing: -0.03em;
  }
}
</style>
