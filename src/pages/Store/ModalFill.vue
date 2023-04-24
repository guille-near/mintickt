<template>
  <v-dialog v-model="modalFill" max-width="420px" persistent>
    <v-card id="modalSucess">
      <div class="divcol center">
        <h3 class="p">Insufficient Balance</h3>
        <p class="p">You don't have enough balance to cover this transaction, please go to your NEAR wallet and add funds</p>
      </div>
      <div class="divcol center">
        <a class="acenter" style="gap: 0.3em">
          <span @click="modalFill = false" class="p">Close</span>
        </a>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "modalFill",
  data() {
    return {
      modalFill: false,
      url: "",
    };
  },
  methods: {
    buy() {
      this.$emit("eventBuy");
    },
    fiat() {
      this.$emit("eventFiat");
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
