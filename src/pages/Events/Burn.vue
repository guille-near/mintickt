<template>
  <div id="burn" class="center" style="margin-block: 140px 80px">
    <ModalSuccess ref="modal"></ModalSuccess>
    <v-sheet color="transparent" class="tcenter divcol center" style="gap: 1em" max-width="max-content">
      <h3 class="p">Token # {{ token }}</h3>
      <img :src="media" alt="burn ticket" style="background: rgba(0, 0, 0, 0.87)" />
      <div class="divcol" style="gap: 0.5em">
        <h3 class="p">{{ title }} ({{ extra }})</h3>
        <p>Burn this NFT so event staff let you in at the venue.</p>
      </div>
      <v-btn class="fill-w mt-n3" :disabled="btnDisabled" @click="burn">Burn it</v-btn>
    </v-sheet>
  </div>
</template>

<script>
import gql from "graphql-tag";
import ModalSuccess from "./ModalSuccess";
import { Wallet, Chain, Network, MetadataField } from "mintbase";
const your_nfts_by_serie = gql`
  query MyQuery($owner: String!, $serieId: String!) {
    nfts(where: { owner_id: $owner, serie_id: $serieId }) {
      id
      owner_id
      serie_id
      title
      typetoken_id
      fecha
      metadata {
        media
        redeemerobjects
        redeemerevents
        description
      }
    }
  }
`;

const mb_views_nft_tokens_redeemed = gql`
  query MyQuery($metadata_id: String!) {
    mb_views_nft_tokens(where: { reference_blob: { _cast: { String: { _iregex: $metadata_id } } }, extra: { _eq: "redeemed" } }, limit: 1) {
      mint_memo
      metadata_id
      reference
      royalties
      royalties_percent
      reference_hash
      base_uri
      extra
      owner
      title
    }
  }
`;

export default {
  name: "Burn",
  components: {
    ModalSuccess,
  },
  data() {
    return {
      btnDisabled: false,
      token: "",
      token_goodie: "",
      title: "",
      extra: "",
      disable: true,
      loading: false,
      meta: "",
      media: "",
      txs: [],
      burn_goodie_image: this.$pinata_gateway + "QmQxY2cqZ5LZ6cfArVsdskrKfmPLZ3NdsZxbJWxbmeXURw",
    };
  },
  async mounted() {
    if (!this.$session.exists()) {
      this.$session.start();
    }
    //Generate the base 64 image to nft grab me something
    await this.getBase64FromUrlGoodie(this.burn_goodie_image);
    this.getData();
    //Show the modal and send the goodie if the result is goodie
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // let datos = JSON.parse(localStorage.getItem("Mintbase.js_wallet_auth_key"));
    // const user = datos.accountId;
    // if (
    //   urlParams.get("transactionHashes") !== null
    // ) {
    //   this.$refs.modal.modalSuccess = true;
    //   this.$refs.modal.url = this.$explorer + "/accounts/" + user;
    //   this.$router.push("/#/");
    // }
  },
  methods: {
    async getData() {
      console.log(this.$route.query.id);
      const user = this.$ramper.getAccountId();
      this.$apollo
        .query({
          query: your_nfts_by_serie,
          variables: {
            serieId: this.$route.query.id,
            owner: user,
          },
        })
        .then(({ data }) => {
          console.log("DATAAA", data);
          data.nfts.length > 0 ? (this.disable = false) : (this.disable = true);
          const dataNfts = data.nfts[0];
          this.media = dataNfts.metadata.media === null || undefined ? this.burn_goodie_image : dataNfts.metadata.media;
          // var extra = response.data.mb_views_nft_tokens[0].extra;
          // const str2 = extra.charAt(0).toUpperCase() + extra.slice(1);
          this.token = dataNfts.id;
          this.title = dataNfts.title;
          this.extra = dataNfts.title;
        })
        .catch((err) => {
          console.log("Error", err);
        });

      // this.$apollo
      //   .query({
      //     query: mb_views_nft_tokens_redeemed,
      //     variables: {
      //       metadata_id: this.$route.query._iregex,
      //     },
      //   })
      //   .then((response) => {
      //     //console.log(response.data.mb_views_nft_tokens.length)
      //     this.$session.set("counter", response.data.mb_views_nft_tokens.length);
      //     this.$session.set("goodie_name", response.data.mb_views_nft_tokens[0].title);
      //   })
      //   .catch((err) => {
      //     console.log("Error", err);
      //   });
    },
    async burn() {
      this.btnDisabled = true;
      if (this.$ramper.getUser()) {
        const action = [
          this.$ramper.functionCall(
            "burn_object",
            {
              token_id: this.token,
            },
            "300000000000000",
            "1"
          ),
        ];

        const resTx = await this.$ramper.sendTransaction({
          transactionActions: [
            {
              receiverId: process.env.VUE_APP_CONTRACT_NFT,
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
    async burn2() {
      // console.log(this.dataTickets.attendees);

      this.loading = true;
      //Api key an data
      let store = this.$store_mintbase;
      var meta = this.$route.query.extra === "ticketing" ? "goodie" : "last";
      let API_KEY = this.$dev_key.toString();
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;

      var tokens = [];
      tokens.push(this.token);

      this.txs.push({
        receiverId: store,
        functionCalls: [
          {
            methodName: "nft_batch_burn",
            receiverId: store,
            gas: "200000000000000",
            args: {
              token_ids: tokens,
            },
            deposit: "1", //utils.format.parseNearAmount((0.01).toString()),
          },
        ],
      });

      //Verify if there is a redeemer to mint the user the goodie
      //And start all the mint process
      //if the goodie exists mint
      //Adding metadatada for the burned ticket
      //Loading image
      //Since te counter mint each one
      if (parseInt(this.$session.get("counter")) > 0 && this.$route.query.extra === "ticketing") {
        try {
          var image = new Image();
          image.src = this.$session.get("canvas_goodie");
          this.image = image;
          //console.log(this.image)

          const file = this.dataURLtoFile(this.image, "mint.png");
          const { data: fileUploadResult, error: fileError } = await wallet.minter.uploadField(MetadataField.Media, file);
          //console.log("file", MetadataField.Media);
          // localStorage.setItem("file", file);
          if (fileError) {
            throw new Error(fileError);
          } else {
            console.log(fileUploadResult);
          }
        } catch (error) {
          console.error(error);
          // TODO: handle error
        }

        //Metadata Object
        let extra = [
          {
            trait_type: this.$route.query._iregex,
            value: "BurnTicket",
          },
        ];
        let category = "redeemed";
        const metadata = {
          title: this.$session.get("goodie_name"),
          description: "This is the Goodie",
          extra,
          store,
          type: "NEP171",
          category,
        };
        await wallet.minter.setMetadata(metadata, true);
        console.log("metadata", metadata);

        const { data: metadataId, error } = await wallet.minter.getMetadataId();
        //this.$session.set("metadata_reference", metadataId);
        //console.log("metadata_reference", metadataId);

        let datos = JSON.parse(localStorage.getItem("Mintbase.js_wallet_auth_key"));
        const user = datos.accountId;
        // This is the let me in

        this.txs.push({
          receiverId: store,
          functionCalls: [
            {
              methodName: "nft_batch_mint",
              receiverId: store,
              gas: "200000000000000",
              args: {
                owner_id: user,
                metadata: {
                  reference: metadataId,
                  extra: "redeemed",
                },
                num_to_mint: parseInt(1),
                royalty_args: null,
                split_owners: null,
              },
              deposit: "1", //utils.format.parseNearAmount((0.01).toString()),
            },
          ],
        });
      }
      this.executeMultipleTransactions();
    },
    async executeMultipleTransactions() {
      //Gettintg the tokens ID
      //this.getTokensId();
      //Adding metadata for the burn ticket
      let API_KEY = this.$dev_key.toString();
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;

      await wallet.executeMultipleTransactions({
        transactions: this.txs,
        options: {
          meta: "buy",
        },
      });
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.src.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    async getBase64FromUrlGoodie(url) {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
          this.$session.set("canvas_goodie", base64data);
        };
      });
    },
  },
};
</script>

<style scoped lang="scss">
img {
  max-width: clamp(208px, 20vw, 265px);
  background: linear-gradient(338.88deg, #efe1d4 28.41%, #ffffff 101.9%), linear-gradient(180deg, #000000 0%, #272727 100%);
}
h3 {
  font-weight: 600;
  font-size: 25px;
  line-height: 25px;
  letter-spacing: -0.03em;
  color: #ffffff !important;
}
p {
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.5) !important;
}
.v-btn {
  margin-top: 1.5em;
  min-height: 39px !important;
  color: #ffffff !important;
  background: linear-gradient(0deg, #000000 -42.31%, rgba(0, 0, 0, 0) 50%), #cc00b7 !important;
  border-radius: 10px;
  span {
    font-weight: 700;
    font-size: 15px;
    line-height: 15px;
    letter-spacing: -0.03em;
  }
}
</style>
