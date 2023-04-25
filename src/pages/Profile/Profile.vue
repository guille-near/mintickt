<template>
  <div id="profile">
    <section id="profile-header">
      <div class="container-avatar">
        <img  :src="avatar" alt="user img">
      </div>

      <!-- <v-btn class="btn-social" text>
        <span style="margin-block">NEAR Social</span>
        <v-icon color="#fff" size="16px">mdi-open-in-new</v-icon>
      </v-btn> -->
    </section>

    <section id="profile-content">
      <h2 class="title-tabs vermobile">My tickets</h2>

      <v-tabs v-model="tab" background-color="transparent">
        <v-tab v-for="item in dataTabs" :key="item" v-ripple="false">{{item.title}}</v-tab>
      </v-tabs>


      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in dataTabs" :key="item" :style="`--imageSize: ${tab === 2 ? 150 : 105}px`">
          <v-card
            v-for="(item2,i) in item.content" :key="i" color="transparent"
            v-ripple="false"
            @click="$router.push(`/profile-ticket-details/:${item2.name}`)"
          >
            <img :src="item2.img" :alt="`${item2.name} image`">

            <div class="divcol" style="gap: 1px">
              <span>{{item2.name}}</span>
              <span v-show="tab !== 2">{{item2.date}}</span>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </section>
  </div>
</template>

<script>
import * as nearAPI from 'near-api-js'
import gql from "graphql-tag";
import moment from "moment";
import { CONFIG } from '@/services/api'

const { connect, transactions, keyStores, WalletConnection, Contract, utils } = nearAPI

const your_nfts = gql`
  query MyQuery($user: String!) {
    nfts(where: {owner_id: $user}) {
      id
      fecha
      owner_id
      serie_id
      title
      typetoken_id
    }
  }
`;

export default {
  name: "Profile",
  data() {
    return {
      tab: 0,
      avatar: undefined,

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
      dataNfts: []
    }
  },
  mounted() {
    this.getData()
    this.getNFTContractsByAccount()
    //console.log(this.src)
  },
  methods: {
    async getData() {
      if(!this.$session.get("nearSocialProfileImage")){
        this.avatar = process.env.VUE_APP_API_BASE_URL_PINATA + "QmQDtJ4TEdsQZZssAYtL61ZJ645XvtszUggfqbmHpee1fr"
        document.querySelector(".container-avatar").classList.add("default-avatar")
      } else {
        this.avatar = process.env.VUE_APP_API_BASE_URL_SOCIAL + this.$session.get("nearSocialProfileImage")
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
            const dateNft = parseInt(dataNfts[i].fecha / 1000000)
            const item = {
              img: require("@/assets/profile/img-test.png"),
              name: dataNfts[i].title,
              date: moment(dateNft).format('ll'),
            }
            if (dateNft < dateNow) {
              dataPast.push(item);
            } else {
              dataEvents.push(item);
            }
          }
          this.dataTabs[0].content = dataEvents
          this.dataTabs[1].content = dataPast
        });
    },
    async getNFTContractsByAccount() {
      if (this.$ramper.getUser()) {
        let accountId = this.$ramper.getAccountId();
        console.log(accountId)
        let serviceUrl
        if (process.env.VUE_APP_NETWORK === "mainnet") {
          serviceUrl = `https://api.kitwallet.app/account/${accountId}/likelyNFTs`;
        } else {
          serviceUrl = `https://preflight-api.kitwallet.app/account/${accountId}/likelyNFTs`;
        }
        
        const result = await this.axios.get(serviceUrl);
  
        for (var i = 0; i < result.data.length; i++) {
          if (result.data[i] !== process.env.VUE_APP_CONTRACT_NFT) {
            await this.getNFTByContract(result.data[i], accountId)
          }
        }
        this.dataTabs[2].content = this.dataNftsAux
        //console.log(this.indexMore)
      }
    },
    async getNFTByContract(contract_id, owner_account_id) {
      try {
        console.log("ENETRA")
        const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()));
        const wallet = new WalletConnection(near)
        const contract = new Contract(wallet.account(), contract_id, {
          viewMethods: ["nft_tokens_for_owner", "nft_metadata"],
          sender: wallet.account(),
        });
        console.log(contract)
        const result = await contract.nft_tokens_for_owner({
          account_id: owner_account_id,
          from_index: "0",
          limit: 100
        });
        console.log(result)
        const metadata = await contract.nft_metadata();
        for (var i = 0; i < result.length; i++) {
          let collection = {
            img: await this.buildMediaUrl(result[i].metadata.media, metadata.base_uri),
            name: result[i].metadata.title || result[i].token_id,
          }
            
          this.dataNftsAux.push(collection)
        }
      } catch (err) {
        //console.log("err", contract_id);
        return [];
      }
    },
    buildMediaUrl (media, base_uri) {
      if (!media || media.includes('://') || media.startsWith('data:image')) {
          return media;
      }
      if (base_uri) {
          return `${base_uri}/${media}`;
      }
      return `https://cloudflare-ipfs.com/ipfs/${media}`;
    },
  }
}
</script>

<style src="./Profile.scss" lang="scss" />
