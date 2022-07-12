<template>
  <section>
    <v-app-bar
      id="headerApp"
      color="transparent"
      height="140px"
      absolute
      :class="{ events: route == 'Events' || route == 'EventsNearcon' }"
    >
      <v-row class="align" :class="{ limiter: route !== 'Events' }">
        <v-col
          class="space"
          :style="
            route == 'Events' || route == 'EventsNearcon'
              ? 'padding:0'
              : 'padding-inline: clamp(1em, 4vw, 4em)'
          "
        >
          <a class="center" href="/">
            <img class="logoHeader" src="@/assets/logo/logom.svg" alt="logo" />
          </a>

          <aside
            class="acenter"
            style="gap: 0.2em"
            :style="
              route == 'Events' || route == 'EventsNearcon'
                ? ''
                : 'display:contents'
            "
          >
            <v-btn
              class="createEventBtn h9-em"
              v-if="route == 'Events' || route == 'EventsNearcon'"
            >
              <span>create an event</span>
            </v-btn>
            <v-btn text color="white" rounded class="h9-em" @click="connect">
              <img src="@/assets/logo/near.svg" alt="near" />
              <span>{{ user }}</span>
            </v-btn>
            <v-btn text color="white" rounded class="h9-em" @click="signIn()">
              <img src="@/assets/logo/near.svg" alt="near" />
              <span>boton de prueba</span>
            </v-btn>
          </aside>
        </v-col>
      </v-row>
    </v-app-bar>
  </section>
</template>

<script>
import { Wallet, Chain, Network } from "mintbase";
// let ubicacionPrincipal = window.pageYOffset;
// let resizeTimeout;
// function resizeThrottler(actualResizeHandler) {
//   // ignore resize events as long as an actualResizeHandler execution is in the queue
//   if (!resizeTimeout) {
//     resizeTimeout = setTimeout(() => {
//       resizeTimeout = null;
//       actualResizeHandler();

//       // The actualResizeHandler will execute at a rate of 15fps
//     }, 80);
//   }
// }
window.ramper.setConfig({
      appName: "Near Test App",
      chainName: "near",
      defaultTokenAddresses: [],
      theme: "dark",
      network: "testnet",
      authProviders: ["twitter", "google", "facebook", "apple", "email"],
    });
export default {
  name: "Header",
  i18n: require("./i18n"),
  // created() {
  //   this.element = document.getElementById("theme");
  //   const theme = localStorage.getItem("theme");
  //   if (theme) {
  //     this.CambiarTheme(theme);
  //   }
  //   if (theme == "light") {
  //     this.themeButton = true;
  //   }
  //   if (theme == "dark") {
  //     this.themeButton = false;
  //   }
  // },
  data() {
    return {
      // themeButton: true,
      nearid: false,
      user: "Login with NEAR",
    };
  },
  mounted() {
    this.revisar();
  },
  computed: {
    route() {
      return this.$router.currentRoute.name;
    },
  },
  methods: {
    async signIn() {
      if (window.ramper.getUser()) {
        alert("Error: You are already signed in.");
        return;
      }
      const userData = await window.ramper.signIn();
      console.log(JSON.stringify(userData));
    },

    async connect() {
      let API_KEY = "c45bd9f9-b880-4e1e-9ecb-c71309348a7d";
      const { data: walletData } = await new Wallet().init({
        networkName: Network.mainnet,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet, isConnected } = walletData;
      if (this.nearid === false) {
        console.log("user");
        wallet.connect({ requestSignIn: true }).then;
        this.nearid = true;
        const { data: details } = await wallet.details();
        this.user = details.accountId;
      } else if (this.nearid === true) {
        wallet.disconnect();
        localStorage.clear();
        this.$router.go();
        this.nearid = false;
        this.user = "Login with NEAR";
      }
    },
    async revisar() {
      let API_KEY = "c45bd9f9-b880-4e1e-9ecb-c71309348a7d";
      const { data: walletData } = await new Wallet().init({
        networkName: Network.mainnet,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet, isConnected } = walletData;
      // console.info(isConnected)
      if (!isConnected) {
        //console.info("user")
        wallet.connect();
      }

      if (localStorage.getItem("Mintbase.js_wallet_auth_key") !== null) {
        this.nearid = true;
        let datos = JSON.parse(
          localStorage.getItem("Mintbase.js_wallet_auth_key")
        );
        console.info("aca");
        this.user = datos.accountId;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get("account_id") !== null) {
          history.replaceState(
            null,
            location.href.split("?")[0],
            "/events/ZJdegansubNv80mSfHKGYbabAYZdkQ3vd7lzQ-Sb27U:mintickt.mintbase1.near/#/"
          );
        }
      } else {
        this.nearid = false;
        console.info("aqui");
      }
    },
    // CambiarTheme(theme) {
    //   this.$store.dispatch("CambiarTheme", { theme, element: this.element });
    //   this.themeButton = !this.themeButton;
    // },
    // OcultarNavbar() {
    //   let Desplazamiento_Actual = window.pageYOffset;
    //   if (ubicacionPrincipal >= Desplazamiento_Actual) {
    //     document.getElementById("headerApp").style.top = "0";
    //   } else {
    //     document.getElementById("headerApp").style.top = "-100px";
    //   }
    //   ubicacionPrincipal = Desplazamiento_Actual;
    // },
    // scrollListener() {
    //   resizeThrottler(this.OcultarNavbar);
    // }
  },
  // beforeDestroy() {
  //   document.removeEventListener('scroll', this.scrollListener);
  // }
};
</script>

<style src="./layout.scss" lang="scss" />
