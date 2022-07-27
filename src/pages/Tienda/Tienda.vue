<template>
  <section id="tienda" class="center align divcol nearcon">
    <aside>
      <!-- new -->
      <img
        class="eliminarmobile"
        src="@/assets/img/Group 166.png"
        alt="Background Image"
      />
      <img
        class="vermobile"
        src="@/assets/img/Group 167.png"
        alt="Background Image"
      />
      <!-- new -->
      <!-- new -->
      <div class="fill-w limiter align">
        <v-chip color="rgba(0, 0, 0, 0.3)">SEP 11 - 14</v-chip>
        <h2>{{ tittle }}</h2>
        <span>Lisbon, Portugal</span>
      </div>
    </aside>

    <aside class="jspace divcolmobile gapmobile acentermobile limiter">
      <div v-if="!isIntersecting" class="floatButton vermobile">
        <div class="fill-w">
          <v-btn class="h8-em fill-w" href="#buy">Get your ticket</v-btn>
        </div>
      </div>

      <div class="contleft divcol fill-wmobile">
        <aside v-if="Datos.about" class="aboutSection divcol">
          <!-- <h3 class="h7-em p">About</h3> -->

          <div v-if="Datos.about.event" class="divcol">
            <h3 class="h7-em">About</h3>
            <p class="h8-em" v-html="Datos.about.event.text" />
          </div>

          <div v-if="Datos.about.venue" class="divcol h8-em">
            <h3 class="h7-em">Schedule overview</h3>
            <p class="h8-em" v-html="Datos.about.venue.text" />
          </div>

          <div v-if="Datos.about.movie" class="divcol h8-em">
            <p style="margin-block: 0em 1em !important">
              <strong>Movie Information:</strong>
            </p>
            <p v-html="Datos.about.movie.text" />
          </div>

          <div v-if="Datos.about.info" class="conttitles">
            <p
              v-for="(item, i) in Datos.about.info"
              :key="i"
              class="h8-em tittles"
            >
              <strong>{{ item.title }} </strong>{{ item.text }}
            </p>
          </div>

          <div v-if="Datos.about.cancelation" class="divcol h8-em">
            <p class="p"><strong>Cancelation &amp; Weather Policy:</strong></p>
            <p v-html="Datos.about.cancelation" />
          </div>
        </aside>

        <aside class="contLocation divcol">
          <h3 class="h7-em">Location</h3>
          <p
            class="h8-em"
            style="
              display: flex;
              align-items: flex-end;
              gap: 0.5em;
              margin-bottom: 1em;
            "
          >
            <img src="@/assets/icons/marker-nearcon.svg" alt="marker icon" />
            {{ Datos.location }}
          </p>
          <iframe
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDMtqgnD-Nbr_gk04K5H9HegRvnjvG7Fms&q=Cais da Viscondessa, Lisboa, Portugal"
            allowfullscreen
          >
          </iframe>
        </aside>

        <aside class="divcol">
          <h3 class="h7-em">Details</h3>
          <aside class="contDetails">
            <p class="h8-em tittles">
              <strong>Storage Gateaway</strong>
              <br />{{ Datos.details.storage_gateaway }}
            </p>

            <p class="h8-em tittles">
              <strong>Transactions ID</strong>
              <br />{{ Datos.details.transactions_id }}
            </p>

            <p class="h8-em tittles">
              <strong>Contract</strong>
              <br />{{ Datos.details.contract }}
            </p>

            <p class="h8-em tittles">
              <strong>Thing ID</strong>
              <br />{{ Datos.details.thing_id }}
            </p>
          </aside>
        </aside>
      </div>

      <article
        id="buy"
        class="divcol acenter nearconStyles"
        style="margin-top:4em"
        v-intersect="onIntersect"
      >
        <div class="containerTicket divcol relative">
          <h3 class="tcenter h6-em">Choose your pass</h3>
          <img
            class="ticket"
            :src="
              require(`@/assets/pass/${
                passTicket == 1
                  ? 'general-admision'
                  : passTicket == 2
                  ? 'press-pass'
                  : passTicket == 3
                  ? 'speaker-pass'
                  : passTicket == 4
                  ? 'sponsor-pass'
                  : null
              }.svg`)
            "
            alt="Ticket"
          />
          <!-- <v-btn class="arrows" icon @click="passTicket>1?passTicket--:null" :class="{active: passTicket>1}" :disabled="passTicket==1">
            <img src="@/assets/icons/arrow-circle-left.svg">
          </v-btn>
          <v-btn class="arrows" icon @click="passTicket<4?passTicket++:null" :class="{active: passTicket<4}" :disabled="passTicket==4">
            <img src="@/assets/icons/arrow-circle-right.svg">
          </v-btn> -->
        </div>
        <div class="contenedor_aside divcol fill-w">
          <aside class="divrow">
            <span class="h8-em space" style="width: 100%; gap: 0.5em">
              <strong class="number">{{ tokens_disponibles }}</strong> of
              <strong class="number">{{ tokens_totales }}</strong> available
            </span>
          </aside>
          <aside class="relative">
            <v-text-field
              disabled
              type="number"
              hide-spin-buttons
              :hide-details="true"
              solo
              v-model="cantidad"
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
              <span style="margin-left: 0.5em" class="h8-em number">{{
                price
              }}</span>
            </div>
            <span class="h8-em number">~ {{ ultimoprecio }} $USD</span>
          </aside>
        </div>
        <div style="gap: 1em" class="divcol fill-w">
          <v-btn  :disabled="progress" @click="batchMakeOffer()" class="payTicket h8-em bold">
             <div  v-show="!progress"> Pay with NEAR</div>
            <v-progress-circular
              v-show="progress"
              :size="30"
              indeterminate
            ></v-progress-circular>
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
const axios = require("axios");
import gql from "graphql-tag";
import { Wallet, Chain, Network } from "mintbase";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
const { connect, keyStores, WalletConnection, utils } = nearAPI;
const things_by_pk = gql`
  {
    things_by_pk(
      id: "dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw:nearcon2.mintbase1.near"
    ) {
      id
      metadata {
        category
        description
        extra
        media
        document
        title
      }
      tokens {
        id
        burnedAt
        list {
          price
          acceptedOfferId
          offer {
            price
          }
        }
        ownerId
        minter
        lists {
          price
          removedAt
          id
          acceptedOfferId
        }
      }
    }
  }
`;
const tokens_aggregate = gql`
  {
    tokens_aggregate(
      where: {
        thingId: {
          _eq: "dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw:nearcon2.mintbase1.near"
        }
        burnedAt: { _is_null: true }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
const lists_aggregate = gql`
  {
    lists_aggregate(
      where: {
        thingId: {
          _eq: "dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw:nearcon2.mintbase1.near"
        }
        removedAt: { _is_null: true }
      }
    ) {
      aggregate {
        count
        min {
          price
        }
      }
    }
  }
`;
export default {
  name: "Nearcon",
  apollo: {
    tokens_aggregate: {
      query: tokens_aggregate,
    },
    lists_aggregate: {
      query: lists_aggregate,
    },
  },
  data() {
    return {
      passTicket: 1,
      tittle: "",
      duneticket: "",
      cantidad: 1,
      progress: false,
      location: "",
      dialog: false,
      ultimoprecio: null,
      Datos: {
        about: {
          event: {
            text: "<p>Join us in Lisbon from September 11th - 14th for the second annual NEARCON. Expect 2,000+ attendees from the NEAR & Web3 ecosystem, and 200+ hackers. This will be our biggest event yet.</p><p>At NEARCON experience, you will experience:</p><p><strong>Lasting connections</strong> - Networking opportunities to connect and build lasting relationships with the NEAR Community and Ecosystem.</p><p><strong>Range of discussions</strong> - Talks on Future of Finance, NFTs, Governance, Sustainability, Gaming, Protocol Updates, Developer Tools, and more.</p><p><strong>IRL Hackaton</strong> - Hackers get in free :) Win prizes, get onstage for a live “Dragon’s Den” with crypto titans, and most importantly… have fun building!</p>",
          },
          venue: {
            text: "<p><strong>September 10th - 17th: </strong>NEARCON Week</p><p><strong>September 11th - Registration Party! [2pm - 8pm]</strong><br>Beat the lines, pick up your pass, swag bag, vibe with resident DJ, network, sip on libations, snack on tacos, and more.</p><strong>September 12th - 14th</strong><br>Doors open at 10am for light breakfast and networking, score a good seat for content sessions that kick off at 11am and continue until 5pm. 5pm - 8pm | Happy Hour and sunset sets with resident DJ on the waterfront, Good drinks. Good food. GREAT people [YOU! :)].",
          },
          // movie: {
          //   text: "<p><strong>Plot: </strong>As the AIDS epidemic tears through their community during the early 90’s, the members of ACT UP Paris are fighting for survival. While they battle against governmental apathy, pharmaceutical greed and public ignorance, they also go out partying, debate politics and, occasionally, fall in love. One day, as outspoken radical Sean (Nahuel Pérez Biscayart) strikes up a conversation with shy newcomer Nathan (Arnaud Valois), they have no idea that their lives are about to change forever.",
          // },
          //  info: [
          //   {
          //     title: "Director:",
          //     text: "Robin Campillo",
          //   },
          //   {
          //     title: "Actors:",
          //     text: "Nahuel Pérez Biscayart, Arnaud Valois, Adèle Haenel ",
          //   },
          //   {
          //     title: "Country:",
          //     text: "France | Year: 2017 | Length: 2h 23m",
          //   },
          //   {
          //     title: "Audio:",
          //     text: "French | Subtitles: English | PG: M/16",
          //   },
          // ],
          // cancelation: "",
        },
        location: "Cais da Viscondessa, 1200-109 Lisboa, Portugal",
        details: {
          storage_gateaway: "https://arweave.net",
          transactions_id: "dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw",
          contract: "nearcon2.mintbase1.near",
          thing_id:
            "dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw:nearcon2.mintbase1.near",
        },
      },
      metadata: null,
      tokens_totales: null,
      isIntersecting: false,
      tokens_disponibles: null,
      price: null,
      precio_token_usd: null,
      tokens_buy: [],
      precio_yocto: null,
      ret: null,
      hash: "",
    };
  },
  mounted() {
    this.gettokens();
    this.$emit("renderHeader");
    setTimeout(() => {
      this.traerdatos();
      this.NearUsd();
      // this.loginNear()
      this.NEARyoctoNEAR();
    }, 2000);
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
        "/events/dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw:nearcon2.mintbase1.near/#/"
      );
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/events/dfnswq0LaXwNgGzqdW0-YPJLtTxc-fhQlLk8k1UCcJw:nearcon2.mintbase1.near/#/"
      );
    }
  },
  methods: {
    async gettokens() {
      this.progress = true
      this.$apollo
        .query({
          query: things_by_pk,
        })
        .then((data) => {
          this.ret = data.data.things_by_pk;
          var cantidad_tokens = 0;
          this.ret.tokens.forEach((element) => {
            if (
              element.ownerId === "nearcon2.near" &&
              !this.tokens_buy.includes(element.id) &&
              cantidad_tokens < 1
            ) {
              cantidad_tokens++;
              console.log(element.id);
              this.tokens_buy.push(element.id);
            }
          });
          console.log(this.ret);
           this.progress = false
          return this.ret; // this returns to the above promise, not the overall function
        });
    },
    NEARyoctoNEAR: function () {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(1);
      console.log(amountInYocto);
      return amountInYocto;
    },
    async traerdatos() {
      this.tittle = "Nearcon";
      this.tokens_totales = this.tokens_aggregate.aggregate.count;
      this.tokens_disponibles = this.lists_aggregate.aggregate.count;
      this.price = this.lists_aggregate.aggregate.min.price;
      this.yoctoNEARNEAR(this.price);
    },
    NearUsd() {
      var BINANCE_NEAR =
        "https://api.binance.com/api/v3/ticker/24hr?symbol=NEARUSDT";
      var request = new XMLHttpRequest();
      request.open("GET", BINANCE_NEAR);
      request.send();
      request.onload = () => {
        this.lastPricee = JSON.parse(request.responseText);
        this.ultimoprecio = parseFloat(
          this.lastPricee.lastPrice * this.price
        ).toFixed(2);
        this.precio_token_usd = this.lastPricee.lastPrice;
      };
    },
    yoctoNEARNEAR: function (yoctoNEAR) {
      const amountInNEAR = utils.format.parseNearAmount(
        this.formatPrice(yoctoNEAR).toString()
      );
      this.yoctoNEARNEAR2(amountInNEAR);
      this.precio_yocto = amountInNEAR;
    },
    yoctoNEARNEAR2: function (yoctoNEAR) {
      const amountInNEAR = utils.format.formatNearAmount(yoctoNEAR);
      this.price = amountInNEAR;
      return amountInNEAR.toString();
    },
    formatPrice(price) {
      return Number(
        utils.format.formatNearAmount(
          price.toLocaleString("fullwide", { useGrouping: false })
        )
      );
    },
    controlAmount(item) {
      this.traerdatos();
      var cantidad_tokens = 0;
      this.tokens_buy = [];
      if (item == "more" && this.cantidad < this.tokens_disponibles) {
        this.cantidad++;
        this.price = parseFloat(this.price * this.cantidad).toFixed(1);
        this.ultimoprecio = parseFloat(
          this.price * this.precio_token_usd
        ).toFixed(2);
        this.ret.tokens.forEach((element) => {
          if (
            element.ownerId === "nearcon2.near" &&
            !this.tokens_buy.includes(element.id) &&
            cantidad_tokens < this.cantidad
          ) {
            cantidad_tokens++;
            this.tokens_buy.push(element.id);
          }
        });
      }
      if (item == "less" && this.cantidad > 1) {
        this.cantidad--;
        this.price = this.price * this.cantidad;
        this.ultimoprecio = parseFloat(
          this.price * this.precio_token_usd
        ).toFixed(2);
        this.ret.tokens.forEach((element) => {
          if (
            element.ownerId === "nearcon2.near" &&
            !this.tokens_buy.includes(element.id) &&
            cantidad_tokens < this.cantidad
          ) {
            cantidad_tokens++;
            this.tokens_buy.push(element.id);
          }
        });
      }
    },

    //   async  makeOffer() {
    //   let API_KEY = "c45bd9f9-b880-4e1e-9ecb-c71309348a7d"
    //   const { data: walletData } = await new Wallet().init({
    //     networkName: Network.mainnet,
    //     chain: Chain.near,
    //     apiKey: API_KEY,
    //   })
    //   const { wallet } = walletData
    //        let tokenid = ""
    //        this.things_by_pk.tokens.forEach(element => {
    //           if (element.list.offer === null){
    //               tokenid = element.id
    //           }
    //       });
    //      wallet.makeOffer(
    //       tokenid.toString(),
    //       "1500000000000000000000000",
    //        ).then(() => {
    //    })
    // },
    onIntersect(entries) {
      this.isIntersecting = entries[0].isIntersecting;
    },
    async batchMakeOffer() {
      let API_KEY = "c45bd9f9-b880-4e1e-9ecb-c71309348a7d";
      const { data: walletData } = await new Wallet().init({
        networkName: Network.mainnet,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;
      var prices_tokens = [];
      this.tokens_buy.forEach((element) => {
        prices_tokens.push(this.precio_yocto.toString());

        console.log(element);
      });
      wallet
        .batchMakeOffer(
          this.tokens_buy,
          prices_tokens
          //  "75000000000000", // attached GAS (optional)
        )
        .then(() => {});
    },
  },
};
</script>

<style src="../pages.scss" lang="scss"></style>
<style src="./nearcon.scss" lang="scss" />
