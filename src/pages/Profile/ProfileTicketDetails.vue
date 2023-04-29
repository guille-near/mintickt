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
        <h2 class="title-tabs p">My Tickets / {{ "Nearcon" }}</h2>
      </div>

      <article>
        <div class="container-ticket">
          <img :src="nft.img" alt="tikcet test" />

          <div class="divcol center">
            <span>{{ nft.name }}</span>
            <span>Burn this NFT so event staff let you in at the venue.</span>
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
          <v-btn :disabled="btnDisabled" class="btn-filled">
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
      btnError: false,
      btnCancel: false,
      btnTransfer: true,
      receiverId: "",
      modalTransfer: false,
      btnDisabled: false,
      nft: {},
      avatar: undefined,
      banner: undefined,
    };
  },
  created() {},
  mounted() {
    this.getData();
    this.nft = this.$session.get("ticketDetails");
    if (!this.nft) {
      this.$router.push(`/profile`);
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

        const res = await this.$ramper.sendTransaction({
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
        if (res.result && typeof res.result[0]?.status?.SuccessValue === "string") {
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

        const res = await this.$ramper.sendTransaction({
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
        if (res.result && typeof res.result[0]?.status?.SuccessValue === "string") {
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
