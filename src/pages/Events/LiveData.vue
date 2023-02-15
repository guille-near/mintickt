<template>
	<section id="liveData" class="align divcol gap">
		<div class="acenter" style="position: relative">
			<v-btn id="go-back" icon to="/events">
				<v-icon style="color: #ffffff !important">mdi-arrow-left</v-icon>
			</v-btn>
			<h2 style="margin: 0">Event / {{ $route.query.event }}</h2>
		</div>

		<aside class="container-info acenter">
			<div class="divcol">
				<label style="font-size: 16px; transform: translateY(5px)">Tickets sold</label>
				<span>{{ ticketsSold }}</span>
			</div>
			<div class="divcol">
				<label style="font-size: 1em; transform: translateY(5px)">Your income</label>
				<span>{{ incomes.toFixed(2) }} N</span>
			</div>
			<label style="margin-top: auto"
				>≈ USD {{ (lastPrice.lastPrice * incomes).toFixed(2) }}</label
			>
		</aside>

		<div class="divcol">
			<h2 style="margin-bottom: 0.3em">Last updates</h2>
			<label style="font-size: 13px; font-weight: 510">Filter by</label>
		</div>

		<section class="container-down">
			<div class="container-filter acenter">
				<v-card
					v-for="(item, i) in dataFilters"
					:key="i"
					class="divcol"
					:class="{ active: item.active }"
					@click="
						dataFilters.forEach((e) => {
							e.active = false;
						});
						item.active = true;
					"
				>
					<label>{{ item.name }}</label>
					<span>{{ item.value }}</span>
				</v-card>
			</div>
			<v-row no-gutters>
        <h3 class="p vermobile mt-10" style="font-size: 23px">Orders to deliver</h3>
        <!-- <div class="container-search center"> -->
          <!--Modal ticket Url -->
          <v-text-field
            v-model="search"
            :append-icon="search ? '' : 'mdi-magnify'"
            placeholder="Search a nickname or scan it"
            single-line
            hide-details
            clear-icon="mdi-close"
            clearable
            class="search scan"
          >
            <template v-slot:append>
              <v-dialog width="420px" v-model="modalQR">
                <template v-slot:activator="{ on, attrs }">
                  <img src="@/assets/icons/scan.svg" alt="scan button" v-bind="attrs" v-on="on" />
                </template>

                <v-card id="modalUrl" class="pa-10">
                  <StreamBarcodeReader
                    @decode="onDecode"
                    @loaded="onLoaded"
                  ></StreamBarcodeReader>
                </v-card>
              </v-dialog>
            </template>
          </v-text-field>
        <!-- </div> -->
			</v-row>
			<v-data-table
				id="dataTable"
				:loading="loading"
				:search="search"
				v-show="
					dataFilters[dataFilters.findIndex((e) => e.key == 'fans')].active ==
					true
				"
				:headers="isMobile ? headersTableMobile : headersTable"
				:items="dataTable"
				:footer-props="{ 'items-per-page-options': [5, 10, 20, 50, -1] }"
				:mobile-breakpoint="-1"
			>
				<template v-slot:[`item.transaction`]="{ item }">
					<v-btn :href="item.transaction" target="_blank" icon>
						<img
							class="copyImg"
							src="@/assets/icons/link.svg"
							alt="external link"
						/>
					</v-btn>
				</template>

				<template v-slot:[`item.action`]="{ item }">
					<v-btn class="eliminarmobile" @click="completeOrderFans(item)" :loading="item.loadingBtn"
						>Complete order</v-btn
					>
					<v-btn
            class="vermobile" min-width="max-content" max-width="max-content" min-height="max-content" height="max-content"
            style="padding: 1px !important" @click="completeOrderFans(item)" :loading="item.loadingBtn">
            <v-icon>mdi-check</v-icon>
          </v-btn
					>
				</template>
			</v-data-table>

			<!-- <section
				class="vermobile"
				v-show="
					dataFilters[dataFilters.findIndex((e) => e.key == 'fans')].active ==
					true
				"
			>
				<v-card
					v-for="(item, i) in filter_dataTableMobile"
					:key="i"
					class="up divcol"
					style="display: flex"
				>
					<section class="acenter" style="gap: 10px">
						<span class="eventName">{{ item.nft }}</span>
						<span>{{ item.signer }}</span>

						<aside class="acenter" style="gap: 0.5em">
							<v-btn
								class="icon"
								@click="completeOrderFans(item)"
								:loading="item.loadingBtn"
							>
								<v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-check</v-icon>
							</v-btn>

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
							<h3>QUANITTY</h3>
							<span>{{ item.quantity }}</span>
						</div>

						<div class="divcol">
							<h3>CREATED</h3>
							<span>{{ item.created }}</span>
						</div>

						<div class="divcol">
							<h3>TRANSACTION</h3>
							<v-btn :href="item.transaction" target="_blank" icon>
								<img
									class="copyImg"
									src="@/assets/icons/link.svg"
									alt="external link"
								/>
							</v-btn>
						</div>
					</aside>
				</v-card>
			</section> -->


      <!-- people -->
			<v-data-table
				id="dataTable"
				:loading="loading"
				:search="search"
				v-show="
					dataFilters[dataFilters.findIndex((e) => e.key == 'people')].active ==
					true
				"
				:headers="isMobile ? headersTableMobilePeople : headersTablePeople"
				:items="dataTablePeople"
				:footer-props="{ 'items-per-page-options': [5, 10, 20, 50, -1] }"
				:mobile-breakpoint="-1"
			>
				<template v-slot:[`item.transaction`]="{ item }">
					<v-btn :href="item.transaction" target="_blank" icon>
						<img
							class="copyImg"
							src="@/assets/icons/link.svg"
							alt="external link"
						/>
					</v-btn>
				</template>

				<template v-slot:[`item.action`]="{ item }">
					<v-btn class="eliminarmobile" @click="completeOrderFans(item)" :loading="item.loadingBtn"
						>Complete order</v-btn
					>
					<v-btn
            class="vermobile" min-width="max-content" max-width="max-content" min-height="max-content" height="max-content"
            style="padding: 1px !important" @click="completeOrderFans(item)" :loading="item.loadingBtn">
            <v-icon>mdi-check</v-icon>
          </v-btn
					>
				</template>
			</v-data-table>


      <!-- goofie -->
			<v-data-table
				id="dataTable"
				:loading="loading"
				:search="search"
				v-show="
					dataFilters[dataFilters.findIndex((e) => e.key == 'redeemed')]
						.active == true
				"
				:headers="isMobile ? headersTableExtraMobile : headersTableExtra"
				:items="dataTableExtra"
				:footer-props="{ 'items-per-page-options': [5, 10, 20, 50, -1] }"
				:mobile-breakpoint="-1"
			>
				<template v-slot:[`item.transaction`]="{ item }">
					<v-btn :href="item.transaction" target="_blank" icon>
						<img
							class="copyImg"
							src="@/assets/icons/link.svg"
							alt="external link"
						/>
					</v-btn>
				</template>

				<template v-slot:[`item.action`]="{ item }">
					<v-btn class="eliminarmobile" @click="completeOrderReedemer(item)" :loading="item.loadingBtn"
						>Complete order</v-btn
					>
					<v-btn
            class="vermobile" min-width="max-content" max-width="max-content" min-height="max-content" height="max-content"
            style="padding: 1px !important" @click="completeOrderReedemer(item)" :loading="item.loadingBtn">
            <v-icon>mdi-check</v-icon>
          </v-btn
					>
				</template>
			</v-data-table>

			<!-- <section
				class="vermobile"
				v-show="
					dataFilters[dataFilters.findIndex((e) => e.key == 'redeemed')]
						.active == true
				"
			>
				<v-card
					v-for="(item, i) in filter_dataTableExtraMobile"
					:key="i"
					class="up divcol"
					style="display: flex"
				>
					<section class="acenter" style="gap: 10px">
						<span class="eventName">{{ item.ticket }}</span>
						<span>{{ item.signer }}</span>

						<aside class="acenter" style="gap: 0.5em">
							<v-btn
								class="icon"
								@click="completeOrderReedemer(item)"
								:loading="item.loadingBtn"
							>
								<v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-check</v-icon>
							</v-btn>

							<v-icon
								color="white"
								:style="item.show ? 'transform:rotate(180deg)' : ''"
								size="2em"
								@click="
									dataTableExtraMobile.forEach((e) => {
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
							<h3>QUANITTY</h3>
							<span>{{ item.quantity }}</span>
						</div>

						<div class="divcol">
							<h3>CREATED</h3>
							<span>{{ item.created }}</span>
						</div>

						<div class="divcol">
							<h3>TRANSACTION</h3>
							<v-btn :href="item.transaction" target="_blank" icon>
								<img
									class="copyImg"
									src="@/assets/icons/link.svg"
									alt="external link"
								/>
							</v-btn>
						</div>
					</aside>
				</v-card>
			</section> -->
		</section>
	</section>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import moment from "moment";
import gql from "graphql-tag";
const mb_views_nft_tokens_aggregate = gql`
 query MyQuery($user: String!, $metadata_id: String!) {
  nft_earnings_aggregate(
    where: {receiver_id: {_eq: $user}, nft_token: {metadata_id: {_eq: $metadata_id}}}
  ) {
    aggregate {
      count
      sum {
        amount
      }
    }
  }
}
`;
const redeemed_tokens_aggregate = gql`
  query MyQuery($_iregex: String!) {
    mb_views_nft_tokens_aggregate(
      where: {
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
        extra: { _eq: "redeemed" }
        burned_receipt_id: { _is_null: false }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
const fans_tokens_aggregate = gql`
  query MyQuery($_iregex: String!) {
    mb_views_nft_tokens_aggregate(
      where: {
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
        extra: { _eq: "ticketing" }
        burned_receipt_id: { _is_null: false }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
const burned_fans_tokens_aggregate = gql`
  query MyQuery($_iregex: String!) {
    fansinsides(where: { thingid: $_iregex }) {
      tokenid
    }
  }
`;
const burned_reedemed_tokens_aggregate = gql`
  query MyQuery($_iregex: String!) {
    redeemers(where: { thingid: $_iregex }) {
      tokenid
    }
  }
`;
const tickets = gql`
  query MyQuery($_iregex: String!, $tokens: [String]!, $owner: String) {
  mb_views_nft_tokens(
    where: {reference_blob: {_cast: {String: {_iregex: $_iregex}}}
      , extra: {_eq: "ticketing"}, burned_receipt_id: {_is_null: false}
      , token_id: {_nin: $tokens}, owner: {_like: $owner}}
  ) {
    description
    token_id
    owner
    last_transfer_timestamp
    minted_receipt_id
    nft_contract_created_at
    minted_timestamp
    last_transfer_receipt_id
    burned_receipt_id
    title
    burned_timestamp
  }
}

`;
const goods_redeemed = gql`
  query MyQuery($_iregex: String!, $tokens: [String]!, $owner: String) {
  mb_views_nft_tokens(
    where: {reference_blob: {_cast: {String: {_iregex: $_iregex}}}
      , extra: {_eq: "redeemed"}, burned_receipt_id: {_is_null: false}
      , token_id: {_nin: $tokens}, owner: {_like: $owner}}
  ) {
    description
    token_id
    owner
    last_transfer_timestamp
    minted_receipt_id
    nft_contract_created_at
    minted_timestamp
    last_transfer_receipt_id
    burned_receipt_id
    title
    burned_timestamp
  }
}
`;
export default {
  name: "LiveData",
   components: { StreamBarcodeReader },
  data() {
    return {
      isMobile: false,
      dataFilters: [
        {
          key: "fans",
          name: "Check-ins",
          value: "0/0",
          active: true,
        },
        {
          key: "people",
          name: "People inside",
          value: "0/0",
          active: false,
        },
        {
          key: "redeemed",
          name: "Goodies redeemed",
          value: "0/0",
          active: false,
        },
      ],
      headersTable: [
        { value: "nft", text: "NFT" },
        { value: "signer", text: "SIGNER" },
        { value: "quantity", text: "QUANTITY" },
        { value: "created", text: "CREATED" },
        { value: "transaction", text: "TRANSACTION", sortable: false },
        { value: "action", text: "ACTION", sortable: false },
      ],
      headersTableMobile: [
        { value: "signer", text: "SIGNER" },
        { value: "created", text: "CREATED" },
        { value: "action", text: "ACTION", align: "end", sortable: false },
      ],
      dataTable: [],
      dataTableMobile: [],
      headersTablePeople: [
        { value: "nft", text: "NFT" },
        { value: "signer", text: "SIGNER" },
        { value: "quantity", text: "QUANTITY" },
        { value: "created", text: "CREATED" },
        { value: "transaction", text: "TRANSACTION", sortable: false },
        { value: "action", text: "ACTION", sortable: false },
      ],
      headersTableMobilePeople: [
        { value: "signer", text: "SIGNER" },
        { value: "created", text: "CREATED" },
        { value: "action", text: "ACTION", align: "end", sortable: false },
      ],
      dataTablePeople: [],
      dataTableMobilePeople: [],
      headersTableExtra: [
        { value: "nft", text: "NFT" },
        { value: "signer", text: "SIGNER" },
        { value: "quantity", text: "QUANTITY" },
        { value: "created", text: "CREATED" },
        { value: "transaction", text: "TRANSACTION", sortable: false },
        { value: "action", text: "ACTION", sortable: false },
      ],
      headersTableExtraMobile: [
        { value: "signer", text: "SIGNER" },
        { value: "created", text: "CREATED" },
        { value: "action", text: "ACTION", align: "end", sortable: false },
      ],
      dataTableExtra: [],
      dataTableExtraMobile: [],
      ticketsSold: 0,
      incomes: 0,
      lastPrice: [],
      fans_inside_total_of: 0,
      fans_inside_tota: 0,
      loading: true,
      search: "",
      modalQR: false,
      owner: "%"
    };
  },
  mounted() {
    if (!this.$session.exists()) {
      this.$session.start()
    }
    this.IsMobile()
    window.addEventListener("resize", this.IsMobile)
    this.responsive();
    this.fetch();
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.IsMobile)
  },
  computed: {
    filter_dataTableExtraMobile() {
      let filter = this.dataTableExtraMobile
      
      if (this.search) filter = filter.filter(data => data.ticket.includes(this.search))

      return filter
    },
    filter_dataTableMobilePeople() {
      let filter = this.dataTableMobilePeople
      
      if (this.search) filter = filter.filter(data => data.ticket.includes(this.search))

      return filter
    },
    filter_dataTableMobile() {
      let filter = this.dataTableMobile
      
      if (this.search) filter = filter.filter(data => data.nft.includes(this.search))

      return filter
    },
  },
  methods: {
    IsMobile() {
      if (window.innerWidth <= 880) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    responsive() {
      if (window.innerWidth <= 880) {
        this.headersTable.splice(
          this.headersTable.findIndex((e) => e.value == "quantity"),
          1
        );
        this.headersTable.splice(
          this.headersTable.findIndex((e) => e.value == "action"),
          1
        );
        this.headersTable[
          this.headersTable.findIndex((e) => e.value == "transaction")
        ].text = "TX";
      }
    },
    async getData() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      this.dataTable = [];
      this.dataTableMobile = [];
      // this.dataTablePeople = [];
      // this.dataTableMobilePeople = [];
      this.dataTableExtra = [];
      this.dataTableExtraMobile = [];
      const user = datos.accountId;
      var metadata_id = this.$route.query.thingid.toLowerCase();
      this.$apollo
        .query({
          query: mb_views_nft_tokens_aggregate,
          variables: {
            user: user,
            metadata_id: metadata_id,
          },
        })
        .then((response) => {
          this.ticketsSold =
            response.data.nft_earnings_aggregate.aggregate.count;
          this.incomes =
            response.data.nft_earnings_aggregate.aggregate.sum.amount /
            Math.pow(10, 24);
          this.getFansInside();
          this.getExtra();
          this.getExtraFilter();
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    //Data extra to get burned, beers, tshirts, pop corn, etc
    async getExtra() {
      var rows = [];
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      var arr = [];
      this.$apollo
        .mutate({
          mutation: burned_reedemed_tokens_aggregate,
          variables: {
            _iregex: thingid[1],
          },
          client: "mintickClient",
        })
        .then((res) => {
          arr = res.data.redeemers.map(function (el) {
            return el.tokenid;
          });
          this.$apollo
            .query({
              query: goods_redeemed,
              variables: {
                _iregex: thingid[1],
                tokens: arr,
                owner: this.owner
              },
            })
            .then((response) => {
              //Get the first object and loop
              Object.entries(response.data.mb_views_nft_tokens).forEach(
                ([key, value]) => {
                  var startTime =
                    value.last_transfer_receipt_id === null
                      ? moment.utc(value.burned_timestamp)
                      : moment.utc(value.last_transfer_timestamp);
                  var endTime = moment.utc(new Date());
                  var minutesDiff = endTime.diff(startTime, "minutes");
                  var hoursDiff = endTime.diff(startTime, "hours");
                  var daysDiff = endTime.diff(startTime, "day");
                  var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
                  var time2 = time > 24 ? daysDiff : time;
                  var timedesc =
                    minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
                  var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
                  var receipe = value.burned_receipt_id;
                  rows = {
                    nft: value.title,
                    signer: value.owner,
                    quantity: 1,
                    created: time2 + " " + timedesc2,
                    transaction:
                      this.$explorer + receipe,
                    tokenid: value.token_id,
                    loadingBtn: false,
                    show: false,
                    key: key
                  };
                  this.dataTableExtra.push(rows);
                  this.dataTableExtraMobile.push(rows);
                  this.dataTableExtra.sort((a, b) => (a.key > b.key) ? -1 : 1);
                  this.dataTableExtraMobile.sort((a, b) => (a.key > b.key) ? -1 : 1);
                }
              );
            }) //mintickt query
            .catch((err) => {
              console.log("Error", err);
            });
        })
        .catch((err) => {
          console.log("Error", err);
        })
        .finally(() => (this.loading = false));
    },
    async getExtraFilter() {
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      //console.log(Object.values(this.dataFilters)[0].value)
      //reedemed
      this.$apollo
        .query({
          query: redeemed_tokens_aggregate,
          variables: {
            _iregex: thingid[1],
          },
        })
        .then((response) => {
          //Burned reedemed burned_fans_tokens_aggregate
          this.$apollo
            .query({
              query: burned_reedemed_tokens_aggregate,
              variables: {
                _iregex: thingid[1],
              },
              client: "mintickClient",
            })
            .then((res) => {
              Object.values(this.dataFilters)[1].value =
                res.data.redeemers.length +
                " / " +
                response.data.mb_views_nft_tokens_aggregate.aggregate.count;
            })
            .catch((err) => {
              console.log("Error", err);
            })
            .finally(() => (this.loading = false));
        })
        .catch((err) => {
          console.log("Error", err);
        })
        .finally(() => (this.loading = false));

      //Fans inside
      this.$apollo
        .query({
          query: fans_tokens_aggregate,
          variables: {
            _iregex: thingid[1],
          },
        })
        .then((response) => {
          //Burned reedemed burned_fans_tokens_aggregate
          this.$apollo
            .query({
              query: burned_fans_tokens_aggregate,
              variables: {
                _iregex: thingid[1],
              },
              client: "mintickClient",
            })
            .then((res) => {
              Object.values(this.dataFilters)[0].value =
                res.data.fansinsides.length +
                " / " +
                response.data.mb_views_nft_tokens_aggregate.aggregate.count;
            })
            .catch((err) => {
              console.log("Error", err);
            })
            .finally(() => (this.loading = false));
        })
        .catch((err) => {
          console.log("Error", err);
        })
        .finally(() => (this.loading = false));
    },
    //Data extra to get burned, beers, tshirts, pop corn, etc
    async getFansInside() {
      var rows = [];
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      var arr = [];
      this.$apollo
        .mutate({
          mutation: burned_fans_tokens_aggregate,
          variables: {
            _iregex: thingid[1],
          },
          client: "mintickClient",
        })
        .then((res) => {
          arr = res.data.fansinsides.map(function (el) {
            return el.tokenid;
          });
          this.$apollo
            .query({
              query: tickets,
              variables: {
                _iregex: thingid[1],
                tokens: arr,
                owner: this.owner
              },
            })
            .then((response) => {
              //Get the first object and loop
              Object.entries(response.data.mb_views_nft_tokens).forEach(
                ([key, value]) => {
                  var startTime =
                    value.last_transfer_receipt_id === null
                      ? moment.utc(value.burned_timestamp)
                      : moment.utc(value.last_transfer_timestamp);
                  var endTime = moment.utc(new Date());
                  var minutesDiff = endTime.diff(startTime, "minutes");
                  var hoursDiff = endTime.diff(startTime, "hours");
                  var daysDiff = endTime.diff(startTime, "day");
                  var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
                  var time2 = time > 24 ? daysDiff : time;
                  var timedesc =
                    minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
                  var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
                  var receipe = value.burned_receipt_id;
                  rows = {
                    nft: value.title,
                    signer: value.owner,
                    quantity: 1,
                    created: time2 + " " + timedesc2,
                    transaction:
                      this.$explorer + receipe,
                    tokenid: value.token_id,
                    loadingBtn: false,
                    show: false,
                    key: key
                  };
                  this.dataTable.push(rows);
                  this.dataTableMobile.push(rows);
                  this.dataTable.sort((a, b) => (a.key > b.key) ? -1 : 1);
                  this.dataTableMobile.sort((a, b) => (a.key > b.key) ? -1 : 1);
                }
              );
            }) //mintickt query
            .catch((err) => {
              console.log("Error", err);
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
    fetch() {
      const BINANCE_NEAR =
        this.$binance;
      var request = new XMLHttpRequest();
      request.open("GET", BINANCE_NEAR);
      request.send();
      request.onload = () => {
        this.lastPrice = JSON.parse(request.responseText);
      };
    },
    async completeOrderFans(element) {
      element.loadingBtn = true;
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      const url = this.$node_url + "/fans";
      let item = {
        thingid: thingid[1],
        tokenid: element.tokenid,
      };
      this.axios
        .post(url, item)
        .then(() => {
          // setTimeout( () => {
          // this.getData();
          // this.loadingBtn = false;
          // } , 3000 );
          this.$router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async completeOrderReedemer(element) {
      element.loadingBtn = true;
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      const url = this.$node_url + "/redeemed";
      let item = {
        thingid: thingid[1],
        tokenid: element.tokenid,
      };
      this.axios
        .post(url, item)
        .then(() => {
          // setTimeout( () => {
          // this.getData();
          // this.$forceUpdate();
          // this.loadingBtn = false;
          // } , 3000 );
          this.$router.go(0);
          
        })
        .catch((error) => {
          console.log(error);
        });
        
        
    },
     ModalQR() {
        this.modalQR=true
    },  
    onDecode(result) {
      // this.owner = result.split(":")[1];
      // this.dataTableMobile = [];
      // this.dataTableExtraMobile = [];
      // this.dataTable = [];
      // this.dataTableExtra = [];
      // this.getFansInside();
      // this.getExtra();
      // this.$forceUpdate();
      this.search = result.includes(":") ? result.split(":")[1] : result;
      this.$forceUpdate();
      setTimeout(this.modalQR = false, 5000);
      // console.log(`Decode text from QR code is ${this.owner}`)
    },
    onLoaded() {
      console.log(`Ready to start scanning barcodes`)
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
