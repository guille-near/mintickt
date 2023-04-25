<template>
  <section id="tienda" class="center align divcol">
    <aside>
      <!-- new -->
      <img class="eliminarmobile" :src="src" alt="Background Image" />
      <img class="vermobile" :src="src" alt="Background Image" />
      <!-- new -->
      <div class="banner-title fill-w limiter align">
        <!-- <v-chip color="rgba(0, 0, 0, 0.3)">
          {{ date }} {{ date_start }}-{{ this.date_end }} {{ time }}
        </v-chip> -->
        <v-chip color="rgba(0, 0, 0, 0.3)"> {{ date }}. {{ date_start }}, {{ time_start }} h. </v-chip>
        <h2>{{ tittle }}</h2>
        <!-- <span>{{ tittle }}</span> -->
      </div>
    </aside>
    <aside class="gapmobile limiter">
      <div v-if="!isIntersecting" class="floatButton vermobile">
        <div class="fill-w">
          <v-btn class="h8-em fill-w" @click="scrollTo">Buy a ticket</v-btn>
        </div>
      </div>

      <div class="contleft divcol fill-wmobile">
        <aside v-if="Datos.about" class="aboutSection divcol">
          <h3 class="h7-em p">About</h3>

          <div v-if="Datos.about.event" class="divcol h8-em">
            <p class="mt-3" v-html="Datos.about.event.text" />
          </div>
        </aside>

        <aside v-if="Datos.about" class="aboutSection divcol">
          <h3 class="h7-em p">When</h3>

          <div class="acenter" style="gap: 10px">
            <img src="@/assets/icons/calendar.svg" alt="calendar icon" style="width: 20px" />

            <div class="divcol" style="gap: 4px">
              <p class="p">
                <strong>Start at: </strong>
                {{ tsformart }}.
              </p>

              <p class="p">
                <strong>Ends at: </strong>
                {{ tsendformat }}.
              </p>
            </div>
          </div>
        </aside>

        <aside class="contLocation divcol">
          <h3 class="h7-em">Where</h3>
          <p class="h8-em mb-4" style="display: flex; align-items: flex-end; gap: 0.5em">
            <img src="@/assets/logo/Marker.svg" alt="marker icon" />
            {{ Datos.location }}
          </p>
          <iframe referrerpolicy="no-referrer-when-downgrade" :src="googlemap" allowfullscreen> </iframe>
        </aside>

        <aside class="divcol">
          <h3 class="h7-em">Details</h3>
          <aside class="contDetails">
            <p v-for="(item, i) in Datos.details" :key="i" class="h8-em tittles">
              <strong>{{ item.titlesDetails }}</strong>
              <br />{{ item.textDetails }}
            </p>
          </aside>
        </aside>
      </div>

      <article
        class="divcol acenter"
        :class="ticketType"
        v-intersect="onIntersect"
        :style="ticketSize ? `--w: ${ticketSize.split('_')[0]}px; --h: ${ticketSize.split('_')[1]}px` : ''"
      >
        <!-- added here to original size-->
        <img class="ticket" :src="ticket_img" alt="Ticket" />
        <div id="buy" class="contenedor_aside divcol fill-w">
          <aside class="divrow">
            <span class="h8-em space" style="width: 100%; gap: 0.5em">
              <strong class="number">{{ tokens_listed }}</strong> of <strong class="number">{{ tokens_minted }}</strong> available
            </span>
          </aside>
          <aside class="relative">
            <v-text-field disabled type="number" hide-spin-buttons :hide-details="true" solo v-model="quantity"> </v-text-field>
            <div class="contenedor_botones">
              <v-btn color=" #C4C4C4" @click="controlAmount('less')">
                <v-icon color="black"> mdi-minus </v-icon>
              </v-btn>
              <v-btn color="#C4C4C4" ref="myBtn" @click="controlAmount('more')">
                <v-icon color="black"> mdi-plus </v-icon>
              </v-btn>
            </div>
          </aside>

          <aside class="space">
            <div class="divrow acenter">
              <span class="h8-em number ml-3">{{ price_usd }}$USD</span>
            </div>
            <span class="h8-em number ml-3">~</span>
            <img src="@/assets/logo/logonear.svg" alt="Logo near" />
            <span class="tend">{{ price_near }}</span>
          </aside>
        </div>
        <div style="gap: 1em" class="divcol fill-w">
          <v-btn @click="buySelecction" :loading="loading" :disabled="disable" class="paywallet h8-em"> Buy </v-btn>
          <!-- <v-btn @click="batchtransfer" class="paycard h8-em"> Pay with card </v-btn> -->
        </div>
      </article>

      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2"> View transaction in explorer </v-card-title>

          <v-card-text>
            <center style="margin-top: 2.5em">
              <a target="_blank" :href="hash">Explorer transaction</a>
            </center>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false"> OK </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <alert></alert>
    </aside>
    <modalSuccess ref="modal"></modalSuccess>
    <modal-fill ref="modalfill"></modal-fill>
    <modal-buy v-on:eventBuy="buy" v-on:eventFiat="fiat" ref="modalbuy"></modal-buy>
  </section>
</template>

<script>
import gql from "graphql-tag";
import modalSuccess from "./ModalSuccess.vue";
import modalBuy from "./ModalBuy.vue";
import modalFill from "./ModalFill.vue"
import { Wallet, Chain, Network, MetadataField } from "mintbase";
import * as nearAPI from "near-api-js";
const { utils } = nearAPI;
const your_events = gql`
  query MyQuery($event_id: String!) {
    serie(id: $event_id) {
      copies
      creator_id
      description
      expires_at
      extra
      fecha
      id
      issued_at
      media
      nftsold
      price
      price_near
      redeemerevents
      redeemerobjects
      reference
      starts_at
      supply
      title
      typetoken_id
      updated_at
    }
  }
`;
const mb_views_nft_tokens_aggregate = gql`
  query MyQuery($store: String!, $metadata_id: String!) {
    nft_tokens_aggregate(where: { nft_contract_id: { _eq: $store }, metadata_id: { _eq: $metadata_id } }) {
      aggregate {
        count
      }
    }
    nft_earnings_aggregate(where: { nft_token: { metadata_id: { _eq: $metadata_id } } }) {
      aggregate {
        count
      }
    }
  }
`;
const main_image = gql`
  query MyQuery($_iregex: String!) {
    ipfs(where: { thingid: $_iregex }, first: 1) {
      tokenid
    }
  }
`;

const minter = gql`
  query MyQuery($store: String!, $user: String!) {
    mb_store_minters(where: { nft_contract_id: { _eq: $store }, minter_id: { _eq: $user } }) {
      minter_id
    }
  }
`;

export default {
  name: "Tienda",
  components: {
    modalSuccess,
    modalBuy,
    modalFill
  },
  data() {
    return {
      tittle: "",
      ticket_img: "",
      quantity: 0,
      location: "",
      dialog: false,
      loading: false,
      disable: false,
      lastPrice: [],
      showCarousel: null,
      Datos: {
        about: {
          event: {
            text: "",
          },
        },
        location: "",
        details: [],
      },
      eventId: null,
      token_id: null,
      metadata: null,
      tokens_minted: null,
      isIntersecting: false,
      tokens_listed: null,
      price_near: 0,
      price_token_usd: 0,
      tokens: [],
      tokens_buy: [],
      txs: [],
      precio_yocto: null,
      hash: "",
      src: "",
      date: "",
      date_start: "",
      date_end: "",
      googlemap: "",
      store: "",
      ticket_Type: null,
      approval_id: "",
      time_start: "",
      time_end: "",
      tsformart: "",
      tsendformat: "",
      burn_ticket_image: this.$pinata_gateway + "QmdW7LfjTfHWmpRadqk2o5oUUFutPuqUx2dZj3C4CH2Jjr",
      nearPrice: 0,
      price_usd: 0,
      amountDeposit: 0.01
    };
  },

  async mounted() {
    
    if (!this.$session.exists()) {
      this.$session.start();
    }

    this.eventId = this.$route.query.id;
    this.$session.set("eventid", this.eventId);

    this.nearPrice = this.$session.get("nearPrice");

    //Generate the base 64 image to nft let me in
    await this.getBase64FromUrl(this.burn_ticket_image);

    console.log("AQUI VA");

    this.$emit("renderHeader");
    this.getData();
    //this.fetch();
    // this.mainImg();
  },
  computed: {
    ticketType() {
      return this.ticket_Type?.toLowerCase().split("/")[0];
      // return this.$route.query.thingid.toLowerCase().split("/")[1];
    },
    ticketSize() {
      return this.ticket_Type?.toLowerCase().split("/")[1];
      // return this.$route.query.thingid.toLowerCase().split("/")[2];
    },
  },
  methods: {
    buy() {

    },
    NEARyoctoNEAR: function (NEARyocto) {
      const { utils } = nearAPI;
      const amountInYocto = utils.format.parseNearAmount(NEARyocto);
      // console.log(amountInYocto);
      return amountInYocto.toString();
    },
    dollarConversion(price) {
      return (Number(price) / this.nearPrice || 0).toFixed(2);
    },
    async getData() {
      this.loading = true;
      this.data = [];
      this.dataTableMobile = [];
      console.log(this.eventId);
      this.$apollo
        .watchQuery({
          query: your_events,
          variables: {
            event_id: this.eventId,
          },
          pollInterval: 10000, // 10 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          const dataEvent = data.serie;
          console.log(dataEvent);
          if (!dataEvent) return;

          var options = { month: "short" }; //Format data
          var options_start = { day: "numeric" }; //Format data
          var options_end = { day: "numeric" }; //Format data
          var year = { year: "numeric" }; //Format data

          const extra = JSON.parse(dataEvent.extra);
          const startDate = extra.find((element) => element.trait_type === "Start Date");
          const endDate = extra.find((element) => element.trait_type === "End Date");
          const ticketType = extra.find((element) => element.trait_type === "ticket_type");
          this.ticket_Type = ticketType.value;

          this.token_id = dataEvent.id

          this.date = new Date(startDate.value * 1000).toLocaleDateString("en-US", options);

          this.price_usd = Number(dataEvent.price).toFixed(2);
          this.price_near = this.dollarConversion(this.price_usd);

          this.date_start = new Date(startDate.value * 1000).toLocaleDateString("en-US", options_start);
          this.date_end = new Date(endDate.value * 1000).toLocaleDateString("en-US", options_end);

          const startTime = extra.find((element) => element.trait_type === "start_time");
          const endTime = extra.find((element) => element.trait_type === "end_time");

          this.time_start = new Date(startTime.value).toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
          this.time_end = new Date(endTime.value).toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          });

          this.tsformart =
            new Date(startDate.value * 1000).toLocaleDateString("en-us", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            }) +
            " " +
            this.time_start +
            " h";
          this.tsendformat =
            new Date(endDate.value * 1000).toLocaleDateString("en-us", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            }) +
            " " +
            this.time_end +
            " h";

          this.src = dataEvent.reference;

          this.tittle = dataEvent.title;
          this.$session.set("tittle", this.tittle);

          //Ticket image
          this.ticket_img = dataEvent.media;
          //Html description
          this.Datos.about.event.text = dataEvent.description;
          //Location
          this.Datos.location = extra.find((element) => element.trait_type === "location")?.value;
          //Google map location
          this.googlemap = "https://www.google.com/maps/embed/v1/place?key=" + this.$key + "&q=" + this.Datos.location;

          this.Datos.details = [
            // {
            //   titlesDetails: "Storage Gateaway",
            //   textDetails: "https://arweave.net",
            // },
            // {
            //   titlesDetails: "Transactions ID",
            //   textDetails: value[0].listings_aggregate.nodes[0].reference,
            // },
            {
              titlesDetails: "Contract",
              textDetails: process.env.VUE_APP_CONTRACT_NFT,
            },
            // {
            //   titlesDetails: "Thing ID",
            //   textDetails: value[0].id,
            // },
          ];

          this.tokens_minted = dataEvent.copies;
          this.tokens_listed = dataEvent.copies - dataEvent.supply;

          // Object.entries(data).forEach(([key, value]) => {
          //   //Last price
          //   this.price_near = value[0].listings_aggregate.nodes[0].price / Math.pow(10, 24);
          //   //Add tokens
          //   this.tokens = value[0].listings_aggregate.nodes;
          //   this.$session.set("minter", value[0].listings_aggregate.nodes[0].minter);
          //   Object.entries(value).forEach(([i, value1]) => {
          //     //Getting the minted nft
          //     //Tokens aggregate and earnings by metadata id
          //     // console.log(value1.id);
          //     this.$apollo
          //       .watchQuery({
          //         query: mb_views_nft_tokens_aggregate,
          //         variables: {
          //           store: this.$store_mintbase,
          //           metadata_id: value1.id,
          //         },
          //         pollInterval: 10000, // 10 seconds in milliseconds
          //       })
          //       .subscribe(({ data }) => {
          //         this.tokens_minted = data.nft_tokens_aggregate.aggregate.count;
          //         this.tokens_listed = value1.listings_aggregate.aggregate.count;
          //       });
          //   });
          // });
          // control flow 1 toke by default
          if (this.quantity === 0) {
            this.quantity = 1;
            this.tokens_buy.push(this.tokens[0].token_id);
          }
        });
      this.loading = false;
    },
    fetch() {
      this.lastPrice = JSON.parse(request.responseText).lastPrice;
      this.price_token_usd = parseFloat(this.lastPrice) * parseFloat(this.price_near) * parseInt(this.quantity);
    },
    formatPrice(price) {
      return Number(utils.format.formatNearAmount(price.toLocaleString("fullwide", { useGrouping: false })));
    },
    controlAmount(item) {
      var quantity_tokens = 0;
      if (item == "more" && this.quantity < this.tokens_listed) {
        this.quantity = this.quantity + 1;
        this.$session.set("quantity", this.quantity);
        // this.lastPrice = this.lastPrice.lastPrice * this.quantity * this.price_near
        this.getData();
        //this.fetch();
        this.tokens_buy = [];
        this.tokens.forEach((element) => {
          if (!this.tokens_buy.includes(element.token_id) && quantity_tokens < this.quantity) {
            quantity_tokens++;
            this.tokens_buy.push(element.token_id);
            this.quantity == 0 ? (this.disable = true) : (this.disable = false);
            //console.log(this.tokens_buy);
          }
        });
      }
      if (item == "less" && this.quantity > 1) {
        this.quantity--;
        this.$session.set("quantity", this.quantity);
        this.getData();
        //this.fetch();
        this.tokens_buy = [];
        this.tokens.forEach((element) => {
          if (!this.tokens_buy.includes(element.token_id) && quantity_tokens <= this.quantity) {
            quantity_tokens++;
            this.tokens_buy.push(element.token_id);
            this.quantity == 0 ? (this.disable = true) : (this.disable = false);
          }
        });
      }
    },
    onIntersect(entries) {
      this.isIntersecting = entries[0].isIntersecting;
    },
    padWithZero(num, targetLength) {
      return String(num).padEnd(targetLength, "0");
    },
    buySelecction() {
      this.$session.set("tokenId", this.token_id)
      this.$refs.modalbuy.modalBuy = true;
    },
    async fiat() {
      this.$refs.modalbuy.modalBuy = false;
    },
    async buy() {
      //Generate the reference for the burned image let me in
      //Grant the minter if does not exist
      // this.revisar();
      //this.grantMinter();

      //
      this.$refs.modalbuy.modalBuy = false;
      this.quantity == 0 ? (this.disable = true) : (this.disable = false);
      this.loading = true;
      const mintbase_marketplace = this.$mintbase_marketplace;
      let store = this.$store_mintbase;
      let category = "ticketing";
      let counter = 0;
      //console.log(this.padWithZero(this.price_near.toFixed(4), String(this.price_near.toFixed(4)).length + 24))
      this.tokens_buy.forEach((element) => {
        //console.log(element)
        // Pushh array for each element of the tokens selected
        counter = counter + 1;
        this.txs.push({
          receiverId: mintbase_marketplace,
          functionCalls: [
            {
              methodName: "buy",
              receiverId: mintbase_marketplace,
              gas: "200000000000000",
              args: {
                nft_contract_id: store,
                token_id: element,
              },
              deposit: utils.format.parseNearAmount(this.price_near.toFixed(4)),
            },
          ],
        });
      });
      /////////////////////////////////////////////////////////
      //Minting the let me in for each token the user is buying
      //////////////////////////////////////////////////////////
      let API_KEY = this.$dev_key.toString();
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;
      //Adding metadatada for the burned ticket
      //Loading image
      //Since te counter mint each one
      for (let i = 0; i < counter; i++) {
        try {
          var image = new Image();
          image.src = this.$session.get("canvas_burn");
          this.image = image;

          const file = this.dataURLtoFile(this.image, "mint.png");
          const { data: fileUploadResult, error: fileError } = await wallet.minter.uploadField(MetadataField.Media, file);
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
            trait_type: this.$session.get("eventid").split(":")[1],
            value: "BurnTicket",
          },
          {
            trait_type: "counter",
            value: counter,
          },
        ];

        const metadata = {
          title: this.$session.get("tittle"),
          description: "This is the let me in of the event",
          extra,
          store,
          type: "NEP171",
          category,
        };
        await wallet.minter.setMetadata(metadata, true);

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
                  extra: "ticketing",
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
      setTimeout(() => {
        this.loading = false;
      }, 10000);
      this.executeMultipleTransactions();
    },
    async getBase64FromUrl(url) {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
          this.$session.set("canvas_burn", base64data);
        };
      });
    },
    async mainImg() {
      var thingid = this.$route.query.thingid.toLowerCase();
      //console.log(thingid)
      //reedemed
      this.$apollo
        .query({
          query: main_image,
          variables: {
            _iregex: thingid.split("/")[0],
          },
          client: "mintickClient",
        })
        .then((response) => {
          //console.log(response.data)
          this.src = this.$pinata_gateway + response.data.ipfs[0].tokenid;
        })
        .catch((err) => {
          console.log("Error", err);
        });
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
    // async grantMinter() {
    //   let datos = JSON.parse(localStorage.getItem("Mintbase.js_wallet_auth_key"));
    //   const user = datos.accountId;
    //   this.$apollo
    //     .query({
    //       query: minter,
    //       variables: {
    //         store: this.$store_mintbase,
    //         user: user,
    //       },
    //     })
    //     .then((response) => {
    //       //console.log(response.data.mb_store_minters.length)
    //       //If the user is not minter just give grant to him/her
    //       if (response.data.mb_store_minters.length == 0) {
    //         const url = this.$node_url + "/minter";
    //         let item = {
    //           account_id: user,
    //         };
    //         this.axios
    //           .post(url, item)
    //           .then(() => {
    //             console.log("Hash up");
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //           });
    //       }
    //     })
    //     .catch((err) => {
    //       console.log("Error", err);
    //     });
    // },
    scrollTo() {
      var top = $("#buy").position().top;
      $(window).scrollTop(top);
    },
    async revisar() {
      let API_KEY = this.$dev_key;
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet, isConnected } = walletData;
      //console.info(isConnected)
      if (!isConnected) {
        wallet.connect({ requestSignIn: true }).then;
        this.nearid = true;
        const { data: details } = await wallet.details();
        this.user = details.accountId;
      }
    },
    // async getTickettoSend(){
    //   this.$apollo
    //     .query({
    //       query: get_ticket_to_send,
    //       variables: {
    //         _iregex: this.$route.query.thingid.toLowerCase().split(":")[1],
    //         owner: localStorage.getItem('minter')
    //       },
    //     })
    //     .then((response) => {
    //       localStorage.setItem('ticket_to_send', response.data.mb_views_nft_tokens_aggregate.nodes[0].token_id)
    //     })
    //     .catch((err) => {
    //       console.log("Error", err);
    //     });
    // },
  },
};
</script>

<style lang="scss">
// tienda //
#tienda {
  padding-bottom: 10em;
  width: 100vw;
  margin-inline: calc(50% - 50vw) !important;
  // padding-bottom: 70px;
  @media (max-width: 880px) {
    & > aside:nth-child(1) {
      // h2 {font-size: clamp(1.8em, 5vw, 5.1685em) !important;
      //   margin-bottom: 0 !important;max-width: 100% !important;
      // }
      span {
        font-size: 1.21611875em !important;
      }
      .v-chip__content {
        font-size: 1em !important;
      }
      @media (max-width: 400px) {
        font-size: 12px !important;
      }
    }
  }
  & > aside:nth-child(1) {
    height: 37em;
    width: 100%;
    // background: center no-repeat url(../assets/img/Dune.png);
    // background-size: cover;
    display: flex;
    align-items: flex-end;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin-inline: auto;
      width: 100%;
      height: 30%;
      background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.51) 30%, rgba(0, 0, 0, 0) 100%);
      z-index: 1;
    }
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin-inline: auto;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.318) 1.36%, rgba(0, 0, 0, 0) 35.95%, rgba(3, 3, 3, 0) 63.16%, rgba(5, 5, 5, 0.366) 87.25%);
    }
    & > img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      box-sizing: border-box;
      // @include mq(max, 1500px) {object-fit: cover};
      // @media (min-width: 880px) and (max-width: 1500px) {object-fit: cover}
      // @include mq(max, small) {
      //   object-fit: fill;
      // }
      // @include mq(min, 600px, max, 880px) {object-fit: fill !important;}
    }
    & > div {
      padding-inline: clamp(1em, 4vw, 4em);
      padding-bottom: clamp(1em, 2vw, 2em);
      // margin-left: clamp(1em, 4vw, 4em);
      z-index: 2;
    }
    .v-chip {
      height: 44px !important;
      border-radius: 6.68864px !important;
      word-spacing: 0.5ch;
      letter-spacing: 0.12em;
      max-width: max-content !important;
      padding: 6px 12px !important;

      .v-chip__content {
        max-width: max-content !important;
        font-size: 25px;
      }
    }

    h2 {
      margin-block: 8px 16px;
      letter-spacing: -0.03em;
      font-weight: 800;
      font-size: clamp(3.5em, calc(6vw + 1em), 6.25em);
      line-height: 1 !important;
      width: max-content;
      max-width: max(calc(75% - 4vw), 4.7em);
      word-break: initial !important;
    }

    span {
      font-weight: 400;
      font-size: 32px;
      line-height: 32px;
      /* identical to box height */
      letter-spacing: 0.04em;
      color: #ffffff;
      // max-width: clamp(34.625em, 60vw, 60em) !important;
      max-width: max(calc(70% - 4vw), 34.625em) !important;
    }
  }
  &.nearcon > aside:nth-child(1) h2 {
    font-size: 4em;
    @media (max-width: 880px) {
      font-size: 4.375em !important;
    }
  }

  // aditional rules 19/1/23
  .banner-title {
    @media (max-width: 880px) {
      width: calc(80% + clamp(1em, 4vw, 4em)) !important;
    }
    @media (max-width: 400px) {
      width: calc(90% + clamp(1em, 4vw, 4em)) !important;
    }
  }

  & > aside + aside {
    width: 100%;
    padding: clamp(1em, 4vw, 4em);
    position: relative;
    display: flex !important;
    justify-content: space-between !important;
    gap: 7em !important;
    @media (max-width: 880px) {
      flex-direction: column !important;
      align-content: center !important;
    }
    .contleft {
      @media (min-width: 880px) {
        width: 65% !important;
      }
      @media (max-width: 880px) {
        width: 80% !important;
        margin-inline: auto !important;
      }
      @media (max-width: 400px) {
        width: 90% !important;
      }
      gap: 2em;
      .aboutSection {
        gap: 1em;
      }
      .conttitles {
        .tittles {
          margin-bottom: 0.2em;
        }
      }
      p {
        max-width: 800px;
        line-height: 115.5%;
        letter-spacing: 0.04em;
        color: #c4c4c4;
      }
      div > p:last-of-type {
        margin-bottom: 0 !important;
      }

      h3 {
        font-weight: bold;
        line-height: 115.5%;
        letter-spacing: 0.04em;
        color: #ff37bb;
      }
      :is(.v-image, .v-window) {
        height: max-content !important;
      }
      .wrapper_lineUp {
        margin-bottom: 16px;
        // .v-slide-group__wrapper {
        //   .v-slide-group__content {
        //     gap: 1em;
        //     padding: .5em;
        //     @include mq(min, 880px) {
        //       display: grid;
        //       grid-template-columns: repeat(2, 1fr);
        //     }
        //   }
        // }
        .v-responsive__content {
          @media (max-width: 340px) {
            font-size: 12px !important;
          }
          padding: 1em clamp(0em, 1vw, 1em);
          gap: 1em;
          display: grid;
          place-items: center;
          @media (min-width: 880px) {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .v-card {
          border-radius: 8px;
          width: min(100%, 37.0625em);
          // @include mq(max, 879px) {min-width: 27.0625em;max-width: 27.0625em;}
          @media (min-width: 880px) {
            width: min(100%, 27.0625em) !important;
          }
          // height: 18.4375em;
          aspect-ratio: 13.2/9;
          overflow: hidden;
          position: relative;
          align-items: flex-end;
          padding: 1em;
          box-shadow: 0 0 3px 1.4px rgb(225, 225, 225, 0.3) !important;
          img {
            position: absolute !important;
            bottom: 0 !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin: auto !important;
            width: 100%;
          }
          h4 {
            font-weight: 800;
            font-size: clamp(1.8em, 2.5vw, 2.5625em);
            letter-spacing: -0.03em;
            color: #ffffff !important;
            z-index: 2;
          }
        }
      }
      .contLocation {
        iframe {
          width: min(100%, 34.375em);
          aspect-ratio: 16 / 8;
          margin-right: auto;
          margin-bottom: 2em;
          border-radius: 15px;
          box-shadow: 0 0 6px 5px rgba(0, 0, 0, 0.2);
        }
        p {
          margin-bottom: 0;
        }
      }
      .contDetails {
        display: grid !important;
        @media (min-width: 880px) {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        grid-gap: 2em !important;
        p {
          margin-bottom: 0 !important;
          word-break: break-all;
        }
        strong {
          line-height: 1.5 !important;
        }
      }
    }
  }

  .floatButton {
    position: fixed;
    bottom: 3%;
    width: 100vw;
    left: 0px !important;
    margin-inline: calc(-50vw + 50%);
    padding-inline: 16px;
    z-index: 5;
    animation: moveup 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95);
    & > div {
      position: relative;
      display: flex;
      align-items: center;
      &:before {
        content: "";
        position: absolute;
        width: 100vw;
        margin-inline: calc(-50vw + 50%);
        height: 100%;
        padding-block: 4.5em;
        background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.51) 54.84%, rgba(0, 0, 0, 0) 100%);
        transform: matrix(1, 0, 0, -1, 0, 0);
      }
      .v-btn {
        padding: 17px 20px;
        height: 52px;
        background: linear-gradient(165.96deg, #ffffff 68.48%, rgba(211, 254, 184, 0.35) 128.14%);
        box-shadow: 0px 4px 19px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(14px);
        border-radius: 13px;
        text-transform: none !important;
        span {
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #000000 !important;
        }
      }
    }
  }

  article {
    --padding: clamp(2em, calc(23% - 1em), 6em);
    position: static;
    color: white !important;
    gap: 2em;
    z-index: 3;
    // * when ticket type is
    &.con {
      --width: 314px;
      --height: 471px;
    }
    &.cinema {
      --width: 252.39px;
      --height: 471px;
    }
    &.event {
      --width: 314px;
      --height: 565.05px;
    }
    &.custom {
      --width: var(--w);
      --height: var(--h);
    }
    width: min(90%, var(--width)) !important;
    @media (min-width: 880px) {
      transform: translateY(-250px) !important;
    }
    @media (max-width: 880px) {
      width: 80% !important;
      margin-inline: auto !important;
    }
    @media (max-width: 400px) {
      width: 90% !important;
    }
    h3 {
      font-weight: 700;
      font-size: 1.375em;
      letter-spacing: 0.04em;
      color: #ff37bb;
    }
    &#claim {
      width: min(90%, 17em);
    }
    // &#buy {
    //   @media (min-width: 880px) {
    //     width: min(90%, 22em) !important;
    //     position: absolute;
    //     right: clamp(2em, 4vw, 4em);
    //     top: -13.5em;
    //     width: calc(clamp(2em, 6vw, 6em) * 2 + 150px) !important;
    //   }
    // }

    // * default tickets
    &:not(.custom) .ticket {
      width: 100% !important;
      @media (min-width: 880px) {
        width: var(--width) !important;
        height: var(--height) !important;
      }
      // @include mq(max, small) {
      //   width: 100% !important;
      // }
    }
    // * custome ticket
    &:not(.con, .cinema, .event) .ticket {
      width: 100% !important;
      object-fit: cover !important;
      @media (min-width: 880px) {
        width: var(--width) !important;
        height: var(--height) !important;
        // ? before im using max-width and max-height
      }
    }

    .contenedor_aside {
      gap: 1em;
      aside {
        padding: 0.625em var(--padding);
        height: 59px;
        background-color: rgba(255, 255, 255, 0.06);
        display: flex;

        .number {
          color: white;
        }
        .v-input__control {
          max-height: 39px !important;
          min-height: 39px !important;
        }
        .v-input__slot {
          background-color: hsl(0, 0%, 0%, 28%);

          input {
            color: white;
          }

          .v-input__append-inner {
            display: flex;
            gap: 0.5em;
          }
        }
        .contenedor_botones {
          position: absolute;
          right: calc(var(--padding) + 1em);
          top: 0;
          bottom: 0;
          margin-block: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          .v-btn {
            max-height: max-content;
            height: max-content;
            max-width: max-content;
            min-width: max-content;
            padding: 0;
            background: #c4c4c4 !important;
          }
        }
        span {
          color: #c4c4c4;
        }
      }
    }
    .payTicket {
      box-sizing: border-box;
      height: 52px;
      padding: 2px;
      background: linear-gradient(-90deg, #ff00e58f, #d3feb8);
      box-shadow: 0px 4px 19px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(14px);
      border-radius: 13px;
      text-transform: none !important;
      position: relative;
      isolation: isolate;
      .v-btn__content {
        background: linear-gradient(165.96deg, #ffffff 68.48%, rgba(211, 254, 184, 0.35) 128.14%);
        border-radius: 13px;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(14px);
      }
      span {
        color: black;
      }
    }
    .paywallet {
      border: 1.5px solid;
      border-color: #ff00e58f;
      box-sizing: border-box;
      /* Auto layout */
      padding: 17px 20px;
      height: 52px;
      background: linear-gradient(165.96deg, #ffffff 68.48%, rgba(211, 254, 184, 0.35) 128.14%);
      box-shadow: 0px 4px 19px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(14px);
      border-radius: 13px;
      text-transform: none !important;
      span {
        color: black;
      }
    }
    .paycard {
      border: 1.5px solid;
      border-color: #ff00e58f;
      box-sizing: border-box;
      /* Auto layout */
      padding: 17px 20px;
      height: 52px;
      background: linear-gradient(165.96deg, rgba(196, 196, 196, 0.06) 68.48%, rgba(211, 254, 184, 0.35) 128.14%);
      box-shadow: 0px 4px 19px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(14px);
      border-radius: 13px;
      text-transform: none !important;
      span {
        color: white;
      }
    }
  }
}
</style>
