import dotenv from 'dotenv'
dotenv.config()
import Vue from "vue";
import App from "./App.vue";
import initI18n from "@/plugins/i18n";
import router from "./Routes";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import ramper from "./services/ramper-api";
import near from "./services/near-api";
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
import VueClipboard from 'vue-clipboard2'
import VueQRCodeComponent from 'vue-qr-generator'
import { TimePicker } from 'vue-drumroll-datetime-picker'
import 'vue-drumroll-datetime-picker/dist/style.css'
import VueCookies from 'vue-cookies'
import VueSession from 'vue-session'
import Carousel3d from 'vue-carousel-3d';


//Global Variables
Vue.config.productionTip = false
Vue.prototype.$networkName= process.env.VUE_APP_NETWORK;
//Vue.prototype.$store_mintbase= (Vue.config.productionTip) ? 'testingmintickt.mintspace2.testnet' : 'testingmintickt.mintspace2.testnet';
//Vue.prototype.$mintbase_marketplace= (Vue.config.productionTip) ? 'market-v2-beta.mintspace2.testnet' : 'market-v2-beta.mintspace2.testnet';
//Vue.prototype.$dev_key= 'mintickt.key'; // '2077ba62-21fd-4457-b3f5-13e6d376d026';
Vue.prototype.$explorer= process.env.VUE_APP_API_BASE_URL_EXPLORER;
Vue.prototype.$ipfs= process.env.VUE_APP_API_BASE_URL_IPFS;
Vue.prototype.$binance= process.env.VUE_APP_API_BASE_URL_NEAR_PRICE;
Vue.prototype.$node_url = process.env.VUE_APP_API_BASE_URL_NEAR_PRICE;
Vue.prototype.$pinata_gateway = process.env.VUE_APP_API_NODE_URL;
//Vue.prototype.$value_user_mint = "kamargo1.testnet"
Vue.prototype.$burn_page_ticket = process.env.VUE_APP_API_BASE_URL_BURN;
//Vue.prototype.$store_site = (Vue.config.productionTip) ? "https://testnet.mintickt.com/#/store/?thingid=" : "https://testnet.mintickt.com/#/store/?thingid="
Vue.prototype.$burn_page_goodies = process.env.VUE_APP_API_BASE_URL_BURN;
//Vue.prototype.$event_page = 'http://testnet.mintickt.com/#/events/'
//Vue.prototype.$owner = "probando.testnet"
//Vue.prototype.$owner_split = "3"
//Vue.prototype.$baseUrl = "https://testnet.mintickt.com/#"
//Vue.prototype.$key = "AIzaSyCEOUnBgw-3I8ffxi3zE85mV1QqIJdy08w" // 49cc71c9-d792-4ff1-b7c7-d4fd5b43ac13

Vue.use(ramper)
Vue.use(near)
// 3d carousel
Vue.use(Carousel3d);

//Session
Vue.use(VueSession)

//Cookies
Vue.use(require('vue-cookies'))
Vue.use(VueCookies, { expires: '1d'})

// time picker
Vue.component('TimePicker', TimePicker)

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
Vue.component('qr-code', VueQRCodeComponent)

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
    key: "AIzaSyCEOUnBgw-3I8ffxi3zE85mV1QqIJdy08w",
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
import { InMemoryCache } from 'apollo-cache-inmemory'

// Cache implementation
const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  // uri: 'https://mintbase-mainnet.hasura.app/v1/graphql'
  uri: (Vue.config.productionTip) ? "https://api.thegraph.com/subgraphs/name/hrpalencia/minticktestnet" : "https://api.thegraph.com/subgraphs/name/hrpalencia/minticktestnet",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});
const mintickClient = new ApolloClient({
  // You should use an absolute URL here
  // uri: 'https://mintbase-mainnet.hasura.app/v1/graphql'
  uri: (Vue.config.productionTip) ? "https://api.thegraph.com/subgraphs/name/hrpalencia/minticktestnet" : "https://api.thegraph.com/subgraphs/name/hrpalencia/minticktestnet",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

const apolloProvider = new VueApollo({
  clients: {
    apolloClient,
    mintickClient
},
  defaultClient: apolloClient,
});

// Polyfill
if (!String.prototype.cutString) {
  String.prototype.ellipsisRange = function(length = 7) {
    if (this.length > length) return `${this.substring(0, length)}...`
    return this
  }
}


new Vue({
  ramper,
  near,
  vuetify,
  apolloProvider,
  router,
  axios,
  i18n,
  render: (h) => h(App),
  store,
}).$mount("#app");