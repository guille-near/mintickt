<template>
  <section id="liveData" class="align divcol gap">
    <div class="acenter">
      <v-btn icon to="/events">
        <v-icon style="color:#FFFFFF !important">mdi-arrow-left</v-icon>
      </v-btn>
      <h2 class="p">Event / Nearcon</h2>
    </div>

    <aside class="container-info acenter">
      <div class="divcol">
        <label>Tickets sold</label>
        <span>250</span>
      </div>
      <div class="divcol">
        <label>Your incomes</label>
        <span>584.91 N</span>
      </div>
      <label style="margin-top:auto">≈ USD 2323.50</label>
    </aside>

    <div class="divcol">
      <h2 style="margin-bottom: .3em">Last updates</h2>
      <label>Filter by</label>
    </div>

    <section class="container-down">
      <div class="container-filter acenter gap">
        <v-card v-for="(item,i) in dataFilters" :key="i" class="divcol" :class="{active:item.active}" @click="dataFilters.forEach(e=>{e.active=false});item.active=true">
          <label>{{item.name}}</label>
          <span>{{item.value}}</span>
        </v-card>
      </div>

      <v-data-table
        id="dataTable"
        :headers="headersTable"
        :items="dataTable"
        hide-default-footer
        :mobile-breakpoint="-1"
      >
        <template v-slot:[`item.transaction`]>
          <v-btn icon>
            <img class="copyImg" src="@/assets/icons/link.svg" alt="external link">
          </v-btn>
        </template>

        <template v-slot:[`item.action`]>
          <v-btn>Complete order</v-btn>
        </template>
      </v-data-table>
    </section>
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
  name: "LiveData",
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
      dataFilters: [
        {
          name: "Fans inside",
          value: "122/250",
          active: true,
        },
        {
          name: "Goods redeemed",
          value: "12/250",
          active: false,
        }
      ],
      headersTable: [
        { value:"nft", text:"NFT" },
        { value:"signer", text:"SIGNER" },
        { value:"quantity", text:"QUANTITY" },
        { value:"created", text:"CREATED" },
        { value:"transaction", text:"TRANSACTION", sortable:false },
        { value:"action", text:"ACTION", sortable:false },
      ],
      dataTable: [
        {
          nft: "Near Beer",
          signer: "guille.near",
          quantity: 1,
          created: "1 min ago"
        },
        {
          nft: "Near Beer",
          signer: "guille.near",
          quantity: 1,
          created: "1 min ago"
        },
      ]
    };
  },
  mounted(){
    this.responsive();
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
    responsive() {
      if (window.innerWidth <= 880) {
        this.headersTable.splice(this.headersTable.findIndex(e=>e.value=='quantity'), 1)
        this.headersTable.splice(this.headersTable.findIndex(e=>e.value=='action'), 1)
        this.headersTable[this.headersTable.findIndex(e=>e.value=='transaction')]. text='TX'
      }
    },
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
