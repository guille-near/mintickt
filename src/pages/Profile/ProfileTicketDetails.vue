<template>
  <div id="profile" class="details">
    <section id="profile-header" :style="`--bg-image: url(${banner})`">
      <div class="container-avatar">
        <img :src="avatar" alt="user img" />
      </div>

      <v-btn class="btn-social" v-ripple="false" :href="near_social" target="_blank" text>
        <span style="margin-block">NEAR Social</span>
        <v-icon color="#fff" size="16px">mdi-open-in-new</v-icon>
      </v-btn>
    </section>

    <section id="profile-content" class="center">
      <div class="container-title">
        <v-btn icon @click="$router.go(-1)">
          <v-icon color="#fff">mdi-arrow-left</v-icon>
        </v-btn>
        <h2 class="title-tabs p">My Tickets / {{ nft.name }}</h2>
      </div>

      <article>
        <div class="container-ticket">
          <img :src="nft.img" alt="tikcet test" />

          <div class="divcol center">
            <span>{{ nft.name }}</span>
            <span>{{ textNft }}</span>
          </div>
        </div>

        <div class="container-btn">
          <v-btn @click="modalTransfer = true" :disabled="btnDisabled" class="btn-bordered">
            <img src="@/assets/profile/transfer.svg" alt="transfer" width="15px" height="15px" />
            <span>Transfer</span>
          </v-btn>
          <v-btn color="red" :disabled="btnDisabled" @click="burnNft()" class="btn-bordered">
            <img src="@/assets/profile/burn.svg" alt="burn" width="15px" height="15px" />
            <span>Delete</span>
          </v-btn>
          <v-btn v-if="!nft.dc" :disabled="btnDisabled" :href="dc_redirect" class="btn-filled">
            <img src="@/assets/profile/discord.svg" alt="discord" width="15px" height="15px" />
            <span>Unlock your invitation</span>
          </v-btn>
        </div>
      </article>
    </section>
    <v-dialog v-model="modalTransfer" persistent max-width="420px">
      <v-card id="modalSucess">
        <div class="divcol center">
          <h3 class="p">Transfer Collectable</h3>
          <p class="p">Enter a recipient address, then proceed to confirm your transaction.</p>
        </div>

        <v-text-field :error="btnError" v-model="receiverId" solo @input="changeInputTransfer()"></v-text-field>

        <div class="divcol center">
          <v-btn :disabled="btnDisabled" @click="cancelTransfer()">Cancel</v-btn>
          <v-btn :disabled="btnTransfer" @click="transferNft()">Transfer</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";

const { connect, transactions, keyStores, WalletConnection, Contract, utils } = nearAPI;
export default {
  name: "ProfileTicketDetails",
  data() {
    return {
      dc_redirect: process.env.VUE_APP_DC_REDIRECT.toString(),
      btnError: false,
      btnCancel: false,
      btnTransfer: true,
      receiverId: "",
      modalTransfer: false,
      btnDisabled: false,
      nft: {},
      avatar: undefined,
      banner: undefined,
      textNft: null
    };
  },
  created() {},
  mounted() {
    this.getData();
    this.nft = this.$session.get("ticketDetails");
    console.log("NFT",this.nft)
    if (!this.nft) {
      this.$router.push(`/profile`);
    }
    if (this.nft.typetoken === "1") {
      this.textNft = "This is your NFT collectible that will make your experience memorable!"
    } else if (this.nft.typetoken === "2") {
      this.textNft = "Burn this NFT so event staff let you in at the venue."
    } else {
      this.textNft = "This is your NFT collectible that will make your experience memorable!"
    }
  },
  methods: {
    async getData() {
      // * avatar
      if (!this.$session.get("nearSocialProfileImage")) {
        this.avatar = process.env.VUE_APP_API_BASE_URL_PINATA + "QmQDtJ4TEdsQZZssAYtL61ZJ645XvtszUggfqbmHpee1fr";
        this.banner = process.env.VUE_APP_API_BASE_URL_PINATA + "QmbV4rGbzD8ss7DAUkjg1fbR3RudfUHCDD4QC5XTF8pBHE";
        document.querySelector(".container-avatar").classList.add("default-avatar");
      } else {
        this.avatar = process.env.VUE_APP_API_BASE_URL_SOCIAL + this.$session.get("nearSocialProfileImage");
        this.banner = process.env.VUE_APP_API_BASE_URL_SOCIAL + this.$session.get("nearSocialProfileBackgroundImage");
      }

      // * banner
      if (!this.$session.get("nearSocialProfileBackgroundImage")) {
        this.banner = process.env.VUE_APP_API_BASE_URL_PINATA + "QmbV4rGbzD8ss7DAUkjg1fbR3RudfUHCDD4QC5XTF8pBHE";
      } else {
        this.banner = process.env.VUE_APP_API_BASE_URL_SOCIAL + this.$session.get("nearSocialProfileBackgroundImage");
      }
    },
    async burnNft() {
      this.btnDisabled = true;
      if (this.$ramper.getUser()) {
        let action;
        if (this.nft.contract_id.includes("musicfeast")) {
          action = [
            this.$ramper.functionCall(
              "nft_burn",
              {
                token_id: this.nft.token_id,
                reedemer: false,
              },
              "300000000000000",
              "1"
            ),
          ];
        } else {
          action = [
            this.$ramper.functionCall(
              "nft_burn",
              {
                token_id: this.nft.token_id,
              },
              "300000000000000",
              "1"
            ),
          ];
        }

        const resTx = await this.$ramper.sendTransaction({
          transactionActions: [
            {
              receiverId: this.nft.contract_id,
              actions: action,
            },
          ],
          network: process.env.VUE_APP_NETWORK,
        });
        console.log(res);
        this.btnDisabled = false;
        if ((resTx &&
          JSON.parse(localStorage.getItem('ramper_loggedInUser'))
            .signupSource === 'near_wallet' &&
            resTx.txHashes.length > 0) || (resTx.result || resTx.result[0]?.status?.SuccessValue || resTx.result[0]?.status?.SuccessValue === "")) {
          this.nft = {};
          this.$session.set("hashSuccess", res.txHashes[0]);
          this.$router.push(`/profile`);
        }
      }
      this.btnDisabled = false;
    },
    cancelTransfer() {
      this.modalTransfer = false;
      this.receiverId = "";
    },
    changeInputTransfer() {
      if (this.receiverId == "" || this.receiverId == null) {
        this.btnTransfer = true;
        this.btnError = true;
      } else {
        this.debounce();
      }
    },
    debounce() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.validateNear, 700);
    },
    async validateNear() {
      const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()));
      const account = await near.account(this.receiverId);
      await account
        .state()
        .then((response) => {
          this.btnTransfer = false;
          this.btnError = false;
        })
        .catch((error) => {
          this.btnTransfer = true;
          this.btnError = true;
        });
    },
    async transferNft() {
      this.btnDisabled = true;
      this.btnTransfer = true;
      if (this.$ramper.getUser()) {
        const action = [
          this.$ramper.functionCall(
            "nft_transfer",
            {
              token_id: this.nft.token_id,
              receiver_id: this.receiverId,
            },
            "300000000000000",
            "1"
          ),
        ];

        const resTx = await this.$ramper.sendTransaction({
          transactionActions: [
            {
              receiverId: this.nft.contract_id,
              actions: action,
            },
          ],
          network: process.env.VUE_APP_NETWORK,
        });
        console.log(res);
        this.btnDisabled = false;
        this.btnTransfer = false;
        if ((resTx &&
          JSON.parse(localStorage.getItem('ramper_loggedInUser'))
            .signupSource === 'near_wallet' &&
            resTx.txHashes.length > 0) || (resTx.result || resTx.result[0]?.status?.SuccessValue || resTx.result[0]?.status?.SuccessValue === "")) {
          this.nft = {};
          this.$session.set("hashSuccess", res.txHashes[0]);
          this.$router.push(`/profile`);
        }
      }
      this.btnDisabled = false;
      this.btnTransfer = false;
    },
  },
};
</script>

<style src="./Profile.scss" lang="scss" />
