<template>
  <section id="events" class="align divcol">
    <v-tabs v-model="tab" background-color="transparent">
      <v-tab v-for="(item, i) in dataTabs" :key="i" v-ripple="false" @click.native.prevent.stop.capture="tab = i">{{ item.title }}</v-tab>

      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        clear-icon="mdi-close"
        clearable
        class="search eliminarmobile"
      >
        <template #prepend-inner>
          <img src="@/assets/icons/lupa.svg" alt="search" width="16px" height="16px">
        </template>
      </v-text-field>

      <v-btn class="create-btn vermobile">
        <img :src="require(`@/assets/icons/${createMenu ? 'minus' : 'plus'}.svg`)" alt="create button">
      </v-btn>
    </v-tabs>

    <v-text-field
      v-model="search"
      label="Search"
      single-line
      hide-details
      clear-icon="mdi-close"
      clearable
      class="search vermobile"
    >
      <template #prepend-inner>
        <img src="@/assets/icons/lupa.svg" alt="search" width="16px" height="16px">
      </template>
    </v-text-field>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(item, i) in dataTabs" :key="i">
        <v-data-table
          id="tableEvents"
          :headers="item.headers"
          :items="item.data"
          :loading="loading"
          :search="search"
          :footer-props="{ 'items-per-page-options': [5, 10, 20, 50, -1] }"
          calculate-widths
          :mobile-breakpoint="880"
          :custom-sort="customSort"
          :class="`tab-${tab} eliminarmobile`"
        >
          <template v-slot:[`item.image`]="{ item }">
            <!-- <img id="bgTicket" src="@/assets/img/bg-ticket_events.png" alt="bg ticket"> -->
            <img :id="tab === 0 ? 'bgTicket-image' : ''" :src="item.media || hola" alt="event image" />
          </template>

          <template v-slot:[`item.name`]="{ item }">
            <v-btn @click="goEventData(item.id)" class="btnWithoutStyles" :href="'#/store?id=' + item.id" target="_blank">{{ item.name }}</v-btn>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="cont_buttons" style="gap: 6px">
              <v-btn @click="goLiveData(item.id)">Go to live data</v-btn>
              <v-btn @click="goOptions(item.id)"><v-icon size="1.5em">mdi-cog-outline</v-icon></v-btn>
              <!--
              <a class="center bold" style="color: #cc00b7; font-size: 16px" :href="$store_site+item.thingid">
                {{item.name.length > 20 ? item.name.substr(0, 20) + '...' : item.name}}
              </a>
              <v-btn @click="copySiteLink(item.thingid)" title="Copy site link"
                ><v-icon size="1.5em">mdi-content-copy</v-icon>{{ message_ticket }}</v-btn
              > -->
            </div>
          </template>
        </v-data-table>

        <section class="vermobile">
          <v-card v-for="(item2, i) in filterDataMobile(item.dataTableMobile)" :key="i" class="up divcol" style="display: flex">
            <section class="acenter">
              <span class="eventName">
                <v-btn @click="goEventData(item2.id)" :href="'#/store?id=' + item2.id" target="_blank" style="color: white; padding: 0" text>{{ item2.name.ellipsisRange(14) }}</v-btn>
              </span>

              <span v-show="tab == 0">{{ item2.date }}</span>

              <aside class="acenter" style="gap: 0.5em">
                <template v-if="tab == 0">
                  <v-btn class="icon" @click="goLiveData(item2.id)">
                    <v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-chart-line</v-icon>
                  </v-btn>

                  <v-btn class="icon" @click="goOptions(item2.id)">
                    <v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-cog-outline</v-icon>
                  </v-btn>
                </template>

                <!-- <v-btn class="icon" @click="copySiteLink(item2.thingid)">
                  <v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-content-copy</v-icon>
                </v-btn> -->

                <v-icon
                  color="white"
                  :style="item2.show ? 'transform:rotate(180deg)' : ''"
                  size="2em"
                  @click="
                    item.dataTableMobile.forEach((e) => {
                      e !== item2 ? (e.show = false) : null;
                    });
                    item2.show = !item2.show;
                  "
                >
                  mdi-chevron-down
                </v-icon>
              </aside>
            </section>

            <!-- table 1 -->
            <aside v-show="item2.show && tab == 0" class="down space">
              <div class="divcol">
                <h3>TICKETS SOLD</h3>
                <span>{{ item2.sold }}</span>
              </div>

              <div class="divcol">
                <h3>INCOMES</h3>
                <span>{{ item2.incomes }}</span>
              </div>

              <!-- <div class="divcol">
                <h3>TICKETS LISTED</h3>
                <span>{{ item2.listed }}</span>
              </div> -->
            </aside>

            <!-- table 2 -->
            <aside v-show="item2.show && tab == 1" class="down space">
              <div class="divcol">
                <h3>MINTED BY</h3>
                <span>{{ item2.mintedBy }}</span>
              </div>

              <div class="divcol">
                <h3>MINTED</h3>
                <span>{{ item2.minted }}</span>
              </div>

              <div class="divcol">
                <h3>SOLD</h3>
                <span>{{ item2.sold }}</span>
              </div>
            </aside>
          </v-card>

          <!-- <section id="footer-pagination" class="end gap">
            <span style="color:#FFFFFF">1</span>
            <div class="center">
              <v-btn icon>
                <v-icon style="color:#FFFFFF !important">mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon style="color:#FFFFFF !important">mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </section> -->
        </section>
      </v-tab-item>
    </v-tabs-items>


    <v-menu v-model="createMenu" bottom offset-y content-class="menuCreateBtn" activator=".create-btn">
      <v-list color="transparent">
        <v-list-item @click="goToEvent()">
          <v-list-item-title style="color: #fff">
            <span>Create event</span>
          </v-list-item-title>
        </v-list-item>
        <!-- <v-list-item>
          <v-list-item-title style="color: #fff">
            <span>Create collection</span>
          </v-list-item-title>
        </v-list-item> -->
      </v-list>
    </v-menu>


    <v-dialog v-model="modalSuccess" max-width="420px">
      <v-card id="modalSucess">
        <div class="divcol center">
          <h3 class="p">Success!</h3>
          <p class="p">Your transaction was succesful.</p>
        </div>

        <div class="divcol center">
          <v-btn @click="modalSuccess=false">Ok</v-btn>
          <a class="acenter" style="gap:.3em" :href="urlTx" target="_blank">
            <span class="p">See transaction</span>
            <img src="@/assets/icons/transaction.svg" alt="link icon">
          </a>
        </div>
      </v-card>
    </v-dialog>

    <modal-fill ref="modalfill"></modal-fill>
  </section>
</template>

<script>
import moment from "moment";
import gql from "graphql-tag";
import modalFill from "../Store/ModalFill.vue";
import * as nearAPI from "near-api-js";

const { connect, keyStores, utils, Contract } = nearAPI;

const your_events = gql`
  query MyQuery($user: String!) {
    series(where: { creator_id: $user, typetoken_id: "1" }) {
      nft_amount_sold
      title
      nftsold
      supply
      copies
      creator_id
      description
      expires_at
      is_mintable
      extra
      fecha
      id
      issued_at
      media
      price
      price_near
      reference
      starts_at
      typetoken_id
      updated_at
    }
  }
`;
const mb_views_nft_tokens_aggregate = gql`
  query MyQuery($store: String!, $user: String!, $metadata_id: String!) {
    nft_tokens_aggregate(where: { nft_contract_id: { _eq: $store }, metadata_id: { _eq: $metadata_id } }) {
      aggregate {
        count
      }
    }
    nft_earnings_aggregate(where: { receiver_id: { _eq: $user }, nft_token: { metadata_id: { _eq: $metadata_id } } }) {
      aggregate {
        count
      }
    }
  }
`;
const main_image = gql`
  query MyQuery($thing_id: String!) {
    ipfs(where: { thingid_contains: $thing_id }) {
      thingid
      tokenid
    }
  }
`;
export default {
  name: "Events",
  components: {
    modalFill,
  },
  data() {
    return {
      nearPrice: 0,
      data: [],
      createMenu: false,
      search: "",
      tab: undefined,
      dataTabs: [
        {
          title: "Events",
          headers: [
            { align: "start", value: "image", sortable: false },
            { text: "NAME", align: "start", value: "name" },
            { text: "DATE", align: "start", value: "date" },
            { text: "TICKETS SOLD", align: "start", value: "sold" },
            { text: "Your Revenue", align: "start", value: "incomes" },
            // { text: "TICKETS LISTED", align: "start", value: "listed" },
            { sortable: false, align: "end", value: "actions" },
          ],
          data: [],
          dataTableMobile: [],
        },
        // {
        //   title: "Collectibles",
        //   headers: [
        //     { align: "center", value: "image", sortable: false },
        //     { text: "NAME", align: "start", value: "name" },
        //     { text: "MINTED BY", align: "start", value: "mintedBy" },
        //     { text: "MINTED", align: "start", value: "minted" },
        //     { text: "SOLD", align: "start", value: "sold" },
        //     // { text: "TICKETS LISTED", align: "start", value: "listed" },
        //     // { sortable: false, align: "end", value: "actions" },
        //   ],
        //   data: [],
        //   dataTableMobile: [],
        // },
      ],
      loading: true,
      modalSuccess: false,
      urlTx: false,
      earnings: [],
      page: 3,
      nearid: false,
      message_ticket: "Copy link",
      src: [],
      modalQR: false,
    };
  },
  async mounted() {
    if (!this.$session.exists()) {
      this.$session.start();
    }

    if (this.$session.get("hashSuccess")) {
      if (process.env.VUE_APP_NETWORK === "mainnet") {
        this.urlTx = "https://explorer.near.org/transactions/" + this.$session.get("hashSuccess");
      } else {
        this.urlTx = "https://explorer.testnet.near.org/transactions/" + this.$session.get("hashSuccess");
      }
      this.modalSuccess = true
      this.$session.destroy("hashSuccess");
    }

    await this.getNearPrice();

    if (!this.$ramper.getUser()) {
      const login = await this.$ramper.signIn();
      if (login) {
        if (login.user) {
          // this.$router.go()
          location.reload();
        } else {
          this.$router.push("/");
        }
      } else {
        this.$router.push("/");
      }
    }
    
    this.scanListener();
    // this.revisar();
    this.getData();
    // this.pollData();
    // this.mainImg();
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // if (urlParams.get("transactionHashes") !== null) {
    //   history.replaceState(null, location.href.split("?")[0], "/#/events");
    // }
    // if (urlParams.get("transactionHashes") !== null && urlParams.get("signMeta") === "approve") {
    //   history.replaceState(null, location.href.split("?")[0], "/#/events");
    // }
    // if (urlParams.get("transactionHashes") !== null && urlParams.get("signMeta") === "goodies") {
    //   history.replaceState(null, location.href.split("?")[0], "/#/events");
    // }
    // if (urlParams.get("errorCode") !== null) {
    //   history.replaceState(null, location.href.split("?")[0], "/#/events");
    // }
  },
  methods: {
    limitStr(item, num) {
      if (item) {
        if (item.length > num) {
          return item.substring(0, num) + "...";
        }
      }
      return item;
    },
    async getNearPrice() {
      const account = await this.$near.account(this.$ramper.getAccountId());
      const contract = new Contract(account, process.env.VUE_APP_CONTRACT_NFT, {
        viewMethods: ["get_tasa"],
        sender: account,
      });

      const price = await contract.get_tasa();
      this.nearPrice = price || 0;
    },
    filterDataMobile(dataMobile) {
      let filter = dataMobile;

      if (this.search) filter = filter.filter((data) => data.name.includes(this.search));

      return filter;
    },
    customSort: function (items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] == "date") {
          if (!isDesc[0]) {
            return new Date(b[index]) - new Date(a[index]);
          } else {
            return new Date(a[index]) - new Date(b[index]);
          }
        } else {
          if (typeof a[index] !== "undefined") {
            if (!isDesc[0]) {
              return a[index].toLowerCase().localeCompare(b[index].toLowerCase());
            } else {
              return b[index].toLowerCase().localeCompare(a[index].toLowerCase());
            }
          }
        }
      });
      return items;
    },
    async getData() {
      this.progress = true;
      const user = this.$ramper.getAccountId();
      var rows = [];
      console.log("BRR")
      this.$apollo
        .watchQuery({
          query: your_events,
          variables: {
            user: user,
          },
          pollInterval: 10000, // 10 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          console.log("DATAA", data)
          let dataSeries = data.series;
          this.dataTabs[0].data = [];
          this.dataTabs[0].dataTableMobile = [];
          var options = { year: "numeric", month: "short", day: "numeric" }; //Format data
          

          for (let i = 0; i < dataSeries.length; i++) {
            const extra = JSON.parse(dataSeries[i].extra);
            const startDate = extra.find((element) => element.trait_type === "Start Date");
            const ticketType = extra.find((element) => element.trait_type === "ticket_type");
            console.log(extra);
            rows = {
              id: dataSeries[i].id,
              name: dataSeries[i].title,
              date: this.convertDate(startDate.value * 1000), // new Date(value1.reference_blob.extra[6].value * 1000).toLocaleDateString("en-US", options),
              location: dataSeries[i].title,
              minted: dataSeries[i].supply,
              sold: dataSeries[i].nftsold,
              incomes: ((dataSeries[i].nft_amount_sold / Math.pow(10, 24)) * this.nearPrice) + " $",
              incomesNear: dataSeries[i].nft_amount_sold / Math.pow(10, 24),
              thingid: dataSeries[i].reference,
              ticket_type: ticketType.value,
              show: false,
              key: i,
              date1: dataSeries[i].title,
              media: dataSeries[i].reference,
            };
            this.dataTabs[0].data.push(rows);
            this.dataTabs[0].data.sort((a, b) => (a.date1 > b.date1 ? -1 : 1));
            this.dataTabs[0].dataTableMobile.push(rows);
          }
        });
      this.loading = false;
    },
    convertDate(item) {
      console.log(item);
      return moment(item).format("LL");
    },
    pollData() {
      this.polling = setInterval(() => {
        this.getData();
        this.$forceUpdate();
      }, 60000);
    },
    goLiveData(event_id) {
      this.$session.set("event_id", event_id);
      this.$router.push({
        path: "/events/liveData",
      });
    },
    goEventData(eventId, ticketType) {
      // this.$router.push({
      //   path: "/store",
      //   query: { id: eventId },
      // });
      this.$session.set("eventid", eventId);
      // this.$session.get("event_name", pevent);
    },
    goOptions(event_id) {
      this.$session.set("event_id_op", event_id);
      this.$router.push({
        path: "/events/options",
      });
    },
    fetch() {
      this.lastPrice = this.$session.get("nearPrice");
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
      console.info(isConnected);
      if (!isConnected) {
        //console.info("user")
        if (this.nearid === false) {
          wallet.connect({ requestSignIn: true }).then;
          this.nearid = true;
          const { data: details } = await wallet.details();
          this.user = details.accountId;
        } else if (this.nearid === true) {
          wallet.disconnect();
          localStorage.clear();
          this.$router.go();
          this.nearid = false;
          this.user = "Login with NEAR";
        }
      }
      if (localStorage.getItem("Mintbase.js_wallet_auth_key") !== null) {
        this.nearid = true;
        let datos = JSON.parse(localStorage.getItem("Mintbase.js_wallet_auth_key"));
        this.user = datos.accountId;
      }
    },
    copySiteLink(id) {
      this.loading = true;
      this.$copyText(this.$store_site + id).then(
        function (e) {
          console.log(e);
        },
        function (e) {
          console.log(e);
        }
      );
      this.message_ticket = "Copied!";
      this.loading = false;
      this.$forceUpdate();
    },
    scanListener() {
      if (this.$router.currentRoute.path.includes(":user-scan")) {
        const user = this.$ramper.getAccountId();
        this.search = user;
      } else {
        this.search = "";
      }
    },
    async mainImg() {
      //reedemed
      this.$apollo
        .query({
          query: main_image,
          variables: {
            thing_id: this.$store_mintbase,
          },
          client: "mintickClient",
        })
        .then((response) => {
          Object.entries(response.data.ipfs).forEach(([key, value]) => {
            this.src.push(value);
          });
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    getIpfs(value) {
      if (this.src.filter((thingid) => thingid.thingid == value)[0] === undefined) {
        return this.$pinata_gateway + "QmT26Az6EsepW3U5NpYtP3g78NwL4biEfNPECowPiNt5wm";
      } else {
        var src = this.src.filter((thingid) => thingid.thingid == value)[0].tokenid;
        return this.$pinata_gateway + src;
      }
    },
    ModalQR() {
      this.modalQR = true;
    },
    onDecode(result) {
      this.modalQR = false;
      console.log(`Decode text from QR code is ${result}`);
    },
    onLoaded() {
      console.log(`Ready to start scanning barcodes`);
    },
    async goToEvent() {
      const balance = await this.getBalance();
      if (balance < 0.05) {
        this.$refs.modalfill.modalFill = true;
        return;
      }

      this.$session.clear();
      localStorage.setItem("step", 1);
      this.$router.push("/events/register");
    },
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
  },
};
</script>

<style src="../pages.scss" lang="scss" />
