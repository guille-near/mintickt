<template>
  <section>
    <v-app-bar
      id="headerApp"
      color="transparent"
      height="140px"
      absolute
      :class="{
        events:
          routeName == 'Landing'  ||
          routePath.includes('events') ||
          routePath.includes('profile'),
        register: routePath === '/events/register'
      }"
    >
      <v-row
        class="align"
        :class="{
          limiter:
            routeName == 'Landing' || 
            !routePath.includes('events') ||
            !routePath.includes('profile')
        }"
      >
        <v-col
          class="space"
          :style="
            routePath.includes('events') || routePath.includes('profile') ||  routeName == 'Landing'
              ? 'padding:0'
              : 'padding-inline: clamp(1em, 4vw, 4em)'
          "
        >
          <a class="center" href="/#/">
            <img
              v-if="responsiveActions"
              class="logoHeaderEvents"
              src="@/assets/logo/logo-mobile.svg"
              alt="logo"
            />
            <img
              v-else
              class="logoHeader"
              src="@/assets/logo/logom.svg"
              alt="logo"
            />
          </a>

          <aside
            class="container-buttons-header center"
            style="gap: 20px"
            :style="routePath !== '/events/register' ? '' : 'display:contents'"
          >

            <v-btn
              class="createEventBtn h9-em"
              v-show="routePath !== '/events/register' && routeName !== 'Store'"
              @click="goToEvent"
            >
              <span>create an event</span>
            </v-btn>

            <v-menu bottom offset-y>
              <template #activator="{on, attrs}">
                <!-- <v-btn
                  v-if="responsiveActions"
                  color="white"
                  class="btnNearMobile h7-em"
                  v-on="nearid ? on : undefined"
                  v-bind="nearid ? attrs : undefined"
                  @click="nearid ? undefined : connect()"
                >
                  <img src="@/assets/logo/near-black.svg" alt="near logo" />
                </v-btn> -->

                <!--  atributes used before changes 👇 -->
                <!-- text
                rounded
                color="white" -->

                <v-btn
                  class="buttonProfile"
                  v-on="nearid ? on : undefined"
                  v-bind="nearid ? attrs : undefined"
                  @click="nearid ? undefined : connectRamper()"
                  :title="user"
                >
                  <img src="@/assets/logo/near.svg" alt="near" />
                  <span>{{ limitStr(user, 25) }}</span>
                  <!-- <span><v-icon class="mr-1 ml-1" style="font-size:20px;color:orange">mdi-square-rounded</v-icon>Testnet</span> -->
                </v-btn>
              </template>

              <v-list color="rgb(0 0 0 / .6)">
                <!-- <v-list-item v-show="responsiveActions" disabled style="background-color: #FFF !important; border-radius: 5px">
                  <v-list-item-title style="color: #000">{{user}}</v-list-item-title>
                </v-list-item> -->
                <v-list-item :to="'/events'">
                  <v-list-item-title style="color: #fff">Events</v-list-item-title>
                </v-list-item>
                <v-list-item :to="'/profile'">
                  <v-list-item-title style="color: #fff">Profile</v-list-item-title>
                </v-list-item>
                <v-list-item @click="logOut">
                  <v-list-item-title style="color: #fff">Log out</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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
// window.ramper.setConfig({
//   appName: "Near Test App",
//   chainName: "near",
//   defaultTokenAddresses: [],
//   theme: "dark",
//   network: "testnet",
//   authProviders: ["twitter", "google", "facebook", "apple", "email"],
// });
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
      user: "Log In",
      responsiveActions: false,
      routePath: this.$router.currentRoute.path,
      routeName: this.$router.currentRoute.name,
    };
  },
  mounted() {
    if (this.$ramper.getUser()) {
      this.user = this.$ramper.getAccountId()
    }
    // this.revisar();
    this.responsive();
    window.onresize = () => {
      this.responsive();
    };
    
    const header = document.getElementById("headerApp")
    // console.log(this.$route.path);
    if (this.$route.path === "/events/liveData" || this.$route.path == "/events/options") {
      header.classList.add("delpaddlivedata")
    } else {
      header.classList.remove("delpaddlivedata")
    }
  },
  watch: {
    $route(current) {
      const header = document.getElementById("headerApp")
      this.routePath = current.path,
      this.routeName = current.name
      if (current.path === "/events/liveData" || current.path == "/events/options") {
        header.classList.add("delpaddlivedata")
      } else {
        header.classList.remove("delpaddlivedata")
      }
    }
  },
  methods: {
    limitStr(item, num) {
      if (item) {
        if (item.length > num) {
          return item.substring(0, num) + "..."
        }
      }
      return item
    },
    responsive() {
      if (window.innerWidth <= 880) {
        this.responsiveActions = true;
      } else {
        this.responsiveActions = false;
      }
    },
    async connectOld() {
      let API_KEY = this.$dev_key;
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet, isConnected } = walletData;
      if (this.nearid === false) {
        wallet.connect({ requestSignIn: true }).then;
        this.nearid = true;
        const { data: details } = await wallet.details();dev_key
        this.user = details.accountId;
      } else if (this.nearid === true) {
        wallet.disconnect();
        localStorage.clear();
        this.$router.go();
        this.nearid = false;
        this.user = "Log In";
      }
    },
    async connectRamper() {
      console.log("ASD")
      if (this.$ramper.getUser()) {
        this.$ramper.signOut()
        this.$router.push("/");
        location.reload()
        this.nearid = false;
        this.user = "Log In";
      } else {
        const login = await this.$ramper.signIn()
        console.log(login)
        if (login) {
          if (login.user) {
            // this.$router.go()
            location.reload()
          }
        }
      }
      
      // console.log("RAMPER", this.$ramper, this.$dev_key)
      // let API_KEY = this.$dev_key;
      // let networkName = this.$networkName.toString();
      // const { data: walletData } = await new Wallet().init({
      //   networkName: networkName,
      //   chain: Chain.near,
      //   apiKey: API_KEY,
      // });
      // const { wallet, isConnected } = walletData;
      // if (this.nearid === false) {
      //   wallet.connect({ requestSignIn: true }).then;
      //   this.nearid = true;
      //   const { data: details } = await wallet.details();
      //   this.user = details.accountId;
      // } else if (this.nearid === true) {
      //   wallet.disconnect();
      //   localStorage.clear();
      //   this.$router.go();
      //   this.nearid = false;
      //   this.user = "Login with NEAR";
      // }
    },
    async revisar() {
      let API_KEY = this.$dev_key;
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet, isConnected } = walletData;
      // console.info(isConnected)
      // if (!isConnected) {
      //   //console.info("user")
      //   if (this.nearid === false) {
      //     wallet.connect({ requestSignIn: true }).then;
      //     this.nearid = true;
      //     const { data: details } = await wallet.details();
      //     this.user = details.accountId;
      //   } else if (this.nearid === true) {
      //     wallet.disconnect();
      //     localStorage.clear();
      //     this.$router.go();
      //     this.nearid = false;
      //     this.user = "Login with NEAR";
      //   }
      // }
      if (localStorage.getItem("Mintbase.js_wallet_auth_key") !== null) {
        this.nearid = true;
        let datos = JSON.parse(
          localStorage.getItem("Mintbase.js_wallet_auth_key")
        );
        this.user = datos.accountId;
        
      } 
    },
    async logOut() {
      // let API_KEY = this.$dev_key;
      // let networkName = this.$networkName.toString();
      // const { data: walletData } = await new Wallet().init({
      //   networkName: networkName,
      //   chain: Chain.near,
      //   apiKey: API_KEY,
      // });
      // walletData.wallet.disconnect();
      // localStorage.clear();
      this.$ramper.signOut()
      this.$router.go();
      this.nearid = false;
      this.user = "Log In";
    },
    goToEvent(){

      this.$session.clear();
      localStorage.setItem('step', 1);
      this.$router.push('/events/register')
    }
  },
};
</script>

<style src="./layout.scss" lang="scss" />
