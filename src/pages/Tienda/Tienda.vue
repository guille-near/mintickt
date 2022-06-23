<template>
  <section id="tienda" class="center align divcol">
    <aside>
      <!-- new -->
       <img class="eliminarmobile" src="@/assets/img/NYCbackground.png" alt="Background Image">
      <img class="vermobile" src="@/assets/img/NYCbackground.png" alt="Background Image">
      <!-- new -->
      <!-- new -->
      <div class="fill-w limiter align">
        <v-chip color="rgba(0, 0, 0, 0.3)">JUN 23</v-chip>
        <h2>{{tittle}}</h2>
        <span>Palomas BK</span>
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
            <h3 class="p h7-em">About this event:</h3>
            <p class=" h8-em" v-html="Datos.about.event.text" />
          </div>

          <div v-if="Datos.about.venue" class="divcol h8-em">
            <h3 class="p h7-em">About Near NYC:</h3>
            <p class=" h8-em" v-html="Datos.about.venue.text" />
          </div>

          <div v-if="Datos.about.movie" class="divcol h8-em">
            <p style="margin-block: 0em 1em !important"><strong>Movie Information:</strong></p>
            <p v-html="Datos.about.movie.text" />
          </div>

          <div v-if="Datos.about.info" class="conttitles">
            <p v-for="(item,i) in Datos.about.info" :key="i" class="h8-em tittles">
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
          <p class="h8-em" style="display:flex; align-items: flex-end; gap: .5em; margin-bottom: 1em;">
            <img src="@/assets/logo/Marker.svg" alt="marker icon" />
            {{Datos.location}}
          </p>
          <iframe
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDMtqgnD-Nbr_gk04K5H9HegRvnjvG7Fms&q=palomabk"
            allowfullscreen>
          </iframe>
        </aside>

        <aside class="divcol">
          <!-- <h3 class="h7-em">Details</h3> -->
          <aside class="contDetails">
            <p v-for="(item, i) in Datos.details" :key="i" class="h8-em tittles">
              <strong>{{ item.titlesDetails }}</strong>
              <br>{{ item.textDetails }}
            </p>
          </aside>
        </aside>
      </div>

      <article id="buy" class="divcol acenter" v-intersect="onIntersect" >
        <img src="@/assets/img/nyc landing.png" alt="Ticket" />
        <div class="contenedor_aside divcol fill-w">
        <aside class="divrow">
          <span class="h8-em space" style="width: 100%; gap: .5em">
            <strong class="number">{{tokens_disponibles}}</strong> of <strong class="number">{{tokens_totales}}</strong> available
          </span>
        </aside>
        <aside class="relative">
          <v-text-field  disabled  type="number" hide-spin-buttons :hide-details="true" solo v-model="cantidad">
          </v-text-field>
            <div class="contenedor_botones">
              <v-btn color=" #C4C4C4" @click="controlAmount('less')">
                  <v-icon color="black">
                    mdi-minus
                  </v-icon>
                </v-btn>
                <v-btn color=" #C4C4C4" @click="controlAmount('more')">
                  <v-icon color="black">
                    mdi-plus
                  </v-icon>
                </v-btn>
            </div>
        </aside>

        <aside class="space">
          <div class="divrow acenter">
            <img src="@/assets/logo/logonear.svg" alt="Logo near" />
            <span class="h8-em number">{{price}}</span>
          </div>
          <span class="tend">~ {{ultimoprecio}} $USD</span>
        </aside>
        </div>
        <div style="gap:1em" class="divcol fill-w">
          <v-btn @click="batchMakeOffer()" class="paywallet h8-em"> Get your ticket </v-btn>
          <!-- <v-btn @click="batchtransfer" class="paycard h8-em"> Pay with card </v-btn> -->
        </div>
      </article>
       <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
         View transaction in explorer
        </v-card-title>

        <v-card-text>
         <center  style="margin-top: 2.5em" >   <a target="_blank" :href= hash >Explorer transaction</a> </center>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </aside>
  </section>
  
</template>

<script>
const axios = require('axios');
import gql from 'graphql-tag'
import { Wallet, Chain, Network } from 'mintbase'
import * as nearAPI from "near-api-js"
import { CONFIG } from "@/services/api"
const { connect, keyStores, WalletConnection, utils ,} = nearAPI
export default {
  name: "Tienda",
  apollo: {
    things_by_pk: {
       query: gql`{
   things_by_pk(id: "JHAaTXCxCoomlZ2WktgmVHBx2hAPEZfSiDxd1kMxNXc:mintickt.mintbase1.near") {
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
      lists {
        price
        removedAt
      }
    }
  }
}
`,
    },
  },
  data() {
    return {
      tittle: '',
      duneticket: '',
      cantidad: 1,
      location: '',
      dialog: false,
      ultimoprecio: null,
      Datos: {
        about: {
          event: {
            text: "Come join a social that also aims to educate NFT NYC goers on the ecosystem and projects on NEAR as well as community building. Open to all, with an emphasis on founders, developers, and creators striving to address problems within their communities. First we will start with a 30 minute panel, followed by a beginner's salsa lesson by the Cuban Salsa School of Fuakata. Event will emphasize participation of minority populations like latinx communities, and will pay homage to one of the greatest forms of artistic expression, dance.",
          },
          venue: {
            text: "<p>NEAR NYC is the official NEAR Protocol community of NYC. NEAR is a collective, a foundation, and a development platform built on a new layer-one blockchain. Through simple, secure, and scalable technology, NEAR empowers millions to invent and explore new experiences. Business, creativity, and community are being reimagined for a more sustainable and inclusive future.Learn more at https://near.org/ and check out the NYC community at https://linktr.ee/nearnyc",
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
          cancelation: "",
        },
        location: "Palomas Bk - 1 Knickerbocker Avenue, Brooklyn, NY 11237",
      //  details: [
      //     {
      //       titlesDetails: "Storage Gateaway",
      //       textDetails: "https://arweave.net",
      //     },
      //     {
      //       titlesDetails: "Transactions ID",
      //       textDetails: "crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY",
      //     },
      //     {
      //       titlesDetails: "Contract",
      //       textDetails: "mintickt.mintbase1.near",
      //     },
      //     {
      //       titlesDetails: "Thing ID",
      //       textDetails: "crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY:mintickt.mintbase1.near",
      //     },
      //   ]
      },
      metadata: null,
      tokens_totales: null,
      isIntersecting: false,
      tokens_disponibles: null,
      price: null,
      precio_token_usd: null,
      tokens_buy: [],
      precio_yocto: null,
      hash: "",
    };
  },
  mounted(){
        setTimeout(() => {
      this.traerdatos().then( (res) => {
          var cantidad_tokens = 0
           this.things_by_pk.tokens.forEach(element => {
            if (element.ownerId === "mintickt.near" && !this.tokens_buy.includes(element.id) && cantidad_tokens < 1 ){
              cantidad_tokens++
              this.tokens_buy.push(element.id)
            }
        });
      }) 
      this.NearUsd()
      // this.loginNear()
      this.NEARyoctoNEAR()
    }, 3000);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes")
    this.hash = "https://explorer.mainnet.near.org/transactions/" + urlParams.get("transactionHashes")
    if (urlParams.get("transactionHashes") !== null) {
      console.log('aqui' + urlParams.get("transactionHashes"))
      this.dialog = true
      history.replaceState(null, location.href.split("?")[0], '/events/crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY:mintickt.mintbase1.near/#/');
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(null, location.href.split("?")[0], '/events/crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY:mintickt.mintbase1.near/#/');
    }
  },
  methods: {

    NEARyoctoNEAR: function() {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(1);
      console.log(amountInYocto);      return amountInYocto;
    },
   async traerdatos(){
        this.tittle =  "NEAR NYC Salsa Social"
        this.tokens_totales =  this.things_by_pk.tokens.length
        // this.location = this.things_by_pk.metadata.extra.location.value
        this.cantidad_disponible = 0
        this.things_by_pk.tokens.forEach(element => {
          if (element.ownerId === "mintickt.near"){
              this.cantidad_disponible = this.cantidad_disponible +1
          }
        });
        this.tokens_disponibles =  this.cantidad_disponible
        this.things_by_pk.tokens[0].lists.forEach(element => {
          if (element.removedAt === null){
             this.yoctoNEARNEAR(element.price)
          }
        });
    },
    NearUsd(){
      var BINANCE_NEAR = "https://api.binance.com/api/v3/ticker/24hr?symbol=NEARUSDT"
      var request = new XMLHttpRequest();
      request.open("GET", BINANCE_NEAR);
      request.send();
      request.onload = () => {
        this.lastPricee = JSON.parse(request.responseText);
        this.ultimoprecio = parseFloat(this.lastPricee.lastPrice * this.price).toFixed(2)
        this.precio_token_usd = this.lastPricee.lastPrice
      };
    },
    yoctoNEARNEAR: function(yoctoNEAR) {
      const amountInNEAR = utils.format.parseNearAmount((this.formatPrice(yoctoNEAR)).toString())
      this.yoctoNEARNEAR2(amountInNEAR)
      this.precio_yocto = amountInNEAR
    },
    yoctoNEARNEAR2: function(yoctoNEAR) {
      const amountInNEAR = utils.format.formatNearAmount(yoctoNEAR);
      this.price = amountInNEAR
      console.log(this.price)
      return amountInNEAR.toString();
    },
    formatPrice (price) {
      return Number(utils.format.formatNearAmount(price.toLocaleString('fullwide', { useGrouping: false })))
    },
    controlAmount(item) {
      this.traerdatos()
      var cantidad_tokens = 0
      this.tokens_buy = []
      if (item == 'more' && this.cantidad < this.tokens_disponibles) { 
        this.cantidad++ 
        this.price = parseFloat(this.price  * this.cantidad).toFixed(1)
        this.ultimoprecio =  parseFloat(this.price * this.precio_token_usd).toFixed(2)
        this.things_by_pk.tokens.forEach(element => {
          if (element.ownerId === "mintickt.near" && !this.tokens_buy.includes(element.id) && cantidad_tokens < this.cantidad ){
            cantidad_tokens++
            this.tokens_buy.push(element.id)
          }
          console.log(this.tokens_buy)
      });
    
      }
      if (item == 'less' && this.cantidad > 1) { 
          this.cantidad-- 
          this.price =  this.price  * this.cantidad
          this.ultimoprecio =  parseFloat(this.price * this.precio_token_usd).toFixed(2)
          this.things_by_pk.tokens.forEach(element => {
          if (element.ownerId === "mintickt.near" && !this.tokens_buy.includes(element.id) && cantidad_tokens < this.cantidad ){
            cantidad_tokens++
            this.tokens_buy.push(element.id)
          }
          console.log(this.tokens_buy)
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
    onIntersect (entries) {
      this.isIntersecting = entries[0].isIntersecting    },
async  batchMakeOffer() {
  let API_KEY = "c45bd9f9-b880-4e1e-9ecb-c71309348a7d"
  const { data: walletData } = await new Wallet().init({
    networkName: Network.mainnet,
    chain: Chain.near,
    apiKey: API_KEY,
  })
  const { wallet } = walletData
      var prices_tokens = []
      this.tokens_buy.forEach(element => {
        prices_tokens.push(this.precio_yocto.toString())
        
        console.log(element)
      });
      wallet.batchMakeOffer( 
      this.tokens_buy,
      prices_tokens
      ,
      //  "75000000000000", // attached GAS (optional)
       ).then(() => {
   })
},
  }
};
</script>

<style src="../pages.scss" lang="scss" />
