<template>
  <section>
    <!-- 1 -->
    <v-alert
      :value="alertSuccess"
      elevation="3"
      transition="scale-transition"
      id="alerta"
    >
      <aside id="contenedorCloseAlert">
        <v-btn class="iconoCloseAlert" icon @click="alertSuccess = false">
          <v-icon id="colorCloseAlert" size="1.5rem">mdi-close</v-icon>
        </v-btn>
      </aside>

      <v-col cols="11" style="padding: 0 !important">
        <div class="contenedorAlertPosition">
          <v-icon style="color: #00ffbb !important" size="2.5rem"
            >mdi-check-circle</v-icon
          >
          <span id="titleAlert">Approved</span>
        </div>

        <p class="textAlertUp">Transaction Approved</p>

        <div class="contenedorAlertPosition">
          <a href="#" class="textAlertDown"
            >View on explorer
            <sup style="top: -3px !important">
              <v-icon x-small class="flechitaAlert"> mdi-arrow-top-right </v-icon>
            </sup>
          </a>
        </div>
      </v-col>
    </v-alert>
    <!-- 2 -->
    <v-alert
      :value="alertPending"
      elevation="3"
      transition="scale-transition"
      id="alerta"
    >
      <aside id="contenedorCloseAlert">
        <v-btn class="iconoCloseAlert" icon @click="alertPending = false">
          <v-icon id="colorCloseAlert" size="1.5rem">mdi-close</v-icon>
        </v-btn>
      </aside>

      <v-col cols="11" style="padding: 0 !important">
        <div class="contenedorAlertPosition">
          <v-icon style="color: #f6943c !important" size="2.5rem"
            >mdi-minus-circle</v-icon
          >
          <span id="titleAlert">Pending</span>
        </div>

        <p class="textAlertUp">Transaction Pending</p>
        <div class="contenedorAlertPosition">
          <a href="#" class="textAlertDown"
            >View on explorer
            <sup style="top: -3px !important">
              <v-icon x-small class="flechitaAlert"> mdi-arrow-top-right </v-icon>
            </sup>
          </a>
        </div>
      </v-col>
    </v-alert>
    <!-- 3 -->
    <v-alert
      :value="alertCancelled"
      elevation="3"
      transition="scale-transition"
      id="alerta"
    >
      <aside id="contenedorCloseAlert">
        <v-btn class="iconoCloseAlert" icon @click="alertCancelled = false">
          <v-icon id="colorCloseAlert" size="1.5rem">mdi-close</v-icon>
        </v-btn>
      </aside>

      <v-col cols="11" style="padding: 0 !important">
        <div class="contenedorAlertPosition">
          <v-icon style="color: #ea1717 !important" size="2.5rem"
            >mdi-close-circle</v-icon
          >
          <span id="titleAlert">Cancelled</span>
        </div>

        <p class="textAlertUp">Transaction Pending</p>

        <div class="contenedorAlertPosition">
          <a href="#" class="textAlertDown"
            >View on explorer
            <sup style="top: -3px !important">
              <v-icon x-small class="flechitaAlert"> mdi-arrow-top-right </v-icon>
            </sup>
          </a>
        </div>
      </v-col>
    </v-alert>
  </section>
</template>

<script>
/*

<Alert ref="alerta"></Alert>


import Alert from "@/pages/Alert/Alert.vue";


components: {
  Alert
},


this.$refs.alerta.AlertSuccess();

*/
export default {
  name: "Alert",
  data() {
    return {
      alertSuccess: false,
      alertPending: false,
      alertCancelled: false,
    };
  },
  methods: {
    AlertSuccess() {
      this.alertSuccess = true
    },
    AlertPending() {
      this.alertPending = true
    },
    AlertCancelled() {
      this.alertCancelled = true
    }

    /* LLAMADO DE METODOS

     AlertaSuccess() {
       this.$refs.alerta.AlertSuccess();
     },
     AlertaPending() {
       this.$refs.alerta.AlertPending();
     },
     AlertaCanceled() {
       this.$refs.alerta.AlertCanclled();
     }
     
    */
  }
};
</script>

<style src="./Alert.scss" lang="scss"></style>
