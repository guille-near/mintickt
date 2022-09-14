<template>
  <v-dialog v-model="modalSuccess" max-width="420px">
    <v-card id="modalSucess">
      <div class="divcol center">
        <h3 class="p">Success!</h3>
        <p class="p">Your transaction was succesful.</p>
      </div>

      <div class="divcol center">
        <v-btn @click="modalSuccess=false">Ok</v-btn>
        <a class="acenter" style="gap:.3em" :href="url" target="_blank">
          <span class="p">See transaction</span>
          <img src="@/assets/icons/link.svg" alt="link icon">
        </a>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ModalSuccess",
  data() {
    return {
      modalSuccess: false,
      url: '',
    };
  },
};
</script>

<style src="../pages.scss" lang="scss" />
