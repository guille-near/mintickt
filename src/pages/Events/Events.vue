<template>
  <section id="events" class="align divcol">
    <h2>Your Events</h2>
    <!-- <div class="container-search center"> -->
    <v-text-field
      v-model="search"
      :append-icon="search ? '' : 'mdi-magnify'"
      label="Search"
      single-line
      hide-details
      clear-icon="mdi-close"
      clearable
      class="search"
    />
    <!-- </div> -->
    <v-data-table
      id="tableEvents"
      :headers="headers"
      :items="data"
      :loading="loading"
      :search="search"
      :footer-props="{ 'items-per-page-options': [5, 10, 20, 50, -1] }"
      calculate-widths
      :mobile-breakpoint="880"
      :custom-sort="customSort"
      class="eliminarmobile"
    >
      <template v-slot:[`item.image`]="{ item }">
        <!-- <img id="bgTicket" src="@/assets/img/bg-ticket_events.png" alt="bg ticket"> -->
        <img id="bgTicket-image" :src="item.media || hola" alt="event image" />
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <v-btn @click="goEventData(item.id, item.ticket_type)" class="btnWithoutStyles" target="_blank">{{ item.name }}</v-btn>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="cont_buttons" style="gap: 6px">
          <v-btn @click="goLiveData(item.name, item.id)">Go to live data</v-btn>
          <v-btn @click="goOptions(item.name, item.id)"><v-icon size="1.5em">mdi-cog-outline</v-icon></v-btn>
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
      <v-card v-for="(item, i) in filter_dataTableMobile" :key="i" class="up divcol" style="display: flex">
        <section class="acenter">
          <span class="eventName">
            <v-btn @click="goEventData(item.id)" style="color: white; padding: 0" text>{{ item.name.ellipsisRange(14) }}</v-btn>
          </span>
          <span>{{ item.date }}</span>

          <aside class="acenter" style="gap: 0.5em">
            <v-btn class="icon" @click="goLiveData(item.name, item.thingid)">
              <v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-chart-line</v-icon>
            </v-btn>

            <v-btn class="icon" @click="goOptions(item.name, item.thingid)">
              <v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-cog-outline</v-icon>
            </v-btn>

            <!-- <v-btn class="icon" @click="copySiteLink(item.thingid)">
              <v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-content-copy</v-icon>
            </v-btn> -->

            <v-icon
              color="white"
              :style="item.show ? 'transform:rotate(180deg)' : ''"
              size="2em"
              @click="
                dataTableMobile.forEach((e) => {
                  e !== item ? (e.show = false) : null;
                });
                item.show = !item.show;
              "
            >
              mdi-chevron-down
            </v-icon>
          </aside>
        </section>

        <aside v-show="item.show" class="down space">
          <div class="divcol">
            <h3>TICKETS MINTED</h3>
            <span>{{ item.minted }}</span>
          </div>

          <div class="divcol">
            <h3>TICKETS SOLD</h3>
            <span>{{ item.sold }}</span>
          </div>

          <!-- <div class="divcol">
            <h3>TICKETS LISTED</h3>
            <span>{{ item.listed }}</span>
          </div> -->
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
  </section>
</template>

<script>
import moment from "moment";
import gql from "graphql-tag";
import { Wallet, Chain } from "mintbase";
const your_events = gql`
  query MyQuery($user: String!) {
    series(where: { creator_id: $user, typetoken_id: "1" }) {
      title
      nftsold
      supply
      copies
      creator_id
      description
      expires_at
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
  data() {
    return {
      headers: [
        { align: "start", value: "image", sortable: false },
        { text: "NAME", align: "start", value: "name" },
        { text: "DATE", align: "start", value: "date" },
        { text: "TICKETS MINTED", align: "start", value: "minted" },
        { text: "TICKETS SOLD", align: "start", value: "sold" },
        // { text: "TICKETS LISTED", align: "start", value: "listed" },
        { sortable: false, align: "end", value: "actions" },
      ],
      data: [],
      earnings: [],
      search: "",
      loading: true,
      page: 3,
      dataTableMobile: [],
      nearid: false,
      message_ticket: "Copy link",
      src: [],
      modalQR: false,
    };
  },
  computed: {
    filter_dataTableMobile() {
      let filter = this.dataTableMobile;

      if (this.search) filter = filter.filter((data) => data.name.includes(this.search));

      return filter;
    },
  },
  async mounted() {
    if (!this.$session.exists()) {
      this.$session.start();
    }

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
      this.$apollo
        .watchQuery({
          query: your_events,
          variables: {
            user: user,
          },
          pollInterval: 10000, // 10 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          let dataSeries = data.series;
          this.data = [];
          this.dataTableMobile = [];
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
              thingid: dataSeries[i].reference,
              ticket_type: ticketType.value,
              show: false,
              key: i,
              date1: dataSeries[i].title,
              media: dataSeries[i].reference,
            };
            this.data.push(rows);
            this.data.sort((a, b) => (a.date1 > b.date1 ? -1 : 1));
            this.dataTableMobile.push(rows);
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
    goLiveData(pevent, pthingid) {
      this.$router.push({
        path: "/events/liveData",
        query: { event: pevent, thingid: pthingid },
      });
      this.$session.get("eventid", pthingid);
      this.$session.get("event_name", pevent);
    },
    goEventData(eventId, ticketType) {
      this.$router.push({
        path: "/store",
        query: { id: eventId },
      });
      this.$session.set("eventid", eventId);
      // this.$session.get("event_name", pevent);
    },
    goOptions(pevent, pthingid) {
      this.$router.push({
        path: "/events/options",
        query: { event: pevent, thingid: pthingid },
      });
      this.$session.get("eventid", pthingid);
      this.$session.get("event_name", pevent);
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
  },
};
</script>

<style src="../pages.scss" lang="scss" />
