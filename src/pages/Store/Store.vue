<template>
  <section id="tienda" class="center align divcol">
    <aside>
      <!-- new -->
      <img class="eliminarmobile" :src="src" alt="Background Image" />
      <img class="vermobile" :src="src" alt="Background Image" />
      <!-- new -->
      <div class="fill-w limiter align">
        <!-- <v-chip color="rgba(0, 0, 0, 0.3)">
          {{ date }} {{ date_start }}-{{ this.date_end }} {{ time }}
        </v-chip> -->
        <v-chip color="rgba(0, 0, 0, 0.3)">
          {{ date }}. {{ date_start }}, {{ time_start }}h
        </v-chip>
        <h2>{{ tittle }}</h2>
        <!-- <span>{{ tittle }}</span> -->
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

        <aside v-if="Datos.about" class="aboutSection divcol">
          <h3 class="h7-em p">When</h3>

          <div class="acenter" style="gap: 10px">
            <img src="@/assets/icons/calendar.svg" alt="calendar icon" style="width: 20px">
            
            <div class="divcol" style="gap: 4px">
              <p class="p">
                <strong>Start at: </strong>
                {{ tsformart}}.
              </p>
              
              <p class="p">
                <strong>Ends at: </strong>
                {{ tsendformat }}.
              </p>
            </div>
          </div>
        </aside>

        <aside class="contLocation divcol">
          <h3 class="h7-em">Where</h3>
          <p
            class="h8-em mb-4"
            style="display: flex; align-items: flex-end; gap: 0.5em"
          >
            <img src="@/assets/logo/Marker.svg" alt="marker icon" />
            {{ Datos.location }}
          </p>
          <iframe
            referrerpolicy="no-referrer-when-downgrade"
            :src="googlemap"
            allowfullscreen
          >
          </iframe>
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
              <span class="h8-em number ml-3">{{ price_near.toFixed(4) }}</span>
            </div>
            <span class="tend">~ {{ price_token_usd.toFixed(2) }} $USD</span>
          </aside>
        </div>
        <div style="gap: 1em" class="divcol fill-w">
          <v-btn
            @click="mintGoodieProccess"
            :loading="loading"
            :disabled="disable || tokens_listed == 1"
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
import { Wallet, Chain, Network, MetadataField } from "mintbase";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
const { utils } = nearAPI;
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
          minter
        }
      }
    }
  }
`;
const mb_views_nft_tokens_aggregate = gql`
  query MyQuery($store: String!, $metadata_id: String!) {
  nft_tokens_aggregate(
    where: {nft_contract_id: {_eq: $store}, metadata_id: {_eq: $metadata_id}}
  ) {
    aggregate {
      count
    }
  }
  nft_earnings_aggregate(where: {nft_token: {metadata_id: {_eq: $metadata_id}}}) {
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
const get_ticket_to_send = gql`
  query MyQuery($_iregex: String!, $owner: String!) {
  mb_views_nft_tokens_aggregate(
    where: {reference_blob: {_cast: {String: {_iregex: $_iregex}}}
      , extra: {_eq: "ticketing"}
      , owner: {_eq: $owner}
      , burned_receipt_id: {_is_null: true}}
    order_by: {token_id: asc}  
  ) {
    aggregate {
      count
    }
    nodes {
      token_id
      owner
      extra
    }
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
      approval_id: "",
      time_start: "",
      time_end: "",
      tsformart: "",
      tsendformat: ""
    };
  },
  mounted() {
    this.$emit("renderHeader");
    this.getData();
    this.fetch();
    this.mainImg();
    localStorage.setItem('eventid', this.$route.query.thingid.toLowerCase())
    //this.sendTicket()
    // 
    this.quantity == 0 ? (this.disable = true) : (this.disable = false);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes");
    if (urlParams.get("transactionHashes") !== null) {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      this.$refs.modal.modalSuccess = true;
      this.$refs.modal.url =
        this.$explorer+"/accounts/"+user
      //this.sendTicket();
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/store/?thingid="+localStorage.getItem('eventid')
      );
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/store/?thingid="+localStorage.getItem('eventid')
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
          var options = { month: "short" }; //Format data
          var options_start = { day: "numeric" }; //Format data
          var options_end = { day: "numeric" }; //Format data
          var year = { year: "numeric" }; //Format data
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
            this.time_start = value[0].reference_blob.extra[9].value;
            this.time_end = value[0].reference_blob.extra[10].value;
            //
            this.tsformart = new Date(
              value[0].reference_blob.extra[6].value * 1000
            ).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}) + ' ' + this.time_start + ' h';
            this.tsendformat = new Date(
              value[0].reference_blob.extra[7].value * 1000
            ).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}) + ' ' + this.time_end + ' h';
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
            localStorage.setItem('minter', value[0].listings_aggregate.nodes[0].minter)
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
      }, 60000);
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
        localStorage.setItem('quantity', this.quantity);
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
            //console.log(this.tokens_buy);
          }
        });
      }
      if (item == "less" && this.quantity > 1) {
        this.quantity--;
        localStorage.setItem('quantity', this.quantity);
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
      //console.log(this.padWithZero(this.price_near.toFixed(4), String(this.price_near.toFixed(4)).length + 24))
      this.tokens_buy.forEach((element) => {
        //console.log(element)
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
                      deposit: utils.format.parseNearAmount(this.price_near.toFixed(4)),
                    },
                  ],
                });
      });
      this.executeMultipleTransactions();
    },
    async mainImg() {
      var thingid = this.$route.query.thingid.toLowerCase();
      console.log(thingid)
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
          console.log(response.data)
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
    async sendTicket() {
      const url =  this.$node_url + "/nft-transfer";
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      let quantity = parseInt(localStorage.getItem('quantity'));
      //Must repeate for any ticket the use purchased
      for(let i = 0; i < quantity; i ++){
            this.$apollo
              .query({
                query: get_ticket_to_send,
                variables: {
                  _iregex: this.$route.query.thingid.toLowerCase().split(":")[1],
                  owner: localStorage.getItem('minter')
                },
              })
              .then((response) => {
                let item = {
                  receiver_id: user,
                  token_id: response.data.mb_views_nft_tokens_aggregate.nodes[i].token_id,
                  msg: "",
                  account_id: this.$owner
                };
                //console.log(item)
                this.axios
                  .post(url, item)
                  .then(() => {
                    console.log('Hash up')
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((err) => {
                console.log("Error", err);
              });
      }        
    },
    async mintGoodieProccess() {
        //Api key an data
        let API_KEY = this.$dev_key.toString();
        let networkName = this.$networkName.toString();
        const { data: walletData } = await new Wallet().init({
          networkName: networkName,
          chain: Chain.near,
          apiKey: API_KEY,
        });
        const { wallet } = walletData;
        //Loading image
        try {
          var image = new Image();
          image.src = localStorage.getItem("canvas");
          //image.src = localStorage.getItem("canvas");
          this.image = image;

          const file = this.dataURLtoFile(this.image, "mint.png");
          const { data: fileUploadResult, error: fileError } =
            await wallet.minter.uploadField(MetadataField.Media, file);
          // localStorage.setItem("file", file);
          if (fileError) {
            throw new Error(fileError);
          } else {
            console.log(fileUploadResult);
          }
        } catch (error) {
          console.error(error);
          // TODO: handle error
        }

        //Extra data location , dates, place id
        let extra = [
          {
            trait_type: "location",
            value: "Entrance",
          },
          {
            trait_type: "Promoter / Organizer name",
            value: "LetMeIn",
          },
          {
            trait_type: localStorage.getItem("eventid").split(":")[1],
            value: "LetMeIn",
          }
        ];
        let store = this.$store_mintbase;
        let category = "redeemed";

        //Metadata Object
        const metadata = {
          title: "GrabME",
          description: "GrabME",
          extra,
          store,
          type: "NEP171",
          category,
        };
        await wallet.minter.setMetadata(metadata, true);
        // console.log(metadata);

        //handle royalties
        const royalties = {};

        //handle splits
        const splits = {};
        
        
        await wallet.mint(
          1,
          store.toString(),
          null,
          null,
          null,
          { owner: "merchant2022.testnet" }
        );
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.src.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    // async getTickettoSend(){
    //   this.$apollo
    //     .query({
    //       query: get_ticket_to_send,
    //       variables: {
    //         _iregex: this.$route.query.thingid.toLowerCase().split(":")[1],
    //         owner: localStorage.getItem('minter')
    //       },
    //     })
    //     .then((response) => {
    //       localStorage.setItem('ticket_to_send', response.data.mb_views_nft_tokens_aggregate.nodes[0].token_id)
    //     })
    //     .catch((err) => {
    //       console.log("Error", err);
    //     });
    // },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
