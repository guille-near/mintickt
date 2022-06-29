<template>
  <section id="events" class="align divcol gap">
    <h2>Events</h2>

    <v-data-table
      id="tableEvents"
      v-model="table"
      :headers="headers"
      :items="items"
      hide-default-footer
      calculate-widths
      :mobile-breakpoint="880"
      class="eliminarmobile"
    >
      <template v-slot:[`item.name`]="{ item }">
        <img class="bgTicket" src="@/assets/img/bg-ticket_events.png" alt="ticket image">
        <span class="eventName">{{item.name}}</span>
      </template>
      <template v-slot:[`item.actions`]>
        <div class="divwrap_inv" style="gap:1em">
          <v-btn>Go to live data</v-btn>

          <v-menu :close-on-content-click="false" offset-y open-on-hover>
            <template v-slot:activator="{on, attrs}">
              <v-btn v-on="on" v-bind="attrs"><v-icon size="1.5em">mdi-cog-outline</v-icon></v-btn>
            </template>

            <v-card class="contMoreOptions divcol" style="display:flex" color="#A5A5A5">
              <v-btn v-for="(item, i) in dataMore" :key="i" color="transparent" :class="{active:item.active}"
                @click="dataMore.forEach(e=>{e.active=false});item.active=true">
                {{item.name}} more
              </v-btn>
            </v-card>
          </v-menu>
        </div>
      </template>
    </v-data-table>
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
  name: "Events",
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
      table: '',
      dataMore: [
        {name: 'Mint', active: false},
        {name: 'List', active: false}
      ],
      headers: [
        { text: 'EVENT NAME', align: 'start', value: 'name' },
        { text: 'DATE', align: 'start', value: 'date' },
        { text: 'LOCATION', align: 'start', value: 'location' },
        { text: 'TICKETS MINTED', align: 'start', value: 'minted' },
        { text: 'TICKETS SOLD', align: 'start', value: 'sold' },
        { text: 'TICKETS LISTED', align: 'start', value: 'listed' },
        { sortable: false, align: 'end', value: 'actions' },
      ],
      items: [
        {
          name: 'Nearcon',
          date: 'Feb 12, 2022',
          location: 'Lisbon, Portugal',
          minted: '283 / 2000',
          sold: '250',
          listed: '283',
        },
        {
          name: 'Nearcon',
          date: 'Feb 12, 2022',
          location: 'Lisbon, Portugal',
          minted: '283 / 2000',
          sold: '250',
          listed: '283',
        },
        {
          name: 'Nearcon',
          date: 'Feb 12, 2022',
          location: 'Lisbon, Portugal',
          minted: '283 / 2000',
          sold: '250',
          listed: '283',
        },
      ],
    };
  },
  mounted(){
    this.$emit('renderHeader');
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
