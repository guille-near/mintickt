<template>
  <section>
    <v-col cols="11" sm="8" md="6" class="divcol center" style="margin-inline: auto">
      <div class="containerLogoLogin">
        <img style="margin-bottom: 0.3125rem" class="logoLogin center-absolute" src="" alt="logo">
      </div>
      <v-col class="paddvertical containerInput">
        <v-text-field
          v-model="unlock"
          type="password"
          background-color="#FFFFFF"
          solo
          flat
        >
        <template v-slot:label>
          <span class="h7">Contraseña</span>
        </template>
        <template v-slot:append>
          <v-icon color="#6667AB" medium>mdi-lock-outline</v-icon>
        </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="10" md="10" class="center" style="padding-top: 0">
        <a href="#" class="desc2 h7" style="text-decoration: none; margin-bottom: 2.5rem; text-align: center">
          Importar usando frase secreta de recuperaión
        </a>
      </v-col>

      <v-btn id="botonLogin" @click="desbloquear()">
        <span class="h6">Desbloquear</span>
      </v-btn>
    </v-col>
  </section>
</template>

<script>
export default {
  name: "Desbloquear",
  data() {
    return {
      unlock: "",
    }
  },
  methods: {
    desbloquear() {
      console.log(this.unlock)
    }
  }
}
</script>

<style src="./Login.scss" lang="scss"></style>
