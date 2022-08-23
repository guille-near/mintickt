<template>
  <section id="options" class="divcol gap align">
    <div class="acenter">
      <v-btn icon to="/events">
        <v-icon style="color:#FFFFFF !important">mdi-arrow-left</v-icon>
      </v-btn>
      <h2 class="p" style="margin:0">Nearcon / Settings</h2>
    </div>

    <aside class="container-actions divcol">
      <span>Burn a ticket</span>
      <label>Nearcon (Access Control)</label>
      <div class="space">
        <v-btn @click="ModalQR('ticket')">
          <img src="@/assets/icons/qr.svg" alt="qr icon">
          Show QR
        </v-btn>
        <v-btn>
          <img src="@/assets/icons/copy.svg" alt="copy icon">
          Copy url
        </v-btn>
      </div>
    </aside>
    
    <aside class="container-actions divcol">
      <span>Burn a goodie</span>
      <label>Near beer</label>
      <div class="space">
        <v-btn @click="ModalQR('goodie')">
          <img src="@/assets/icons/qr.svg" alt="qr icon">
          Show QR
        </v-btn>
        <v-btn>
          <img src="@/assets/icons/copy.svg" alt="copy icon">
          Copy url
        </v-btn>
      </div>
    </aside>

    <aside class="container-info divcol">
      <div class="space">
        <div class="divcol">
          <label>Tickets minted</label>
          <span>283/2000</span>
        </div>

        <v-btn @click="modalMore=true">Mint more</v-btn>
      </div>
      
      <div class="space">
        <div class="divcol">
          <label>Tickets listed</label>
          <span>283</span>
        </div>

        <v-btn>List more</v-btn>
      </div>
    </aside>


    <!-- modalQr -->
    <v-dialog v-model="modalQR" width="300px">
      <StreamBarcodeReader
        @decode="onDecode('hola')"
        @loaded="onLoaded"
      ></StreamBarcodeReader>
    </v-dialog>


    <!-- modalmore -->
    <v-dialog v-model="modalMore" width="300px">
      <v-card id="modalMore" color="#d9d9d9">
        <v-text-field
          v-model="cantidad"
          type="number"
          hide-spin-buttons
          hide-details
          solo
        >
          <template v-slot:append>
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
          </template>
        </v-text-field>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
const axios = require('axios');
import gql from 'graphql-tag'
import { Wallet, Chain, Network } from 'mintbase'
import * as nearAPI from "near-api-js"
import { CONFIG } from "@/services/api"
const { connect, keyStores, WalletConnection, utils ,} = nearAPI
export default {
  name: "options",
  components: { StreamBarcodeReader },
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
      modalMore: false,
      cantidad: 1,
      modalQR: false,
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
      // console.log('aqui' + urlParams.get("transactionHashes"))
      this.dialog = true
      history.replaceState(null, location.href.split("?")[0], '/events/crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY:mintickt.mintbase1.near/#/');
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(null, location.href.split("?")[0], '/events/crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY:mintickt.mintbase1.near/#/');
    }
  },
  methods: {
    onDecode(text) {
      console.log(`Decode text from QR code is ${text}`)
    },
    onLoaded() {
      console.log(`Ready to start scanning barcodes`)
    },
    ModalQR(key) {
      if (key=='ticket') {
        this.modalQR=true
      }
      if (key=='goodie') {
        this.modalQR=true
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
