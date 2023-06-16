<template>
  <section>
    <v-dialog v-model="modalBuy" max-width="420px" persistent>
      <v-card id="modalSucess">
        <div class="divcol center">
          <h3 class="p">Select payment option</h3>
        </div>
        <div class="divcol center">
          <v-btn @click="fiat()" style="margin-bottom: 3px">Pay with USD</v-btn>
          <v-btn @click="buy()">Pay with NEAR</v-btn>
          <a class="acenter" style="gap: 0.3em">
            <span @click="modalBuy = false" class="p">Close</span>
          </a>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalSuccess" max-width="420px">
      <v-card id="modalSucess">
        <div class="divcol center">
          <h3 class="p">Success!</h3>
          <p class="p">Your transaction was succesful.</p>
        </div>

        <div class="divcol center">
          <v-btn @click="closeSuccess()">Ok</v-btn>
          <a class="acenter" style="gap: 0.3em" :href="urlTx" target="_blank">
            <span class="p">See transaction</span>
            <img src="@/assets/icons/transaction.svg" alt="link icon" />
          </a>
        </div>
      </v-card>
    </v-dialog>
    <modal-fill ref="modalfill"></modal-fill>
  </section>
</template>

<script>
import * as nearAPI from "near-api-js";
import modalFill from "./ModalFill.vue";
const { Contract } = nearAPI;

export default {
  name: "modalBuy",
  components: {
    modalFill,
  },
  data() {
    return {
      modalSuccess: false,
      modalBuy: false,
      urlTx: "",
      amountDeposit: 0.01,
    };
  },
  methods: {
    async getBalance() {
      try {
        if (this.$ramper.getUser()) {
          const account = await this.$near.account(this.$ramper.getAccountId());
          const response = await account.state();
          const valueStorage = Math.pow(10, 19);
          const valueYocto = Math.pow(10, 24);

          const storage = (response.storage_usage * valueStorage) / valueYocto;
          return (response.amount / valueYocto - storage).toFixed(2);
        }
      } catch (error) {
        return "0";
      }
    },
    async getSeriesPrice(seriesId) {
      try {
        const account = await this.$near.account(this.$ramper.getAccountId());
        const contract = new Contract(account, process.env.VUE_APP_CONTRACT_NFT, {
          viewMethods: ["nft_get_series_price"],
          sender: account,
        });

        console.log(contract)

        const price = await contract.nft_get_series_price({ token_series_id: seriesId });

        if (price) {
          return this.$utils.format.formatNearAmount(price);
        } else {
          return
        }

        
      } catch (error) {
        console.log(error)
      }
      
    },
    async buy() {
      const tokenId = this.$session.get("tokenId");
      const quantity = this.$session.get("quantity") || 1;
      console.log("LOG")
      let priceSeries = await this.getSeriesPrice(tokenId);
      
      let price = parseFloat(priceSeries) + this.amountDeposit;

      console.log(price)
      const balance = await this.getBalance();
      if (balance < price) {
        this.$refs.modalfill.modalFill = true;
        return;
      }

      console.log(this.$ramper.getUser())

      if (this.$ramper.getUser()) {
        const actions = []
        for (let i = 0; i < quantity; i++) {
          actions.push(
            this.$ramper.functionCall(
              "nft_buy",
              {
                token_series_id: tokenId,
                receiver_id: this.$ramper.getAccountId(),
              },
              "50000000000000",
              this.$utils.format.parseNearAmount(String(price))
            ),
          )
        }
        this.modalBuy = false;
        const resTx = await this.$ramper.sendTransaction({
          transactionActions: [{
              receiverId: process.env.VUE_APP_CONTRACT_NFT,
              actions: actions,
            }],
          network: process.env.VUE_APP_NETWORK,
        });

        if ((resTx &&
          JSON.parse(localStorage.getItem('ramper_loggedInUser'))
            .signupSource === 'near_wallet' &&
            resTx.txHashes.length > 0) || (resTx.result || resTx.result[0]?.status?.SuccessValue || resTx.result[0]?.status?.SuccessValue === "")) {
          this.modalBuy = false;
          if (process.env.VUE_APP_NETWORK === "mainnet") {
            this.urlTx = "https://explorer.near.org/accounts/" + this.$ramper.getAccountId();
          } else {
            this.urlTx = "https://explorer.testnet.near.org/accounts/" + this.$ramper.getAccountId();
          }
          this.modalSuccess = true;
        }
      } else {
        this.$refs.modalfill.modalFill = true
      }
    },
    closeSuccess() {
      this.urlTx = "";
      this.modalSuccess = false;
    },
    fiat() {
      this.modalBuy = false;
      const tokenId = this.$session.get("tokenId");
      console.log(
        "https://checkout.ramper.xyz/buy?contract_address=" +
        process.env.VUE_APP_CONTRACT_NFT +
          "&network=" +
          process.env.VUE_APP_NETWORK +
          "&user_wallet_address=" +
          (this.$ramper.getAccountId() === null ? "" : this.$ramper.getAccountId()) +
          "&token_series_id=" +
          tokenId +
          "&redirect_url=" +
          process.env.VUE_APP_REDIRECT_URL
      );
      window.open(
        "https://checkout.ramper.xyz/buy?contract_address=" +
          process.env.VUE_APP_CONTRACT_NFT +
          "&network=" +
          process.env.VUE_APP_NETWORK +
          "&user_wallet_address=" +
          (this.$ramper.getAccountId() === null ? "" : this.$ramper.getAccountId()) +
          "&token_series_id=" +
          tokenId +
          "&redirect_url=" +
          process.env.VUE_APP_REDIRECT_URL + "profile"
      );
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
