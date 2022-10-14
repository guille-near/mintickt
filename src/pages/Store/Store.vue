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
            <span class="tend">~ {{ (price_token_usd).toFixed(2) }} $USD</span>
          </aside>
        </div>
        <div style="gap: 1em" class="divcol fill-w">
          <v-btn @click="batchMakeOffer()" :loading="loading" class="paywallet h8-em">
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
  </section>
</template>

<script>
import gql from "graphql-tag";
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
  query MyQuery($store: String!, $user: String!, $metadata_id: String!) {
    nft_tokens_aggregate(
      where: {
        nft_contract_id: { _eq: $store }
        metadata_id: { _eq: $metadata_id }
      }
    ) {
      aggregate {
        count
      }
    }
    nft_earnings_aggregate(
      where: {
        receiver_id: { _eq: $user }
        offer: { token: { metadata_id: { _eq: $metadata_id } } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default {
  name: "Tienda",
  data() {
    return {
      tittle: "",
      ticket_img: "",
      quantity: 0,
      location: "",
      dialog: false,
      loading: false,
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
      precio_yocto: null,
      hash: "",
      src: this.$pinata_gateway+"Qmdsg8TxEm91rwKq1bFnmEgn7Wfwefxx4og5m75f81hf19",
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

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes");
    this.hash =
      "https://explorer.mainnet.near.org/transactions/" +
      urlParams.get("transactionHashes");
    if (urlParams.get("transactionHashes") !== null) {
      console.log("aqui" + urlParams.get("transactionHashes"));
      this.dialog = true;
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/mintickt/#/store/?thingid=evento2.mintspace2.testnet:92491d464372586d487957a172e474f4"
      );
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/mintickt/#/store/?thingid=evento2.mintspace2.testnet:92491d464372586d487957a172e474f4"
      );
    }
  },
  methods: {
    NEARyoctoNEAR: function () {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(1);
      console.log(amountInYocto);
      return amountInYocto;
    },
    async getData() {
      this.loading = true;
      this.data = [];
      this.dataTableMobile = [];
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
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
                textDetails:
                  value[0].id,
              },
            ];
            //Last price
			      this.price_near = value[0].listings_aggregate.nodes[0].price /  Math.pow(10, 24);
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
                    user: user,
                    metadata_id: value1.id,
                  },
                })
                .then((response) => {
                  this.tokens_minted = response.data.nft_tokens_aggregate.aggregate.count;
                  this.tokens_listed = value1.listings_aggregate.aggregate.count;
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
        this.price_token_usd = parseFloat(this.lastPrice) * parseFloat(this.price_near) * (this.quantity === 0 ? 1 : parseFloat(this.quantity))
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
        this.quantity= this.quantity+1;
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
            this.tokens_buy.push(element.token_id + ":" + this.$store_mintbase);
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
          }
        });
      }
    },
    onIntersect(entries) {
      this.isIntersecting = entries[0].isIntersecting;
    },
    async batchMakeOffer() {
      this.loading = true;
      let API_KEY = this.$dev_key;
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;
      var prices_tokens = [];
      this.tokens_buy.forEach((element) => {
        prices_tokens.push(this.price_near.toString());
        //console.log(element);
      });
      wallet
        .batchMakeOffer(
          this.tokens_buy,
          prices_tokens * Math.pow(10, 24)
        )
        .then(() => { this.loading = false });
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
