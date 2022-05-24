<template>
  <section class="to-v-app">
    <v-app id="login">
      <a href="#" class="soporte desc2 h7">
        <strong>¿Necesita ayuda?</strong> Comuníquese con Soporte
      </a>
      <v-container class="containerlogin">
        <Desbloquear v-if="Unlock"></Desbloquear>
        <section v-if="Login">
          <v-col cols="11" sm="8" md="6" class="divcol center" style="margin-inline: auto">
            <div class="containerLogoLogin">
              <img class="logoLogin center-absolute" src="" alt="logo">
            </div>
            <v-col class="paddvertical containerInput">
              <v-text-field
                v-for="(item, index) in dataLogin"
                v-bind:key="index"
                v-model="item.model"
                :type="item.type"
                background-color="#FFFFFF"
                solo
                flat
              >
              <template v-slot:label>
                <span class="h7">{{ item.label }}</span>
              </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="10" md="10" class="containerOptionsLogin" style="padding-top: 0">
              <div class="divrow center">
              <v-checkbox v-model="checkbox" id="checkbox" name="checkbox" color="#6667AB" />
              <label for="checkbox" class="desc h7">Recuerdame</label>
              </div>
              <a href="#" class="desc h7" style="text-decoration: none; text-align: center" @click="unlock()">
                ¿Olvidaste la contraseña?
              </a>
            </v-col>

            <v-btn id="botonLogin" @click="login()">
              <span class="h6">Login</span>
            </v-btn>
          </v-col>
        </section>
      </v-container>
    </v-app>
  </section>
</template>

<script>
import Desbloquear from "@/components/Login/Desbloquear.vue"

export default {
  name: "Login",
  components: {
    Desbloquear
  },
  data() {
    return {
      Login: true,
      Unlock: false,
      dataLogin: [
        {
          model: "",
          type: "text",
          label: "Apodo o Correo"
        },
        {
          model: "",
          type: "password",
          label: "Contraseña"
        }
      ],
      checkbox: false
    }
  },
  methods: {
    login() {
      const user = this.dataLogin[0].model;
      const clave = this.dataLogin[1].model;
      console.log(user, clave)
    },
    unlock() {
      this.Unlock = true;
      this.Login = false
    }
  }
}
</script>

<style src="./Login.scss" lang="scss"></style>
