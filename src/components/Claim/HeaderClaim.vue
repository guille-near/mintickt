<template>
  <section>
    <!-- mobile -->

    <!-- desktop -->
    <v-app-bar
    id="headerApp"
    color="transparent"
    height="100px"
    absolute
  >
    <v-row class="limiter align">
      <v-col class="jstart" style="padding-inline: clamp(1em, 4vw, 4em)">
        <a class="center" href="/">
          <img class="logoHeader" src="@/assets/logo/logom.svg" alt="logo">
        </a>
      </v-col>
    </v-row>
  </v-app-bar>

  </section>
</template>

<script>
import { Wallet, Chain, Network } from 'mintbase'
let ubicacionPrincipal = window.pageYOffset;
let resizeTimeout;
function resizeThrottler(actualResizeHandler) {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      resizeTimeout = null;
      actualResizeHandler();

      // The actualResizeHandler will execute at a rate of 15fps
    }, 80);
  }
}
export default {
  name: "Header",
  created() {
    this.element = document.getElementById("theme");
    const theme = localStorage.getItem("theme");
    if (theme) {
      this.CambiarTheme(theme);
    }
    if (theme == "light") {
      this.themeButton = true;
    }
    if (theme == "dark") {
      this.themeButton = false;
    }
  },
  data() {
    return {
      themeButton: true,
      nearid: false,
      user: 'Login with NEAR',
    };
  },
  mounted(){
    this.revisar()
  },
  methods: {
  
  async  connect() {
  let API_KEY = "c45bd9f9-b880-4e1e-9ecb-c71309348a7d"
  const { data: walletData } = await new Wallet().init({
    networkName: Network.mainnet,
    chain: Chain.near,
    apiKey: API_KEY,
  })
   const { wallet, isConnected } = walletData
    if (this.nearid === false){
      console.log("user")
      wallet.connect({ requestSignIn: true }).then
      this.nearid = true
      const { data: details } = await wallet.details()
      this.user = details.accountId
    }else if (this.nearid === true){
      wallet.disconnect()
      localStorage.clear()
      this.$router.go()
      this.nearid = false
      this.user = "Login with NEAR"
    }
},
 async revisar() {
   let API_KEY = "c45bd9f9-b880-4e1e-9ecb-c71309348a7d"
  const { data: walletData } = await new Wallet().init({
    networkName: Network.mainnet,
    chain: Chain.near,
    apiKey: API_KEY,
  })
   const { wallet, isConnected } = walletData
   // console.info(isConnected)
   if(!isConnected){
      //console.info("user")
      wallet.connect()
   }
   
   if (localStorage.getItem('Mintbase.js_wallet_auth_key') !== null){
     this.nearid = true
    let datos =JSON.parse(localStorage.getItem('Mintbase.js_wallet_auth_key'))
    console.info('aca')
    this.user = datos.accountId
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get("account_id") !== null) {
      history.replaceState(null, location.href.split("?")[0], '/events/ZJdegansubNv80mSfHKGYbabAYZdkQ3vd7lzQ-Sb27U:mintickt.mintbase1.near/#/');
    }
   } else{
     this.nearid = false
     console.info("aqui")
   }

 },
    CambiarTheme(theme) {
      this.$store.dispatch("CambiarTheme", { theme, element: this.element });
      this.themeButton = !this.themeButton;
    },
    CambiarTheme2(theme) {
      this.$refs.menu.OverlayMethod(theme);
    },
    OcultarNavbar() {
      let Desplazamiento_Actual = window.pageYOffset;
      if (ubicacionPrincipal >= Desplazamiento_Actual) {
        document.getElementById("headerApp").style.top = "0";
      } else {
        document.getElementById("headerApp").style.top = "-100px";
      }
      ubicacionPrincipal = Desplazamiento_Actual;
    },
    scrollListener() {
      resizeThrottler(this.OcultarNavbar);
    }
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.scrollListener);
  }
};
</script>

<style src="@/components/Layout/layout.scss" lang="scss" />
