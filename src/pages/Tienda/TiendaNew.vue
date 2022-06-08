<template>
  <section id="tienda" class="center align divcol">
    <aside>
      <!-- new -->
      <img class="eliminarmobile" src="@/assets/img/bg_tienda.png" alt="Background Image">
      <img class="vermobile" src="@/assets/img/bg_tienda-mobile.png" alt="Background Image">
      <!-- new -->
      <div class="fill-w limiter align">
        <v-chip color="rgba(0, 0, 0, 0.3)">MAY 30</v-chip>
        <h2>{{tittle}}</h2>
        <span>Black Cat Cinema</span>
      </div>
    </aside>

    <aside class="jspace divcolmobile gapmobile acentermobile limiter">
      <div v-if="!isIntersecting" class="floatButton vermobile">
        <div class="fill-w">
          <v-btn class="h8-em fill-w" href="#buy">Buy a ticket</v-btn>
        </div>
      </div>

      <div class="contleft divcol fill-wmobile">
        <aside v-if="Datos.lineUp" class="divcol">
          <h3 class="h7-em">Line up</h3>

          <v-slide-group
            center-active
            :show-arrows="false"
            class="wrapper_lineUp"
          >
            <v-slide-item v-for="(item,i) in Datos.lineUp.dataLineUp" :key="i">
              <v-card color="transparent" style="display:flex">
                <img :src="item.img" alt="Dj image">
                <h4>{{item.name}}</h4>
              </v-card>
            </v-slide-item>
          </v-slide-group>

          <p><strong style="color:#FF37BB">Dj Sets </strong>{{Datos.lineUp.djSet}}</p>
        </aside>

        <aside v-if="Datos.about" class="aboutSection divcol">
          <h3 class="h7-em">About</h3>

          <div v-if="Datos.about.event" class="divcol h8-em">
            <p class="p"><strong>Event Information:</strong></p>
            <p>{{Datos.about.event.text}}</p>
            <p v-if="Datos.about.event.text2" class="margintop">{{Datos.about.event.text2}}</p>
            <p v-if="Datos.about.event.text3" class="margintop">{{Datos.about.event.item.text3}}</p>
          </div>

          <div v-if="Datos.about.venue" class="divcol h8-em">
            <p class="p"><strong>Venue Information:</strong></p>
            <p>{{Datos.about.venue.text}}</p>
            <p v-if="Datos.about.venue.text2" class="margintop">{{Datos.about.venue.text2}}</p>
            <p v-if="Datos.about.venue.text3" class="margintop">{{Datos.about.venue.text3}}</p>
          </div>

          <div v-if="Datos.about.movie" class="divcol h8-em">
            <p class="p"><strong>Movie Information:</strong></p>
            <p class="margintop">
              <strong v-if="Datos.about.movie.boldText">{{Datos.about.movie.boldText}} </strong>
              {{Datos.about.movie.text}}
            </p>
            <p v-if="Datos.about.movie.text2" class="margintop">
              <strong v-if="Datos.about.movie.boldText2">{{Datos.about.movie.boldText2}} </strong>
              {{Datos.about.movie.text2}}
            </p>
            <p v-if="Datos.about.movie.text3" class="margintop">
              <strong v-if="Datos.about.movie.boldText3">{{Datos.about.movie.boldText3}} </strong>
              {{Datos.about.movie.text3}}
            </p>
          </div>

          <div v-if="Datos.about.info" class="conttitles">
            <p v-for="(item,i) in Datos.about.info" :key="i" class="h8-em tittles">
              <strong>{{ item.title }} </strong>{{ item.text }}
            </p>
          </div>

          <!-- <div class="divcol h8-em">
            <p class="p"><strong>Cancelation &amp; Weather Policy::</strong></p>
            <p>
              If you need to change your ticket, a full refund is available 
              up to 48 hours before the start of the event. A 50% refund is 
              available for cancellations made 48 - 24 hours before the event 
              starts. We are sorry but any cancellations made less than 
              24 hours in advance are non-refundable.
            </p>
            <p class="margintop">
              In case of rain, the event will continue. If there's heavy 
              rain, we will continue with the film in the indoor area.
            </p>
          </div> -->
        </aside>

        <aside class="contLocation divcol">
          <h3 class="h7-em">Location</h3>
          <iframe
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDMtqgnD-Nbr_gk04K5H9HegRvnjvG7Fms&q=Arroz Estúdios"
            allowfullscreen>
          </iframe>
          <p class="h8-em" style="display:flex; align-items: flex-end; gap: .5em">
            <img src="@/assets/logo/Marker.svg" alt="marker icon" />
            {{Datos.location}}
          </p>
        </aside>

        <aside class="divcol">
          <h3 class="h7-em">Details</h3>
          <aside class="contDetails">
            <p v-for="(item, i) in Datos.details" :key="i" class="h8-em tittles">
              <strong>{{ item.titlesDetails }}</strong>
              <br>{{ item.textDetails }}
            </p>
          </aside>
        </aside>
      </div>

      <article id="buy" class="divcol acenter" v-intersect="onIntersect" >
        <img src="@/assets/img/claim-nft.svg" alt="Ticket" />
        <div style="gap:1em" class="divcol fill-w">
          <v-btn class="paywallet h8-em">Claim your NFT ticket</v-btn>
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
  things_by_pk(id: "vIjQFtDJQDg7EjtCiUSlq-2DuM968am82IoDptKufPc:mintickt.mintbase1.near") {
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
    }
  }
}
`,
    },
  },
  data() {
    return {
      tittle: '',
      // ticket nft //
      duneticket: '',
      cantidad: 1,
      location: '',
      dialog: false,
      ultimoprecio: null,
      Datos: {
        lineUp: {
          djSet: "by Alex Jordan, Lunary, Os NinetyFive, HeartBreakSeason, AntPuke, WinterWrong, Low Earth, Orbit, Alien,The Princess Khai and Marte.",
          dataLineUp: [
            {
              img: require("@/assets/djs/robb-banks.png"),
              name: "Robb Banks",
            },
            {
              img: require("@/assets/djs/babyG.png"),
              name: "BabyG",
            },
            {
              img: require("@/assets/djs/k-charles.png"),
              name: "K.Charles",
            },
            {
              img: require("@/assets/djs/lxui-savage.png"),
              name: "Lxui Savage",
            },
          ],
        },
        // about: {
        //   event: {
        //     text: "The movie starts at 21:00. The bar opens for drinks and music from 19:00. Pizzas and popcorn are available from 20:00. We always recommend bringing a warm jacket and/or blanket.",
        //   },
        //   venue: {
        //     text: "Arroz Estúdios is a members-only, non-profit Cultural Association based in the Beato area of East Lisbon. If you're not already a member of the club, a 1-year membership is just €3 (cash only) at the door.",
        //     text2: "Food, drinks, and popcorn are available before, during, and after the film. The bar has a wide range of beer, wine, cocktails, and soft drinks. The kitchen serves delicious, authentically-made wood fire pizza. Please note, it's cash only for pizza and popcorn!",
        //   },
        //   movie: {
        //     boldtext: "Plot:",
        //     text: "Armed with a clear vision Richard Williams is determined to write his two daughters, Venus and Serena, into history. Training on tennis courts in Compton, California, Richard shapes the girls' unyielding commitment and keen intuition. Together, the Williams family defies seemingly insurmountable odds and the prevailing expectations laid before them.",
        //     text2: "Unfortunately, the accident by Will Smith with presentator Chris Rock overshadowed the latest Academy Awards, where Smith won the Oscar for Best Actor in a Leading Role for his outstanding performance as father Richard of the world-famous Williams sisters.",
        //   },
        //   info: [
        //     {
        //       title: "Director:",
        //       text: "Reinaldo Marcus Green",
        //     },
        //     {
        //       title: "Actors:",
        //       text: "Will Smith, Aunjanue Ellis, Jon Bernthal",
        //     },
        //     {
        //       title: "Country:",
        //       text: "USA | Year: 2021 | Length: 2h 24m",
        //     },
        //     {
        //       title: "Audio:",
        //       text: "English | Subtitles: Portuguese | PG: M/12",
        //     },
        //   ],
        // },
        location: "Av. Infante Dom Henrique, 1900-319 Lisboa, Portugal",
        details: [
          {
            titlesDetails: "Storage Gateaway",
            textDetails: "https://arweave.net",
          },
          {
            titlesDetails: "Transactions ID",
            textDetails: "vIjQFtDJQDg7EjtCiUSlq-2DuM968am82IoDptKufPc",
          },
          {
            titlesDetails: "Contract",
            textDetails: "mintickt.mintbase1.near",
          },
          {
            titlesDetails: "Thing ID",
            textDetails: "vIjQFtDJQDg7EjtCiUSlq-2DuM968am82IoDptKufPc:mintickt.mintbase1.near",
          },
        ]
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes")
    this.hash = "https://explorer.mainnet.near.org/transactions/" + urlParams.get("transactionHashes")
    if (urlParams.get("transactionHashes") !== null) {
      console.log('aqui' + urlParams.get("transactionHashes"))
      this.dialog = true
      history.replaceState(null, location.href.split("?")[0], '/events/ZJdegansubNv80mSfHKGYbabAYZdkQ3vd7lzQ-Sb27U:mintickt.mintbase1.near/#/');
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(null, location.href.split("?")[0], '/events/ZJdegansubNv80mSfHKGYbabAYZdkQ3vd7lzQ-Sb27U:mintickt.mintbase1.near/#/');
    }
    
    setTimeout(() => {
      this.traerdatos().then( (res) => {
          var cantidad_tokens = 0
           this.things_by_pk.tokens.forEach(element => {
            if (element.list.offer === null && !this.tokens_buy.includes(element.id) && cantidad_tokens < 1 ){
              cantidad_tokens++
              this.tokens_buy.push(element.id)
            }
        });
      }) 
      this.NearUsd()
      // this.loginNear()
      this.NEARyoctoNEAR()
    }, 1000);
    
  },
  methods: {

    NEARyoctoNEAR: function() {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(1);
      console.log(amountInYocto);      return amountInYocto;
    },
   async traerdatos(){
        this.duneticket ="https://arweave.net/KXDzhoCAHf2nyOluc8gkCQepFWyNnDy-0WNhFNgL61Q"
        this.tittle =  this.things_by_pk.metadata.title
        this.tokens_totales =  this.things_by_pk.tokens.length
        // this.location = this.things_by_pk.metadata.extra.location.value
        this.cantidad_disponible = 0
        this.things_by_pk.tokens.forEach(element => {
          if (element.list.offer === null){
              this.cantidad_disponible = this.cantidad_disponible +1
          }
        });
        this.tokens_disponibles =  this.cantidad_disponible
        this.yoctoNEARNEAR(this.things_by_pk.tokens[0].list.price)
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
          if (element.list.offer === null && !this.tokens_buy.includes(element.id) && cantidad_tokens < this.cantidad ){
            cantidad_tokens++
            this.tokens_buy.push(element.id)
          }
          console.log(this.tokens_buy)
      });
    
      }
      if (item == 'less' && this.cantidad > 1) { 
          this.cantidad-- 
          this.price =  parseFloat(this.price  * this.cantidad).toFixed(1)
          this.ultimoprecio =  parseFloat(this.price * this.precio_token_usd).toFixed(2)
          this.things_by_pk.tokens.forEach(element => {
          if (element.list.offer === null && !this.tokens_buy.includes(element.id) && cantidad_tokens < this.cantidad ){
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
