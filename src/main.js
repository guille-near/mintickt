import Vue from "vue";
import App from "./App.vue";
import initI18n from "@/plugins/i18n";
import router from "./Routes";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueAnimateOnScroll from "vue-animate-onscroll";
import VueApexCharts from "vue-apexcharts";
import VueApollo from "vue-apollo";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import VueMoment from "vue-moment";
import moment from "moment-timezone";
import vueDebounce from 'vue-debounce';
import axios from 'axios';
import VueAxios from "vue-axios";

//Global Variables
Vue.config.productionTip = false
Vue.prototype.$networkName= (Vue.config.productionTip) ? 'mainnet' : 'testnet';
Vue.prototype.$store_mintbase= (Vue.config.productionTip) ? 'mintickt1.mintspace2.testnet' : 'mintickt1.mintspace2.testnet';
Vue.prototype.$mintbase_marketplace= (Vue.config.productionTip) ? 'market-v2-beta.mintspace2.testnet' : 'market-v2-beta.mintspace2.testnet';
Vue.prototype.$dev_key= '084d5aa3-2167-4226-be1f-e98c4b68d103';
Vue.prototype.$explorer= (Vue.config.productionTip) ? 'https://explorer.near.org/' : 'https://explorer.testnet.near.org/';
Vue.prototype.$ipfs= (Vue.config.productionTip) ? 'https://www.mintickt.com:3070/api/ipfs/' : 'http://localhost:3070/api/ipfs/';
Vue.prototype.$binance= 'https://api.binance.com/api/v3/ticker/24hr?symbol=NEARUSDT';
Vue.prototype.$node_url = (Vue.config.productionTip) ? 'https://www.mintickt.com:3090/api/v1/mintickt' : 'http://localhost:3090/api/v1/mintickt'
Vue.prototype.$pinata_gateway = "https://mintickt.mypinata.cloud/ipfs/"
Vue.prototype.$value_user_mint = "vicious2403.testnet"

Vue.use(PerfectScrollbar);
Vue.use(VueAxios,axios);
// axios.defaults.baseURL= (Vue.config.productionTip) ? 'http://localhost:3090/api/v1/mintickt' : 'https://www.mintickt.com:3090/api/v1/mintickt'

// Or if you want to pass in the lock option
Vue.use(vueDebounce)

Vue.use(VueMoment, {
  moment,
});


// google maps
import * as VueGoogleMaps from "vue2-google-maps";
import VuetifyGoogleAutocomplete from "vuetify-google-autocomplete";
// geolocation
import VueGeolocation from "vue-browser-geolocation";
Vue.use(VueGeolocation);

Vue.use(VueApollo);
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
Vue.use(VueAnimateOnScroll);
const i18n = initI18n("ES", "US");
Vue.use(Toast);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBXwqZH6fI3F6LTvjaVCBmkFR5YywUity8",
    libraries: "places", // 'places,drawing,visualization',
    lang: "en"
  },
});
Vue.use(VuetifyGoogleAutocomplete, {
  /*
    not used as loaded with component
    apiKey: key,
  */
  vueGoogleMapsCompatibility: true,
});

Vue.config.productionTip = false;
import ApolloClient from "apollo-boost";

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  // uri: 'https://mintbase-mainnet.hasura.app/v1/graphql'
  uri: (Vue.config.productionTip) ? "https://interop-testnet.hasura.app/v1/graphql" : "https://interop-testnet.hasura.app/v1/graphql",
});
const mintickClient = new ApolloClient({
  // You should use an absolute URL here
  // uri: 'https://mintbase-mainnet.hasura.app/v1/graphql'
  uri: (Vue.config.productionTip) ? "https://api.thegraph.com/subgraphs/name/hrpalencia/mintickbackend" : "https://api.thegraph.com/subgraphs/name/hrpalencia/mintickbackend",
});

const apolloProvider = new VueApollo({
  clients: {
    apolloClient,
    mintickClient
},
  defaultClient: apolloClient,
});


new Vue({
  vuetify,
  apolloProvider,
  router,
  axios,
  i18n,
  render: (h) => h(App),
  store,
}).$mount("#app");
