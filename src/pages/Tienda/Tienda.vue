<template>
  <section id="tienda" class="center align divcol">
    <aside>
    <!-- new -->
      <img class="eliminarmobile" src="@/assets/img/Kingrichard.png" alt="Background Image">
      <img class="vermobile" src="@/assets/img/Kingrichard.png" alt="Background Image">
    <!-- new -->
      <div class="fill-w limiter align">
        <v-chip color="rgba(0, 0, 0, 0.3)">MAY 30</v-chip>
        <h2>{{tittle}}</h2>
        <span>Black Cat Cinema</span>
      </div>
    </aside>

    <aside v-for="(item, index) in Datos" :key="index" class="jspace divcolmobile gapmobile acentermobile limiter">
      <div v-if="!isIntersecting" class="floatButton vermobile">
        <div class="fill-w">
          <v-btn class="h8-em fill-w" href="#buy">Buy a ticket</v-btn>
        </div>
      </div>

      <div class="contleft divcol fill-wmobile">
        <aside class="divcol">
          <h3 class="h7-em">About</h3>
          <div class="conttitles">
            <p v-for="(i, index) in item.titles" :key="index" class="h8-em tittles">
              <strong> {{ i.titles }}</strong> {{ i.Text }}
            </p>
          </div>

          <p v-for="(i, index) in item.info" :key="index" class="h8-em">
            {{ i.paragraph }}
          </p>
        </aside>

        <aside class="contLocation divcol">
          <h3 class="h7-em">Location</h3>
          <iframe
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDMtqgnD-Nbr_gk04K5H9HegRvnjvG7Fms&q=Av. Infante Dom Henrique, 1900-319 Lisboa, Portugal"
            allowfullscreen>
          </iframe>
          <p class="h8-em" style="display:flex; align-items: flex-end; gap: .5em">
            <img :src="item.location.icon" :alt="item.location.icon" />
            Av. Infante Dom Henrique, 1900-319 Lisboa, Portugal
          </p>
        </aside>

        <aside class="divcol">
          <h3 class="h7-em">Details</h3>
          <aside class="contDetails">
            <p v-for="(i, index) in item.details" :key="index" class="h8-em tittles">
              <strong>{{ i.titlesDetails }}</strong><br>{{ i.TextDetails }}
            </p>
          </aside>
        </aside>
      </div>

      <article id="buy" class="divcol acenter" v-intersect="onIntersect" >
        <img :src="duneticket" alt="Ticket" />
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
            <img src="@/assets/logo/logonear.png" alt="Logo near" />
            <span class="h8-em number">{{price}}</span>
          </div>
          <span class="tend">~ {{ultimoprecio}} $USD</span>
        </aside>
        </div>
        <div style="gap:1em" class="divcol fill-w">
          <v-btn @click="batchMakeOffer()" class="paywallet h8-em"> Pay with NEAR </v-btn>
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
      duneticket: '',
      cantidad: 1,
      location: '',
      dialog: false,
      ultimoprecio: null,
      Datos: {
        about: {
          titles: [
            {
              titles: "Director:",
              Text: " Bong Joon Ho",
            },
            {
              titles: "Actors:",
              Text: " Kang-ho Song, Sun-kyun Lee, Yeo-jeong Cho ",
            },
            {
              titles: "Country:",
              Text: " Korea | Year: 2019",
            },
            {
              titles: "Audio:",
              Text: " Korean | Subtitles: English | PG: M/14",
            },
            {
              titles: "Lenght:",
              Text: " 2h 16m ",
            },
          ],
          info: [
            {
            paragraph: 
              "The struggling Kim family sees an opportunity when the son starts working for the wealthy Park family. Soon, all of them find a way to work within the same household and start living a parasitic life.",
            },
            {
            paragraph:
              "Parasite’ gained a lot of international recognition and won some of the biggest awards in the film industry, including Best Picture at the Academy Awards, the Palme d’Or at the Cannes Film Festival, and the BAFTA Award for Best Film Not in the English Language.",
            }
          ],
          location: {
            icon: require("@/assets/logo/Marker.png"),
            Text: " Arroz Estúdios – Av. Infante Dom Henrique Lisboa, Xabregas ",
          },
          details: [
            {
              titlesDetails: "Storage Gateaway",
              TextDetails: "https://arweave.net",
            },
            {
              titlesDetails: "Transactions ID",
              TextDetails: "vIjQFtDJQDg7EjtCiUSlq-2DuM968am82IoDptKufPc",
            },
            {
              titlesDetails: "Contract",
              TextDetails: "mintickt.mintbase1.near",
            },
            {
              titlesDetails: "Thing ID",
              TextDetails: "vIjQFtDJQDg7EjtCiUSlq-2DuM968am82IoDptKufPc:mintickt.mintbase1.near",
            },
          ]
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
        this.price = 1.5 * this.cantidad
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
          this.price = 1.5 * this.cantidad
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
