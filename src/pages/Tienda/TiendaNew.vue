<template>
  <section id="tienda" class="center align divcol">
    <aside>
      <!-- new -->
      <img class="eliminarmobile" src="@/assets/img/bg_tienda.png" alt="Background Image">
      <img class="vermobile" src="@/assets/img/bg_tienda-mobile.png" alt="Background Image">
      <!-- new -->
      <div class="fill-w limiter align">
        <v-chip color="rgba(0, 0, 0, 0.3)">JUN 10</v-chip>
        <h2>{{tittle}}</h2>
        <span>Esquina de Abuela</span>
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

          <v-carousel
            v-model="Datos.lineUp.carousel"
            hide-delimiters
            :show-arrows="showCarousel==true?false:true"
            class="wrapper_lineUp"
          >
            <template v-if="showCarousel==true">
              <template v-for="(item, index) in Datos.lineUp.dataLineUp">
                <v-carousel-item
                  v-if="(index + 1) % 4 === 1 || 4 === 1"
                  :key="index"
                > 
                  <template v-for="(n,i) in 4">
                    <template v-if="(+index + i) < Datos.lineUp.dataLineUp.length">
                      <v-card color="transparent" style="display:flex" :key="i"
                        :href="Datos.lineUp.dataLineUp[+index + i].link" target="_blank">
                        <img :src="Datos.lineUp.dataLineUp[+index + i].img" alt="Dj image">
                        <h4 class="p">{{Datos.lineUp.dataLineUp[+index + i].name}}</h4>
                      </v-card>
                    </template>
                  </template>
                </v-carousel-item>
              </template>
            </template>
            
            <template v-else>
              <template v-for="(item, index) in Datos.lineUp.dataLineUp">
                <v-carousel-item
                  v-if="(index + 1) % 1 === 1 || 1 === 1"
                  :key="index"
                > 
                  <template v-for="(n,i) in 1">
                    <template v-if="(+index + i) < Datos.lineUp.dataLineUp.length">
                      <v-card color="transparent" style="display:flex" :key="i"
                        :href="Datos.lineUp.dataLineUp[+index + i].link" target="_blank">
                        <img :src="Datos.lineUp.dataLineUp[+index + i].img" alt="Dj image">
                        <h4 class="p">{{Datos.lineUp.dataLineUp[+index + i].name}}</h4>
                      </v-card>
                    </template>
                  </template>
                </v-carousel-item>
              </template>
            </template>
          </v-carousel>

          <p class="p"><strong style="color:#FF37BB">Dj Sets </strong>{{Datos.lineUp.djSet}}</p>
        </aside>

        <aside v-if="Datos.about" class="aboutSection divcol">
          <h3 class="h7-em p">About</h3>

          <div v-if="Datos.about.event" class="divcol h8-em">
            <p class="p"><strong>Event Information:</strong></p>
            <p v-html="Datos.about.event.text" />
          </div>

          <div v-if="Datos.about.venue" class="divcol h8-em">
            <p class="p"><strong>Venue Information:</strong></p>
            <p v-html="Datos.about.venue.text" />
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
          <iframe
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDMtqgnD-Nbr_gk04K5H9HegRvnjvG7Fms&q=2705 NW 22nd Ave, Miami, FL 33142, USA"
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
        <img class="ticket" :src="duneticket" alt="Ticket" />
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
  things_by_pk(id: "_PnIG4wSbOt95cdArvYIeHqzlP3fQoTLN1XDxY1SNkQ:mintickt.mintbase1.near") {
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
      showCarousel: null,
      Datos: {
        lineUp: {
          djSet: "by Alex Jordan, Lunary, Os NinetyFive, HeartBreakSeason, AntPuke, WinterWrong, Low Earth, Orbit, Alien,The Princess Khai and Marte.",
          carousel: 0,
          dataLineUp: [
            {
              img: require("@/assets/djs/robb-banks.png"),
              name: "Robb Banks",
              link: "https://open.spotify.com/artist/7KduBCxhfAMiQlhMOHL3IZ?si=7_QfGR3sTdak8HbqvyCmTg",
            },
            {
              img: require("@/assets/djs/babyG.png"),
              name: "BabyG",
              link: "https://open.spotify.com/artist/4TSbN13XStA2YH0UGvIn8x?si=rMNhGsZxTyKxX42Kk6D3WA",
            },
            {
              img: require("@/assets/djs/k-charles.png"),
              name: "K.Charles",
              link: "https://open.spotify.com/artist/4sOdMRnJPvEQJCHC4uhzns?si=A_ukVBtwSF--XL92ebWM-g",
            },
            {
              img: require("@/assets/djs/lxui-savage.png"),
              name: "Lxui Savage",
              link: "https://open.spotify.com/artist/2XJx9jQQl50YGJXUmUthsa?si=Idc2bt-3RDq5-W5d_P579w",
            },
          ],
        },
        about: {
          event: {
            text: "The movie starts at 21:00. The bar opens for drinks and music from 19:00. Pizzas and popcorn are available from 20:00. We always recommend bringing a warm jacket and/or blanket.",
          },
          venue: {
            text: "<p>Arroz Estúdios is a members-only, non-profit Cultural Association based in the Beato area of East Lisbon. If you're not already a member of the club, a 1-year membership is just €3 (cash only) at the door.</p>Food, drinks, and popcorn are available before, during, and after the film. The bar has a wide range of beer, wine, cocktails, and soft drinks. The kitchen serves delicious, authentically-made wood fire pizza. Please note, it's cash only for pizza and popcorn!",
          },
          movie: {
            text: "<p><strong>Plot: </strong>Armed with a clear vision Richard Williams is determined to write his two daughters, Venus and Serena, into history. Training on tennis courts in Compton, California, Richard shapes the girls' unyielding commitment and keen intuition. Together, the Williams family defies seemingly insurmountable odds and the prevailing expectations laid before them.</p>Unfortunately, the accident by Will Smith with presentator Chris Rock overshadowed the latest Academy Awards, where Smith won the Oscar for Best Actor in a Leading Role for his outstanding performance as father Richard of the world-famous Williams sisters.",
          },
          info: [
            {
              title: "Director:",
              text: "Reinaldo Marcus Green",
            },
            {
              title: "Actors:",
              text: "Will Smith, Aunjanue Ellis, Jon Bernthal",
            },
            {
              title: "Country:",
              text: "USA | Year: 2021 | Length: 2h 24m",
            },
            {
              title: "Audio:",
              text: "English | Subtitles: Portuguese | PG: M/12",
            },
          ],
          cancelation: "<p>If you need to change your ticket, a full refund is available up to 48 hours before the start of the event. A 50% refund is available for cancellations made 48 - 24 hours before the event starts. We are sorry but any cancellations made less than 24 hours in advance are non-refundable.</p>In case of rain, the event will continue. If there's heavy rain, we will continue with the film in the indoor area.",
        },
        location: "2705 NW 22nd Ave, Miami, FL 33142, USA",
        details: [
          {
            titlesDetails: "Storage Gateaway",
            textDetails: "https://arweave.net",
          },
          {
            titlesDetails: "Transactions ID",
            textDetails: "_PnIG4wSbOt95cdArvYIeHqzlP3fQoTLN1XDxY1SNkQ",
          },
          {
            titlesDetails: "Contract",
            textDetails: "mintickt.mintbase1.near",
          },
          {
            titlesDetails: "Thing ID",
            textDetails: "_PnIG4wSbOt95cdArvYIeHqzlP3fQoTLN1XDxY1SNkQ:mintickt.mintbase1.near",
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
    this.$emit('renderHeader');
     setTimeout(() => {
      this.traerdatos().then( (res) => {
          var cantidad_tokens = 0
           this.things_by_pk.tokens.forEach(element => {
             if (element.list !== null &&  element.ownerId === "mintickt.near" && !this.tokens_buy.includes(element.id) && cantidad_tokens < this.cantidad ){
                cantidad_tokens++
                this.tokens_buy.push(element.id)
          }
        });
      }) 
      this.NearUsd()
      // this.loginNear()
      this.NEARyoctoNEAR()
    }, 2000);
    window.innerWidth>=880?this.showCarousel=true:this.showCarousel=false
    window.addEventListener('resize', ()=>{window.innerWidth>=880?this.showCarousel=true:this.showCarousel=false});

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
  },
  methods: {
    NEARyoctoNEAR: function() {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(1);
      console.log(amountInYocto);      return amountInYocto;
    },
   async traerdatos(){
        this.duneticket ="https://arweave.net/balSBsdJ9lrHN-YSzJhHYY6VpJetr6Ne6_jU9rJk_C4"
        this.tittle = "Upside Down World"
        this.tokens_totales =  this.things_by_pk.tokens.length
        // this.location = this.things_by_pk.metadata.extra.location.value
        this.cantidad_disponible = 0
        this.things_by_pk.tokens.forEach(element => {
           if (element.list !== null &&  element.ownerId === "mintickt.near"){
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
          if (element.list !== null &&  element.ownerId === "mintickt.near" && !this.tokens_buy.includes(element.id) && cantidad_tokens < this.cantidad ){

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
         if (element.list !== null &&  element.ownerId === "mintickt.near" && !this.tokens_buy.includes(element.id) && cantidad_tokens < this.cantidad ){
              cantidad_tokens++
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
