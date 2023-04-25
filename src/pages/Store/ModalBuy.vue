<template>
  <v-dialog v-model="modalBuy" max-width="420px" persistent>
    <v-card id="modalSucess">
      <div class="divcol center">
        <h3 class="p">Select payment option</h3>
      </div>
      <div class="divcol center">
        <v-btn @click="fiat" style="margin-bottom: 3px;">Pay with USD</v-btn>
        <v-btn @click="buy()">Pay with NEAR</v-btn>
        <a class="acenter" style="gap: 0.3em">
          <span @click="modalBuy = false" class="p">Close</span>
        </a>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import * as nearAPI from 'near-api-js'
const { Contract } = nearAPI

export default {
  name: "modalBuy",
  data() {
    return {
      modalBuy: false,
      url: "",
      amountDeposit: 0.01
    };
  },
  methods: {
    async getBalance () {
      try {
        if (this.$ramper.getUser()) {
          const account = await this.$near.account(this.$ramper.getAccountId());
          const response = await account.state();
          const valueStorage = Math.pow(10, 19)
          const valueYocto = Math.pow(10, 24)

          const storage = (response.storage_usage * valueStorage) / valueYocto 
          return ((response.amount / valueYocto) - storage).toFixed(2)
        }
      } catch (error) {
        return "0"
      }
    },
    async getSeriesPrice (seriesId) {
      const account = await this.$near.account(this.$ramper.getAccountId());
      const contract = new Contract(account, process.env.VUE_APP_CONTRACT_NFT, {
      viewMethods: ["nft_get_series_price"],
      sender: account,
    })

    const price = await contract.nft_get_series_price({token_series_id: seriesId})

    return this.$utils.format.formatNearAmount(price)
    },
    async buy() {
      const tokenId = this.$session.get("tokenId")
      console.log(tokenId)
      let priceSeries = await this.getSeriesPrice(tokenId)
      let price = parseFloat(priceSeries) + this.amountDeposit
      console.log(priceSeries, price)
      const balance = await this.getBalance()
      if (balance < price) {
        this.$refs.modalfill.modalFill = true;
        return
      }
      
      if (this.$ramper.getUser()) {
        console.log(String(price))
        console.log(this.$utils.format.parseNearAmount(String(price)))
        console.log(tokenId)
        console.log(this.$ramper.getAccountId())
        console.log(process.env.VUE_APP_CONTRACT_NFT)
        console.log(process.env.VUE_APP_NETWORK)
        const action = [this.$ramper.functionCall(
          "nft_buy",       
          {
            token_event_id: tokenId, 
            receiver_id: this.$ramper.getAccountId(),
          }, 
          '300000000000000', 
          this.$utils.format.parseNearAmount(String(price))
        )]
        console.log(action)
        const res = await this.$ramper.sendTransaction({
          transactionActions: [
            {
              receiverId: process.env.VUE_APP_CONTRACT_NFT,
              actions: action,
            },
          ],
          network: process.env.VUE_APP_NETWORK,
        })
        console.log(res)
      }
    },
    fiat() {
      this.$emit("eventFiat");
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
