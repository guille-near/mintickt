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
			class="eliminarmobile"
		>
			<template v-slot:[`item.image`]="{ item }">
        <!-- <img id="bgTicket" src="@/assets/img/bg-ticket_events.png" alt="bg ticket"> -->
        <img id="bgTicket-image" :src="getIpfs(item.thingid)" alt="event image">
			</template>

			<template v-slot:[`item.name`]="{ item }">
        <v-btn style="color:white" text :href="$store_site + item.thingid" target="_blank" >{{ item.name }}</v-btn>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<div class="cont_buttons" style="gap: 10px">
					<v-btn @click="goLiveData(item.name, item.thingid)"
						>Go to live data</v-btn
					>
					<v-btn @click="goOptions(item.name, item.thingid)"
						><v-icon size="1.5em">mdi-cog-outline</v-icon></v-btn
					>
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
			<v-card
				v-for="(item, i) in filter_dataTableMobile"
				:key="i"
				class="up divcol"
				style="display: flex"
			>
				<section class="acenter">
					<span class="eventName">
						<v-btn style="color:white" text :href="$store_site + item.thingid" target="_blank" >{{ item.name }}</v-btn>
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

					<div class="divcol">
						<h3>TICKETS LISTED</h3>
						<span>{{ item.listed }}</span>
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
	</section>
</template>

<script>
import gql from "graphql-tag";
import { Wallet, Chain } from "mintbase";
const your_events = gql`
  query MyQuery($store: String!, $user: String!) {
  mb_views_nft_metadata(
    where: {nft_contract_id: {_eq: $store}
      , listings: {price: {_is_null: false}, minter: {_eq: $user}}}
  ) {
    title
    reference_blob
    id
    listings_aggregate {
      aggregate {
        count
      }
    }
    nft_contract_owner_id
  }
}
`;
const mb_views_nft_tokens_aggregate = gql`
  query MyQuery($store: String!, $user: String!, $metadata_id: String!) {
  nft_tokens_aggregate(
    where: {nft_contract_id: {_eq: $store}, metadata_id: {_eq: $metadata_id}}
  ) {
    aggregate {
      count
    }
  }
  nft_earnings_aggregate(
    where: {receiver_id: {_eq: $user}, nft_token: {metadata_id: {_eq: $metadata_id}}}
  ) {
    aggregate {
      count
    }
  }
}
`;
const main_image = gql`
  query MyQuery($thing_id: String!) {
  ipfs(where: {thingid_contains: $thing_id}) {
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
        { align: "start", value: "image" },
        { text: "NAME", align: "start", value: "name" },
        { text: "DATE", align: "start", value: "date" },
        { text: "TICKETS MINTED", align: "start", value: "minted" },
        { text: "TICKETS SOLD", align: "start", value: "sold" },
        { text: "TICKETS LISTED", align: "start", value: "listed" },
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
      let filter = this.dataTableMobile
      
      if (this.search) filter = filter.filter(data => data.name.includes(this.search))

      return filter
    }
  },
  mounted() {
    if (!this.$session.exists()) {
      this.$session.start()
    }
    this.scanListener()
    this.revisar();
    this.getData();
    this.pollData();
    this.mainImg();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (
      urlParams.get("transactionHashes") !== null
    ) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/events"
      );
    }
    if (
      urlParams.get("transactionHashes") !== null &&
      urlParams.get("signMeta") === "approve"
    ) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/events"
      );
    }
    if (
      urlParams.get("transactionHashes") !== null &&
      urlParams.get("signMeta") === "goodies"
    ) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/events"
      );
    }
     if (
      urlParams.get("errorCode") !== null
    ) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/events"
      );
    }
  },
  methods: {
    async getData() {
      this.progress = true;
      this.data = [];
      this.dataTableMobile = [];
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      var rows = [];
      this.$apollo
        .query({
          query: your_events,
          variables: {
            store: this.$store_mintbase,
            user: user
          },
        })
        .then((response) => {
          var options = { year: "numeric", month: "short", day: "numeric" }; //Format data
          //Map the objectvalue
          Object.entries(response.data).forEach(([key, value]) => {
            // inner object entries
            Object.entries(value).forEach(([i, value1]) => {
              //Getting the minted nft
              //Tokens aggregate and earnings by metadata id
              this.$apollo
                .query({
                  query: mb_views_nft_tokens_aggregate,
                  variables: {
                    store: this.$store_mintbase,
                    user: user,
                    metadata_id: value1.id,
                  },
                })
                .then((response) => {
                  rows = {
                    name: value1.title,
                    date: new Date(
                      value1.reference_blob.extra[6].value * 1000
                    ).toLocaleDateString("en-US", options),
                    location: value1.reference_blob.extra[0].value,
                    minted: response.data.nft_tokens_aggregate.aggregate.count,
                    sold: response.data.nft_earnings_aggregate.aggregate.count,
                    listed: value1.listings_aggregate.aggregate.count,
                    thingid: value1.id,
                    show: false,
                    key: i
                  };
                  this.data.push(rows);
                  this.data.sort((a, b) => (a.key > b.key) ? -1 : 1);
                  this.dataTableMobile.push(rows);
                  this.dataTableMobile.sort((a, b) => (a.key > b.key) ? -1 : 1);
                })
                .catch((err) => {
                  console.log("Error", err);
                });
            });
          });
          
        })
        .catch((err) => {
          console.log("Error", err);
        })
        .finally(() => (this.loading = false));
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
      this.$session.get('eventid', pthingid)
      this.$session.get('event_name', pevent)
    },
    goOptions(pevent, pthingid) {
      this.$router.push({
        path: "/events/options",
        query: { event: pevent, thingid: pthingid },
      });
      this.$session.get('eventid', pthingid)
      this.$session.get('event_name', pevent)
    },
    fetch() {
      const BINANCE_NEAR =
        "https://api.binance.com/api/v3/ticker/24hr?symbol=NEARUSDT";
      var request = new XMLHttpRequest();
      request.open("GET", BINANCE_NEAR);
      request.send();
      request.onload = () => {
        this.lastPrice = JSON.parse(request.responseText);
      };
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
      console.info(isConnected)
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
        let datos = JSON.parse(
          localStorage.getItem("Mintbase.js_wallet_auth_key")
        );
        this.user = datos.accountId;
        
      } 
    },
    copySiteLink(id) {
      this.loading = true;
      this.$copyText(this.$store_site+id).then(
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
        let datos = JSON.parse(localStorage.getItem("Mintbase.js_wallet_auth_key"));
        const user = datos.accountId;
        this.search = user
      } else {
        this.search = ""
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
        if(this.src.filter(thingid => thingid.thingid == value)[0] === undefined){
          return this.$pinata_gateway + "QmT26Az6EsepW3U5NpYtP3g78NwL4biEfNPECowPiNt5wm";
        } else {
          	var src = this.src
						.filter(thingid => thingid.thingid == value)[0]
						.tokenid;
					return this.$pinata_gateway + src;
        }   
			},
    ModalQR() {
        this.modalQR=true
    },  
    onDecode(result) {
      this.modalQR = false;
      console.log(`Decode text from QR code is ${result}`)
      
    },
    onLoaded() {
      console.log(`Ready to start scanning barcodes`)
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
