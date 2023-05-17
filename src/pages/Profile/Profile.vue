<template>
  <div id="profile">
    <section id="profile-header" :style="`--bg-image: url(${banner})`">
      <div class="container-avatar">
        <img :src="avatar" alt="user img" />
      </div>

      <v-btn class="btn-social" v-ripple="false" :href="near_social" target="_blank" text>
        <span style="margin-block">NEAR Social</span>
        <v-icon color="#fff" size="16px">mdi-open-in-new</v-icon>
      </v-btn>
    </section>

    <section id="profile-content">
      <h2 class="title-tabs">My tickets</h2>

      <v-tabs v-model="tab" background-color="transparent">
        <v-tab v-for="(item, i) in dataTabs" :key="i" v-ripple="false" @click.native.prevent.stop.capture="tab = i">{{ item.title }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in dataTabs" :key="item" :style="`--imageSize: ${105}px`">
          <section class="container-grid">
            <v-card
              v-for="(item2,i) in item.content" :key="i" color="transparent"
              v-ripple="false"
              @click="goToDetails(item2)"
            >
              <img :src="item2.img" :alt="`${item2.name} image`">

              <div class="divcol" style="gap: 1px">
                <span>{{ item2.name }}</span>
                <span v-show="tab !== 2">{{ item2.date }}</span>
              </div>
            </v-card>
          </section>
        </v-tab-item>
      </v-tabs-items>
    </section>
    <v-dialog v-model="modalSuccess" persistent max-width="420px">
      <v-card id="modalSucess">
        <div class="divcol center">
          <h3 class="p">Success!</h3>
          <p class="p">Your transaction was succesful.</p>
        </div>

        <div class="divcol center">
          <v-btn @click="modalSuccess = false">Ok</v-btn>
          <a class="acenter" style="gap: 0.3em" :href="urlTx" target="_blank">
            <span class="p">See transaction</span>
            <img src="@/assets/icons/transaction.svg" alt="link icon" />
          </a>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as nearAPI from "near-api-js";
import gql from "graphql-tag";
import moment from "moment";
import { CONFIG } from "@/services/api";

const { connect, transactions, keyStores, WalletConnection, Contract, utils } = nearAPI;

const your_nfts = gql`
  query MyQuery($user: String!) {
    nfts(where: { owner_id: $user }) {
      id
      fecha
      owner_id
      serie_id
      title
      typetoken_id
      metadata {
        media
        extra
      }
    }
  }
`;

export default {
  name: "Profile",
  data() {
    return {
      urlTx: "",
      modalSuccess: false,
      tab: undefined,
      avatar: undefined,
      banner: undefined,
      bg_profile: undefined,
      near_social: process.env.VUE_APP_API_BASE_URL_SOCIAL_SITE,
      dataTabs: [
        {
          title: "Events",
          content: [
            // {
            //   img: require("@/assets/profile/img-test.png"),
            //   name: "Nearcon",
            //   date: "13th Feb, 2024",
            // }
          ],
        },
        {
          title: "Past events",
          content: [
            // {
            //   img: require("@/assets/profile/img-test.png"),
            //   name: "Nearcon",
            //   date: "13th Feb, 2024",
            // },
          ],
        },
        {
          title: "Collectibles",
          content: [
            // {
            //   img: require("@/assets/profile/img-test.png"),
            //   name: "Nearcon",
            // },
          ],
        },
      ],
      dataNftsAux: [],
      dataNfts: [],
    };
  },
  beforeMount() {
    this.tab = this.$store.state.indexTabProfile
  },
  mounted() {
    if (this.$session.get("hashSuccess")) {
      if (process.env.VUE_APP_NETWORK === "mainnet") {
        this.urlTx = "https://explorer.near.org/transactions/" + this.$session.get("hashSuccess");
      } else {
        this.urlTx = "https://explorer.testnet.near.org/transactions/" + this.$session.get("hashSuccess");
      }
      this.modalSuccess = true;
      this.$session.destroy("hashSuccess");
    }
    this.getData();
    this.getNFTContractsByAccount();
    //console.log(this.src)
  },
  methods: {
    goToDetails(item) {
      this.$session.set("ticketDetails", item);
      this.$router.push(`/profile-ticket-details/`);
      this.$store.commit("changeTabProfile", this.tab)
    },
    async getData() {
      // * avatar
      if (!this.$session.get("nearSocialProfileImage")) {
        this.avatar = process.env.VUE_APP_API_BASE_URL_PINATA + "QmQDtJ4TEdsQZZssAYtL61ZJ645XvtszUggfqbmHpee1fr";
        this.banner = process.env.VUE_APP_API_BASE_URL_PINATA + "QmbV4rGbzD8ss7DAUkjg1fbR3RudfUHCDD4QC5XTF8pBHE";
        // document.querySelector(".container-avatar").classList.add("default-avatar");
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

      const user = this.$ramper.getAccountId();
      this.$apollo
        .watchQuery({
          query: your_nfts,
          variables: {
            user: user,
          },
          pollInterval: 10000, // 10 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          let dataNfts = data.nfts;
          const dataEvents = [];
          const dataPast = [];
          const dateNow = Date.now();

          for (let i = 0; i < dataNfts.length; i++) {
            const extra = JSON.parse(dataNfts[i].metadata.extra);
            let startDate = { value: 0 }
            if (extra) {
              startDate = extra.find((element) => element.trait_type === "Start Date");
            }

            const dateNft = startDate.value * 1000;
            const item = {
              token_id: dataNfts[i].id,
              contract_id: process.env.VUE_APP_CONTRACT_NFT,
              img: dataNfts[i].metadata.media,
              name: dataNfts[i].title,
              date: moment(dateNft).format("ll"),
              dc: true
            };
            if (dateNft < dateNow) {
              dataPast.push(item);
            } else {
              dataEvents.push(item);
            }
          }
          this.dataTabs[0].content = dataEvents;
          this.dataTabs[1].content = dataPast;
        });
    },
    async getNFTContractsByAccount() {
      if (this.$ramper.getUser()) {
        let accountId = this.$ramper.getAccountId();
        let serviceUrl;
        if (process.env.VUE_APP_NETWORK === "mainnet") {
          serviceUrl = `https://api.kitwallet.app/account/${accountId}/likelyNFTs`;
        } else {
          serviceUrl = `https://preflight-api.kitwallet.app/account/${accountId}/likelyNFTs`;
        }

        const result = await this.axios.get(serviceUrl);

        console.log("JKL",result.data)

        for (var i = 0; i < result.data.length; i++) {
          if (result.data[i] === "testingmintickt.mintspace2.testnet") {
            await this.getNFTByContract(result.data[i], accountId);
          }
        }
        this.dataTabs[2].content = this.dataNftsAux;
      }
    },
    async getNFTByContract(contract_id, owner_account_id) {
      try {
        const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()));
        const wallet = new WalletConnection(near);
        const contract = new Contract(wallet.account(), contract_id, {
          viewMethods: ["nft_tokens_for_owner", "nft_metadata"],
          sender: wallet.account(),
        });
        const result = await contract.nft_tokens_for_owner({
          account_id: owner_account_id,
          from_index: "0",
          limit: 100,
        });
        const metadata = await contract.nft_metadata();
        
        for (var i = 0; i < result.length; i++) {
          console.log(result[i])
          let collection = {
            token_id: result[i].token_id,
            contract_id: contract_id,
            img: await this.buildMediaUrl(result[i].metadata.media, metadata.base_uri),
            name: result[i].metadata.title || result[i].token_id,
            dc: false
          };

          this.dataNftsAux.push(collection);
        }
      } catch (err) {
        //console.log("err", contract_id);
        return [];
      }
    },
    buildMediaUrl(media, base_uri) {
      if (!media || media.includes("://") || media.startsWith("data:image")) {
        return media;
      }
      if (base_uri) {
        return `${base_uri}/${media}`;
      }
      return `https://cloudflare-ipfs.com/ipfs/${media}`;
    },
  },
};
</script>

<style src="./Profile.scss" lang="scss" />
