import Vue from 'vue'
import App from './App.vue'
import initI18n from '@/plugins/i18n'
import router from './Routes'
import store from './store/index'
import vuetify from './plugins/vuetify'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";
import VueAnimateOnScroll from 'vue-animate-onscroll';
import VueApexCharts from 'vue-apexcharts'
import VueApollo from 'vue-apollo'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar)

// google maps
import * as VueGoogleMaps from 'vue2-google-maps';
// geolocation
import VueGeolocation from 'vue-browser-geolocation';
Vue.use(VueGeolocation);

Vue.use(VueApollo)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(VueAnimateOnScroll);
const i18n = initI18n("ES", "US");
Vue.use(axios);
Vue.use(Toast);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg',
  },
});

Vue.config.productionTip = false
import ApolloClient from 'apollo-boost'
const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'https://mintbase-mainnet.hasura.app/v1/graphql'
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  vuetify,
  apolloProvider,
  router,
  i18n,
  render: h => h(App), store
}).$mount('#app')
