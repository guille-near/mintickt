<template>
  <section id="tienda" class="center align divcol">
    <aside>
      <!-- new -->
      <img class="eliminarmobile" :src="src" alt="Background Image" />
      <img class="vermobile" :src="src" alt="Background Image" />
      <!-- new -->
      <div class="fill-w limiter align">
        <v-chip color="rgba(0, 0, 0, 0.3)"
          >{{ date }} {{ date_start }}-{{ this.date_end }}</v-chip
        >
        <h2></h2>
        <span>{{ tittle }}</span>
      </div>
    </aside>
    <aside class="jspace divcolmobile gapmobile acentermobile limiter">
      <div v-if="!isIntersecting" class="floatButton vermobile">
        <div class="fill-w">
          <v-btn class="h8-em fill-w" href="#buy">Buy a ticket</v-btn>
        </div>
      </div>

      <div class="contleft divcol fill-wmobile">
        <aside v-if="Datos.about" class="aboutSection divcol">
          <h3 class="h7-em p">About</h3>

          <div v-if="Datos.about.event" class="divcol h8-em">
            <p class="p"><strong>Event Information:</strong></p>
            <p class="mt-3" v-html="Datos.about.event.text" />
          </div>
        </aside>

        <aside class="contLocation divcol">
          <h3 class="h7-em">Location</h3>
          <iframe
            referrerpolicy="no-referrer-when-downgrade"
            :src="googlemap"
            allowfullscreen
          >
          </iframe>
          <p
            class="h8-em"
            style="display: flex; align-items: flex-end; gap: 0.5em"
          >
            <img src="@/assets/logo/Marker.svg" alt="marker icon" />
            {{ Datos.location }}
          </p>
        </aside>

        <aside class="divcol">
          <h3 class="h7-em">Details</h3>
          <aside class="contDetails">
            <p
              v-for="(item, i) in Datos.details"
              :key="i"
              class="h8-em tittles"
            >
              <strong>{{ item.titlesDetails }}</strong>
              <br />{{ item.textDetails }}
            </p>
          </aside>
        </aside>
      </div>

      <article id="buy" class="divcol acenter" v-intersect="onIntersect">
        <img class="ticket" :src="ticket_img" alt="Ticket" />
        <div class="contenedor_aside divcol fill-w">
          <aside class="divrow">
            <span class="h8-em space" style="width: 100%; gap: 0.5em">
              <strong class="number">{{ tokens_listed }}</strong> of
              <strong class="number">{{ tokens_minted }}</strong> available
            </span>
          </aside>
          <aside class="relative">
            <v-text-field
              disabled
              type="number"
              hide-spin-buttons
              :hide-details="true"
              solo
              v-model="quantity"
            >
            </v-text-field>
            <div class="contenedor_botones">
              <v-btn color=" #C4C4C4" @click="controlAmount('less')">
                <v-icon color="black"> mdi-minus </v-icon>
              </v-btn>
              <v-btn color=" #C4C4C4" @click="controlAmount('more')">
                <v-icon color="black"> mdi-plus </v-icon>
              </v-btn>
            </div>
          </aside>

          <aside class="space">
            <div class="divrow acenter">
              <img src="@/assets/logo/logonear.svg" alt="Logo near" />
              <span class="h8-em number ml-3">{{ price_near }}</span>
            </div>
            <span class="tend">~ {{ price_token_usd.toFixed(2) }} $USD</span>
          </aside>
        </div>
        <div style="gap: 1em" class="divcol fill-w">
          <v-btn
            @click="buy"
            :loading="loading"
            :disabled="disable"
            class="paywallet h8-em"
          >
            Pay with NEAR
          </v-btn>
          <!-- <v-btn @click="batchtransfer" class="paycard h8-em"> Pay with card </v-btn> -->
        </div>
      </article>

      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            View transaction in explorer
          </v-card-title>

          <v-card-text>
            <center style="margin-top: 2.5em">
              <a target="_blank" :href="hash">Explorer transaction</a>
            </center>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false"> OK </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </aside>
      <ModalSuccess ref="modal"></ModalSuccess>
  </section>
</template>

<script>
import gql from "graphql-tag";
import ModalSuccess from "./ModalSuccess";
import { Wallet, Chain, Network } from "mintbase";
import * as nearAPI from "near-api-js";
const your_events = gql`
  query MyQuery($store: String!, $metadata_id: String!) {
    mb_views_nft_metadata(
      where: {
        nft_contract_id: { _eq: $store }
        listings: { price: { _is_null: false } }
        id: { _eq: $metadata_id }
      }
    ) {
      title
      reference_blob
      id
      listings_aggregate {
        aggregate {
          count
        }
        nodes {
          price
          reference
          token_id
        }
      }
    }
  }
`;
const mb_views_nft_tokens_aggregate = gql`
  query MyQuery($store: String!,  $metadata_id: String!) {
  nft_tokens_aggregate(
    where: {nft_contract_id: {_eq: $store}, metadata_id: {_eq: $metadata_id}}
  ) {
    aggregate {
      count
    }
  }
  nft_earnings_aggregate(
    where: {offer: {token: {metadata_id: {_eq: $metadata_id}}}}
  ) {
    aggregate {
      count
    }
  }
}
`;
const main_image = gql`
  query MyQuery($_iregex: String!) {
    ipfs(where: { thingid: $_iregex }) {
      tokenid
    }
  }
`;

export default {
  name: "Tienda",
  components: {
    ModalSuccess,
  },
  data() {
    return {
      tittle: "",
      ticket_img: "",
      quantity: 0,
      location: "",
      dialog: false,
      loading: false,
      disable: false,
      lastPrice: [],
      showCarousel: null,
      Datos: {
        about: {
          event: {
            text: "",
          },
        },
        location: "",
        details: [],
      },
      metadata: null,
      tokens_minted: null,
      isIntersecting: false,
      tokens_listed: null,
      price_near: 0,
      price_token_usd: 0,
      tokens: [],
      tokens_buy: [],
      txs: [],
      precio_yocto: null,
      hash: "",
      src: "",
      date: "",
      date_start: "",
      date_end: "",
      googlemap: "",
      store: "",
    };
  },
  mounted() {
    this.$emit("renderHeader");
    this.getData();
    this.fetch();
    this.mainImg();
    this.quantity == 0 ? (this.disable = true) : (this.disable = false);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes");
    let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
    const user = datos.accountId;
    if (urlParams.get("transactionHashes") !== null) {
      this.$refs.modal.modalSuccess = true;
      this.$refs.modal.url =
        this.$explorer+"/accounts/"+user
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/mintickt/#/store/?thingid="+localStorage.getItem('eventid')
      );
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/mintickt/#/store/?thingid="+localStorage.getItem('eventid')
      );
    }
  },
  methods: {
    NEARyoctoNEAR: function (NEARyocto) {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(NEARyocto);
      // console.log(amountInYocto);
      return amountInYocto.toString();
    },
    async getData() {
      this.loading = true;
      this.data = [];
      this.dataTableMobile = [];
      var metadata_id = this.$route.query.thingid.toLowerCase();
      this.$apollo
        .query({
          query: your_events,
          variables: {
            store: this.$store_mintbase,
            metadata_id: metadata_id,
          },
        })
        .then((response) => {
          var options = { year: "numeric", month: "short" }; //Format data
          var options_start = { day: "numeric" }; //Format data
          var options_end = { day: "numeric" }; //Format data
          //Map the objectvalue
          Object.entries(response.data).forEach(([key, value]) => {
            // inner object entries
            //Dates
            this.date = new Date(
              value[0].reference_blob.extra[6].value * 1000
            ).toLocaleDateString("en-US", options);
            this.date_start = new Date(
              value[0].reference_blob.extra[6].value * 1000
            ).toLocaleDateString("en-US", options_start);
            this.date_end = new Date(
              value[0].reference_blob.extra[7].value * 1000
            ).toLocaleDateString("en-US", options_end);
            //Tittle
            this.tittle = value[0].title;
            //Ticket image
            this.ticket_img = value[0].reference_blob.media;
            //Html description
            this.Datos.about.event.text = value[0].reference_blob.description;
            //Location
            this.Datos.location = value[0].reference_blob.extra[0].value;
            //Google map location
            this.googlemap =
              "https://www.google.com/maps/embed/v1/place?key=AIzaSyDMtqgnD-Nbr_gk04K5H9HegRvnjvG7Fms&q=" +
              this.Datos.location;
            //Extra data
            this.Datos.details = [
              {
                titlesDetails: "Storage Gateaway",
                textDetails: "https://arweave.net",
              },
              {
                titlesDetails: "Transactions ID",
                textDetails: value[0].listings_aggregate.nodes[0].reference,
              },
              {
                titlesDetails: "Contract",
                textDetails: value[0].reference_blob.store,
              },
              {
                titlesDetails: "Thing ID",
                textDetails: value[0].id,
              },
            ];
            //Last price
            this.price_near =
              value[0].listings_aggregate.nodes[0].price / Math.pow(10, 24);
            //Add tokens
            this.tokens = value[0].listings_aggregate.nodes;
            Object.entries(value).forEach(([i, value1]) => {
              //Getting the minted nft
              //Tokens aggregate and earnings by metadata id
              this.$apollo
                .query({
                  query: mb_views_nft_tokens_aggregate,
                  variables: {
                    store: this.$store_mintbase,
                    metadata_id: value1.id,
                  },
                })
                .then((response) => {
                  this.tokens_minted =
                    response.data.nft_tokens_aggregate.aggregate.count;
                  this.tokens_listed =
                    value1.listings_aggregate.aggregate.count;
                })
                .catch((err) => {
                  console.log("Error", err);
                });
            });
          });
        })
        .catch((err) => {
          console.log("Error", err);
        })
        .finally(() => (this.loading = false));
    },
    pollData() {
      this.polling = setInterval(() => {
        this.getData();
        this.$forceUpdate();
      }, 120000);
    },
    fetch() {
      const BINANCE_NEAR = this.$binance;
      var request = new XMLHttpRequest();
      request.open("GET", BINANCE_NEAR);
      request.send();
      request.onload = () => {
        this.lastPrice = JSON.parse(request.responseText).lastPrice;
        this.price_token_usd =
          parseFloat(this.lastPrice) *
          parseFloat(this.price_near) *
          (this.quantity === 0 ? 1 : parseFloat(this.quantity));
      };
    },
    formatPrice(price) {
      return Number(
        utils.format.formatNearAmount(
          price.toLocaleString("fullwide", { useGrouping: false })
        )
      );
    },
    controlAmount(item) {
      var quantity_tokens = 0;
      if (item == "more" && this.quantity < this.tokens_listed) {
        this.quantity = this.quantity + 1;
        // this.lastPrice = this.lastPrice.lastPrice * this.quantity * this.price_near
        this.getData();
        this.fetch();
        this.tokens_buy = [];
        this.tokens.forEach((element) => {
          if (
            !this.tokens_buy.includes(element.token_id) &&
            quantity_tokens < this.quantity
          ) {
            quantity_tokens++;
            this.tokens_buy.push(element.token_id);
            this.quantity == 0 ? (this.disable = true) : (this.disable = false);
            console.log(this.tokens_buy);
          }
        });
      }
      if (item == "less" && this.quantity > 1) {
        this.quantity--;
        this.getData();
        this.fetch();
        this.tokens_buy = [];
        this.tokens.forEach((element) => {
          if (
            !this.tokens_buy.includes(element.token_id) &&
            quantity_tokens < this.quantity
          ) {
            quantity_tokens++;
            this.tokens_buy.push(element.token_id);
            this.quantity == 0 ? (this.disable = true) : (this.disable = false);
          }
        });
      }
    },
    onIntersect(entries) {
      this.isIntersecting = entries[0].isIntersecting;
    },
    padWithZero(num, targetLength) {
      return String(num).padEnd(targetLength, "0");
    },
    async buy() {
      this.quantity == 0 ? (this.disable = true) : (this.disable = false);
      this.loading = true;
      const mintbase_marketplace = this.$mintbase_marketplace;
      let store = this.$store_mintbase;
      this.tokens_buy.forEach((element) => {
        console.log(element)
        // Pushh array for each element of the tokens selected
        this.txs.push({
                  receiverId: mintbase_marketplace,
                  functionCalls: [
                    {
                      methodName: "buy",
                      receiverId: mintbase_marketplace,
                      gas: "200000000000000",
                      args: {
                        nft_contract_id: store,
                        token_id: element,
                      },
                      deposit: this.padWithZero(this.price_near, String(this.price_near).length + 24),
                    },
                  ],
                });
      });
      this.executeMultipleTransactions();
    },
    async mainImg() {
      var thingid = this.$route.query.thingid.toLowerCase();
      //console.log(Object.values(this.dataFilters)[0].value)
      //reedemed
      this.$apollo
        .query({
          query: main_image,
          variables: {
            _iregex: thingid,
          },
          client: "mintickClient",
        })
        .then((response) => {
          // console.log(response.data)
          this.src = this.$pinata_gateway + response.data.ipfs[0].tokenid;
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    async executeMultipleTransactions() {
        //Gettintg the tokens ID
        //this.getTokensId();
        //Adding metadata for the burn ticket
        let API_KEY = this.$dev_key.toString();
        let networkName = this.$networkName.toString();
        const { data: walletData } = await new Wallet().init({
          networkName: networkName,
          chain: Chain.near,
          apiKey: API_KEY,
        });
        const { wallet } = walletData;

        await wallet.executeMultipleTransactions({
          transactions: this.txs,
          options: {
            meta: "buy",
          },
        });
      
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
