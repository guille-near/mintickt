<template>
  <v-dialog v-model="modalBuy" max-width="420px" persistent>
    <v-card id="modalSucess">
      <div class="divcol center">
        <h3 class="p">Select payment option</h3>
      </div>

      <div class="divcol center">
        <v-btn @click="fiat">Pay with Fiat</v-btn>
        <v-btn @click="buy()">Pay with NEAR</v-btn>
        <a class="acenter" style="gap:.3em">
          <span @click="modalBuy=false" class="p">Close</span>
        </a>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "modalBuy",
  data() {
    return {
      modalBuy: false,
      url: '',
    };
  },
  methods: {
    buy(){
        this.$emit("eventBuy")
    },
    fiat(){
        this.$emit("eventFiat")
    }

  }  
};
</script>

<style src="../pages.scss" lang="scss" />
