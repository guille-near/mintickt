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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes")
    this.hash = "https://explorer.mainnet.near.org/transactions/" + urlParams.get("transactionHashes")
    if (urlParams.get("transactionHashes") !== null) {
      //console.log('aqui' + urlParams.get("transactionHashes"))
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
  }
};
</script>

<style src="../pages.scss" lang="scss" />
