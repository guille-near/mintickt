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
        <label style="font-size: 16px; transform: translateY(5px)"
          >Tickets sold</label
        >
        <span>{{ ticketsSold }}</span>
      </div>
      <div class="divcol">
        <label style="font-size: 1em; transform: translateY(5px)"
          >Your income</label
        >
        <span>{{ incomes.toFixed(2) }} N</span>
      </div>
      <label style="margin-top: auto"
        >≈ {{ (nearPrice * incomes).toFixed(2) }} $USD</label
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
        <h3 class="p vermobile mt-10" style="font-size: 23px">Orders</h3>
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
                <img
                  src="@/assets/icons/scan.svg"
                  alt="scan button"
                  v-bind="attrs"
                  v-on="on"
                />
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
          <v-btn
            class="eliminarmobile"
            @click="completeOrderFans(item)"
            :loading="item.loadingBtn"
            ><v-icon>mdi-checkbox-blank-outline</v-icon> Approve</v-btn
          >
          <v-btn
            class="vermobile"
            min-width="max-content"
            max-width="max-content"
            min-height="max-content"
            height="max-content"
            style="padding: 1px !important"
            @click="completeOrderFans(item)"
            :loading="item.loadingBtn"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
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
          <v-btn
            class="eliminarmobile"
            @click="completeOrderFans(item)"
            disabled
            :loading="item.loadingBtn"
            ><v-icon>mdi-checkbox-marked-outline</v-icon> Approved</v-btn
          >
          <v-btn
            class="vermobile"
            min-width="max-content"
            max-width="max-content"
            min-height="max-content"
            height="max-content"
            style="padding: 1px !important"
            @click="completeOrderFans(item)"
            :loading="item.loadingBtn"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <!-- redeemed -->
      <v-data-table
        id="dataTable"
        :loading="loading"
        :search="search"
        v-show="
          dataFilters[dataFilters.findIndex((e) => e.key == 'redeemed')]
            .active == true
        "
        :headers="isMobile ? headersTableMobileRedeemer : headersTableRedeemer"
        :items="dataTableRedeemer"
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
          <v-btn
            class="eliminarmobile"
            @click="completeOrderFans(item)"
            disabled
            :loading="item.loadingBtn"
            ><v-icon>mdi-checkbox-marked-outline</v-icon> Approved</v-btn
          >
          <v-btn
            class="vermobile"
            min-width="max-content"
            max-width="max-content"
            min-height="max-content"
            height="max-content"
            style="padding: 1px !important"
            @click="completeOrderFans(item)"
            :loading="item.loadingBtn"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <!-- orders -->
      <v-data-table
        id="dataTable"
        :loading="loading"
        :search="search"
        v-show="
          dataFilters[dataFilters.findIndex((e) => e.key == 'orders')].active ==
          true
        "
        :headers="isMobile ? headersTableOrdersMobile : headersTableOrders"
        :items="dataTableOrders"
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
          <v-btn
            class="eliminarmobile"
            @click="completeOrderReedemer(item)"
            :loading="item.loadingBtn"
            >Complete order</v-btn
          >
          <v-btn
            class="vermobile"
            min-width="max-content"
            max-width="max-content"
            min-height="max-content"
            height="max-content"
            style="padding: 1px !important"
            @click="completeOrderReedemer(item)"
            :loading="item.loadingBtn"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
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
									dataTableOrdersMobile.forEach((e) => {
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
import * as nearAPI from "near-api-js";

const { connect, keyStores, utils, Contract } = nearAPI;
const mb_views_nft_tokens_aggregate = gql`
  query MyQuery($user: String!, $metadata_id: String!) {
    nft_earnings_aggregate(
      where: {
        receiver_id: { _eq: $user }
        nft_token: { metadata_id: { _eq: $metadata_id } }
      }
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

const get_data_serie = gql`
  query MyQuery($user: String!, $eventId: String!) {
    series(where: { id: $eventId, creator_id: $user }) {
      updated_at
      typetoken_id
      title
      supply
      starts_at
      reference
      redeemerobjects
      redeemerevents
      price_near
      price
      object_event
      nft_amount_sold
      nftsold
      media
      issued_at
      is_mintable
      id
      fecha
      extra
      expires_at
      description
      creator_id
      copies
      aproved_objects
      aproved_event
    }
  }
`;

const eventsObjects = gql`
  query MyQuery($eventId: String!) {
    series(where: { reference: $eventId }) {
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
      object_event
      price_near
      reference
      starts_at
      typetoken_id
      updated_at
    }
  }
`;

const get_data_objects = gql`
  query MyQuery($objectId: String!) {
    controlaforos(where: {token_object_id: $objectId}) {
      user_burn
      token_object_id
      owner_id
      id
      fecha
      event_id
      aproved
    }
  }
`;
//Extra smart contract to handle tokens burned
//Burned tokens for redeemer
const burned_reedemed_tokens_aggregate = gql`
  query MyQuery($_iregex: String!) {
    redeemers(where: { thingid: $_iregex }) {
      tokenid
    }
  }
`;
//Waiting in line
const waiting_in_line = gql`
  query MyQuery($_iregex: String!, $tokens: [String]!, $owner: String) {
    mb_views_nft_tokens(
      where: {
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
        extra: { _eq: "ticketing" }
        burned_receipt_id: { _is_null: false }
        token_id: { _nin: $tokens }
        owner: { _like: $owner }
      }
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
//peple inside
const people_inside = gql`
  query MyQuery($_iregex: String!, $tokens: [String]!, $owner: String) {
    mb_views_nft_tokens(
      where: {
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
        extra: { _eq: "ticketing" }
        burned_receipt_id: { _is_null: false }
        token_id: { _in: $tokens }
        owner: { _like: $owner }
      }
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
//Redeemed
const goods_order = gql`
  query MyQuery($_iregex: String!, $tokens: [String]!, $owner: String) {
    mb_views_nft_tokens(
      where: {
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
        extra: { _eq: "redeemed" }
        burned_receipt_id: { _is_null: false }
        token_id: { _nin: $tokens }
        owner: { _like: $owner }
      }
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
//Redeemed
const goods_redeemed = gql`
  query MyQuery($_iregex: String!, $tokens: [String]!, $owner: String) {
    mb_views_nft_tokens(
      where: {
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
        extra: { _eq: "redeemed" }
        burned_receipt_id: { _is_null: false }
        token_id: { _in: $tokens }
        owner: { _like: $owner }
      }
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
          name: "Waiting in Line",
          value: "0 / 0",
          active: true,
        },
        {
          key: "people",
          name: "People Inside",
          value: "0 / 0",
          active: false,
        },
        {
          key: "orders",
          name: "Beers Orders",
          value: "0/0",
          active: false,
        },
        {
          key: "redeemed",
          name: "Beers Redeemed",
          value: "0 / 0",
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
      headersTableRedeemer: [
        { value: "nft", text: "NFT" },
        { value: "signer", text: "SIGNER" },
        { value: "quantity", text: "QUANTITY" },
        { value: "created", text: "CREATED" },
        { value: "transaction", text: "TRANSACTION", sortable: false },
        { value: "action", text: "ACTION", sortable: false },
      ],
      headersTableMobileRedeemer: [
        { value: "signer", text: "SIGNER" },
        { value: "created", text: "CREATED" },
        { value: "action", text: "ACTION", align: "end", sortable: false },
      ],
      dataTableRedeemer: [],
      dataTableMobileRedeemer: [],
      headersTableOrders: [
        { value: "nft", text: "NFT" },
        { value: "signer", text: "SIGNER" },
        { value: "quantity", text: "QUANTITY" },
        { value: "created", text: "CREATED" },
        { value: "transaction", text: "TRANSACTION", sortable: false },
        { value: "action", text: "ACTION", sortable: false },
      ],
      headersTableOrdersMobile: [
        { value: "signer", text: "SIGNER" },
        { value: "created", text: "CREATED" },
        { value: "action", text: "ACTION", align: "end", sortable: false },
      ],
      dataTableOrders: [],
      dataTableOrdersMobile: [],
      ticketsSold: 0,
      incomes: 0,
      lastPrice: [],
      fans_inside_total_of: 0,
      fans_inside_tota: 0,
      loading: true,
      search: "",
      modalQR: false,
      owner: "%",
      goodie_title: "",
      nearPrice: 0,
      eventId: null,
      objectId: null
    };
  },
  async mounted() {
    if (!this.$session.exists()) {
      this.$session.start();
    }
    this.eventId = this.$session.get("event_id");
    await this.getNearPrice();

    this.IsMobile();
    window.addEventListener("resize", this.IsMobile);
    this.responsive();
    // this.fetch();
    this.getData();
    this.getDataGeneral()
    //this.pollData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.IsMobile);
  },
  computed: {
    filter_dataTableExtraMobile() {
      let filter = this.dataTableOrdersMobile;

      if (this.search)
        filter = filter.filter((data) => data.ticket.includes(this.search));

      return filter;
    },
    filter_dataTableMobilePeople() {
      let filter = this.dataTableMobilePeople;

      if (this.search)
        filter = filter.filter((data) => data.ticket.includes(this.search));

      return filter;
    },
    filter_dataTableMobile() {
      let filter = this.dataTableMobile;

      if (this.search)
        filter = filter.filter((data) => data.nft.includes(this.search));

      return filter;
    },
  },
  methods: {
    async getNearPrice() {
      const account = await this.$near.account(this.$ramper.getAccountId());
      const contract = new Contract(account, process.env.VUE_APP_CONTRACT_NFT, {
        viewMethods: ["get_tasa"],
        sender: account,
      });

      const price = await contract.get_tasa();
      this.nearPrice = price || 0;
    },
    IsMobile() {
      if (window.innerWidth <= 880) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
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
      const user = this.$ramper.getAccountId()
      console.log(user, this.eventId)
      this.$apollo
        .watchQuery({
          query: get_data_serie,
          variables: {
            user: user,
            eventId: this.eventId,
          },
          pollInterval: 3000, // 10 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          if (data.series.length > 0) {
            console.log("DATA", data.series[0])
            this.ticketsSold = data.series[0].nftsold
            this.incomes = data.series[0].nft_amount_sold / Math.pow(10, 24);
          }
        });
          // this.get_tokens();
          // this.get_tokens_redeemed();
    },
    async getDataGeneral() {
      const user = this.$ramper.getAccountId()
      console.log(user, this.eventId)
      this.$apollo
        .watchQuery({
          query: eventsObjects,
          variables: {
            eventId: this.eventId,
          },
          pollInterval: 3000, // 10 seconds in milliseconds
        })
        .subscribe((response) => {
          const dataEvents = response.data.series;

          for (let i = 0; i < dataEvents.length; i++) {
            if (dataEvents[i].object_event) {
              this.itemTickets = dataEvents[i];
              this.getDataTickets()
            } else if (dataEvents[i].object_event === false) {
              this.itemGoodies = dataEvents[i];
            }
          }
        });
    },
    async getDataTickets() {
      this.$apollo
        .watchQuery({
          query: get_data_objects,
          variables: {
            objectId: this.itemTickets.id,
          },
          pollInterval: 3000, // 10 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          console.log("OBEJCTTT", data)
          const item = {
              nft: "value.title",
              signer: "value.owner",
              quantity: 1,
              created: "time2" + " " + "timedesc2",
              transaction: "this.$explorer" + "?query=" + "receipe",
              tokenid: "value.token_id",
              loadingBtn: false,
              show: false,
              key: "key",
            };
            this.dataTable.push(item);
        });
          // this.get_tokens();
          // this.get_tokens_redeemed();
    },
    //Get tokens
    async get_tokens() {
      var rowsa = [];
      var rowsb = [];
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      var arr = [];
      this.$apollo
        .watchQuery({
          query: burned_tokens_aggregate,
          variables: {
            _iregex: thingid[1],
          },
          client: "mintickClient",
          pollInterval: 5000, // 9 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          //console.log(data);
          arr = data.fansinsides.map(function (el) {
            return el.tokenid;
          });
          //this.$session.set("tokens", arr);
        this.$apollo
        .watchQuery({
          query: waiting_in_line,
          variables: {
            _iregex: thingid[1],
            tokens: arr,
            owner: this.owner,
          },
          pollInterval: 5000, // 10 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          this.dataTable = [];
          this.dataTableMobile = [];
          //Get the first object and loop
          Object.entries(data.mb_views_nft_tokens).forEach(([key, value]) => {
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
            var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
            var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
            var receipe = value.burned_receipt_id;
            rowsa = {
              nft: value.title,
              signer: value.owner,
              quantity: 1,
              created: time2 + " " + timedesc2,
              transaction: this.$explorer + "?query=" + receipe,
              tokenid: value.token_id,
              loadingBtn: false,
              show: false,
              key: key,
            };
            this.dataTable.push(rowsa);
            this.dataTableMobile.push(rowsa);
            this.dataTable.sort((a, b) => (a.startTime > b.startTime ? -1 : 1));
            this.dataTableMobile.sort((a, b) => (a.key > b.key ? -1 : 1));
          });
          //this.loading = false;
          this.dataFilters[0].value =
            this.dataTable.length +
            " / " +
            (this.dataTable.length + arr.length);
        });

        this.$apollo
        .watchQuery({
          query: people_inside,
          variables: {
            _iregex: thingid[1],
            tokens: arr,
            owner: this.owner,
          },
          pollInterval: 8000, // 10 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          this.dataTablePeople = [];
          this.dataTableMobilePeople = [];
          //Get the first object and loop
          Object.entries(data.mb_views_nft_tokens).forEach(([key, value]) => {
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
            var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
            var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
            var receipe = value.burned_receipt_id;
            rowsb = {
              nft: value.title,
              signer: value.owner,
              quantity: 1,
              created: time2 + " " + timedesc2,
              transaction: this.$explorer + "?query=" + receipe,
              tokenid: value.token_id,
              loadingBtn: false,
              show: false,
              key: key,
            };
            this.dataTablePeople.push(rowsb);
            this.dataTableMobilePeople.push(rowsb);
            this.dataTablePeople.sort((a, b) => (a.key > b.key ? -1 : 1));
            this.dataTableMobilePeople.sort((a, b) => (a.key > b.key ? -1 : 1));
          });
          //this.loading = false;
          this.dataFilters[1].value = arr.length;
        });
        });
    },
    async get_tokens_redeemed() {
      var rowsa = [];
      var rowsb = [];
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      var arr = [];
      this.$apollo
        .watchQuery({
          query: burned_reedemed_tokens_aggregate,
          variables: {
            _iregex: thingid[1],
          },
          client: "mintickClient",
          pollInterval: 5000, // 9 seconds in milliseconds
        })
        .subscribe(({ data }) => {
          //console.log(data);
          arr = data.redeemers.map(function (el) {
            return el.tokenid;
          });
            //this.$session.set("tokensRedeemed", arr);
            this.$apollo
            .watchQuery({
              query: goods_order,
              variables: {
                _iregex: thingid[1],
                tokens: arr,
                owner: this.owner,
              },
              pollInterval: 8000, // 10 seconds in milliseconds
            })
            .subscribe(({ data }) => {
              this.dataTableOrders = [];
              this.dataTableOrdersMobile = [];
              //Get the first object and loop
              Object.entries(data.mb_views_nft_tokens).forEach(([key, value]) => {
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
                var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
                var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
                var receipe = value.burned_receipt_id;
                rowsa = {
                  nft: value.title,
                  signer: value.owner,
                  quantity: 1,
                  created: time2 + " " + timedesc2,
                  transaction: this.$explorer + "?query=" + receipe,
                  tokenid: value.token_id,
                  loadingBtn: false,
                  show: false,
                  key: key,
                };
                this.dataTableOrders.push(rowsa);
                this.dataTableOrdersMobile.push(rowsa);
                this.dataTableOrders.sort((a, b) => (a.key > b.key ? -1 : 1));
                this.dataTableOrdersMobile.sort((a, b) => (a.key > b.key ? -1 : 1));
              });
              //this.loading = false;
              this.dataFilters[2].value =
                this.dataTableOrders.length +
                " / " +
                (this.dataTableOrders.length + arr.length);
            });

            this.$apollo
              .watchQuery({
                query: goods_redeemed,
                variables: {
                  _iregex: thingid[1],
                  tokens: arr,
                  owner: this.owner,
                },
                pollInterval: 8000, // 10 seconds in milliseconds
              })
              .subscribe(({ data }) => {
                //console.log('data', data)
                this.dataTableRedeemer = [];
                this.dataTableMobileRedeemer = [];
                //Get the first object and loop
                Object.entries(data.mb_views_nft_tokens).forEach(([key, value]) => {
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
                  var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
                  var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
                  var receipe = value.burned_receipt_id;
                  rowsb = {
                    nft: value.title,
                    signer: value.owner,
                    quantity: 1,
                    created: time2 + " " + timedesc2,
                    transaction: this.$explorer + "?query=" + receipe,
                    tokenid: value.token_id,
                    loadingBtn: false,
                    show: false,
                    key: key,
                  };
                  this.dataTableRedeemer.push(rowsb);
                  this.dataTableMobileRedeemer.push(rowsb);
                  this.dataTableRedeemer.sort((a, b) => (a.key > b.key ? -1 : 1));
                  this.dataTableMobileRedeemer.sort((a, b) =>
                    a.key > b.key ? -1 : 1
                  );
                });
                this.loading = false;
                this.dataFilters[3].value = arr.length;
              });
        });
    },
    //Waiting in line
    // async get_waiting_in_line() {
    //   var rows = [];
    //   var thingid = this.$route.query.thingid.toLowerCase().split(":");
    //   this.$apollo
    //     .watchQuery({
    //       query: waiting_in_line,
    //       variables: {
    //         _iregex: thingid[1],
    //         tokens: this.$session.get("tokens") === null ? "" : this.$session.get("tokens"),
    //         owner: this.owner,
    //       },
    //       pollInterval: 10000, // 10 seconds in milliseconds
    //     })
    //     .subscribe(({ data }) => {
    //       this.dataTable = [];
    //       this.dataTableMobile = [];
    //       //Get the first object and loop
    //       Object.entries(data.mb_views_nft_tokens).forEach(([key, value]) => {
    //         var startTime =
    //           value.last_transfer_receipt_id === null
    //             ? moment.utc(value.burned_timestamp)
    //             : moment.utc(value.last_transfer_timestamp);
    //         var endTime = moment.utc(new Date());
    //         var minutesDiff = endTime.diff(startTime, "minutes");
    //         var hoursDiff = endTime.diff(startTime, "hours");
    //         var daysDiff = endTime.diff(startTime, "day");
    //         var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
    //         var time2 = time > 24 ? daysDiff : time;
    //         var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
    //         var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
    //         var receipe = value.burned_receipt_id;
    //         rows = {
    //           nft: value.title,
    //           signer: value.owner,
    //           quantity: 1,
    //           created: time2 + " " + timedesc2,
    //           transaction: this.$explorer + "?query=" + receipe,
    //           tokenid: value.token_id,
    //           loadingBtn: false,
    //           show: false,
    //           key: key,
    //         };
    //         this.dataTable.push(rows);
    //         this.dataTableMobile.push(rows);
    //         this.dataTable.sort((a, b) => (a.startTime > b.startTime ? -1 : 1));
    //         this.dataTableMobile.sort((a, b) => (a.key > b.key ? -1 : 1));
    //       });
    //       //this.loading = false;
    //       this.dataFilters[0].value =
    //         this.dataTable.length +
    //         " / " +
    //         (this.dataTable.length + this.$session.get("tokens").length);
    //     });
    // },
    //People inside
    // async get_people_inside() {
    //   var rows = [];
    //   var thingid = this.$route.query.thingid.toLowerCase().split(":");
    //   this.$apollo
    //     .watchQuery({
    //       query: people_inside,
    //       variables: {
    //         _iregex: thingid[1],
    //         tokens: this.$session.get("tokens") === null ? "" : this.$session.get("tokens"),
    //         owner: this.owner,
    //       },
    //       pollInterval: 10000, // 10 seconds in milliseconds
    //     })
    //     .subscribe(({ data }) => {
    //       this.dataTablePeople = [];
    //       this.dataTableMobilePeople = [];
    //       //Get the first object and loop
    //       Object.entries(data.mb_views_nft_tokens).forEach(([key, value]) => {
    //         var startTime =
    //           value.last_transfer_receipt_id === null
    //             ? moment.utc(value.burned_timestamp)
    //             : moment.utc(value.last_transfer_timestamp);
    //         var endTime = moment.utc(new Date());
    //         var minutesDiff = endTime.diff(startTime, "minutes");
    //         var hoursDiff = endTime.diff(startTime, "hours");
    //         var daysDiff = endTime.diff(startTime, "day");
    //         var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
    //         var time2 = time > 24 ? daysDiff : time;
    //         var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
    //         var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
    //         var receipe = value.burned_receipt_id;
    //         rows = {
    //           nft: value.title,
    //           signer: value.owner,
    //           quantity: 1,
    //           created: time2 + " " + timedesc2,
    //           transaction: this.$explorer + "?query=" + receipe,
    //           tokenid: value.token_id,
    //           loadingBtn: false,
    //           show: false,
    //           key: key,
    //         };
    //         this.dataTablePeople.push(rows);
    //         this.dataTableMobilePeople.push(rows);
    //         this.dataTablePeople.sort((a, b) => (a.key > b.key ? -1 : 1));
    //         this.dataTableMobilePeople.sort((a, b) => (a.key > b.key ? -1 : 1));
    //       });
    //       //this.loading = false;
    //       this.dataFilters[1].value = this.$session.get("tokens").length;
    //     });
    // },
    //Redeemed
    // async get_orders() {
    //   var rows = [];
    //   var thingid = this.$route.query.thingid.toLowerCase().split(":");
    //   this.$apollo
    //     .watchQuery({
    //       query: goods_order,
    //       variables: {
    //         _iregex: thingid[1],
    //         tokens: this.$session.get("tokensRedeemed") === null ? "" : this.$session.get("tokensRedeemed"),
    //         owner: this.owner,
    //       },
    //       pollInterval: 10000, // 10 seconds in milliseconds
    //     })
    //     .subscribe(({ data }) => {
    //       this.dataTableOrders = [];
    //       this.dataTableOrdersMobile = [];
    //       //Get the first object and loop
    //       Object.entries(data.mb_views_nft_tokens).forEach(([key, value]) => {
    //         var startTime =
    //           value.last_transfer_receipt_id === null
    //             ? moment.utc(value.burned_timestamp)
    //             : moment.utc(value.last_transfer_timestamp);
    //         var endTime = moment.utc(new Date());
    //         var minutesDiff = endTime.diff(startTime, "minutes");
    //         var hoursDiff = endTime.diff(startTime, "hours");
    //         var daysDiff = endTime.diff(startTime, "day");
    //         var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
    //         var time2 = time > 24 ? daysDiff : time;
    //         var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
    //         var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
    //         var receipe = value.burned_receipt_id;
    //         rows = {
    //           nft: value.title,
    //           signer: value.owner,
    //           quantity: 1,
    //           created: time2 + " " + timedesc2,
    //           transaction: this.$explorer + "?query=" + receipe,
    //           tokenid: value.token_id,
    //           loadingBtn: false,
    //           show: false,
    //           key: key,
    //         };
    //         this.dataTableOrders.push(rows);
    //         this.dataTableOrdersMobile.push(rows);
    //         this.dataTableOrders.sort((a, b) => (a.key > b.key ? -1 : 1));
    //         this.dataTableOrdersMobile.sort((a, b) => (a.key > b.key ? -1 : 1));
    //       });
    //       //this.loading = false;
    //       this.dataFilters[2].value =
    //         this.dataTableOrders.length +
    //         " / " +
    //         (this.dataTableOrders.length + this.$session.get("tokensRedeemed").length);
    //     });
    // },
    // async get_redeemed() {
    //   var rows = [];
    //   var thingid = this.$route.query.thingid.toLowerCase().split(":");
    //   this.$apollo
    //     .watchQuery({
    //       query: goods_redeemed,
    //       variables: {
    //         _iregex: thingid[1],
    //         tokens: this.$session.get("tokensRedeemed") === null ? "" : this.$session.get("tokensRedeemed"),
    //         owner: this.owner,
    //       },
    //       pollInterval: 10000, // 10 seconds in milliseconds
    //     })
    //     .subscribe(({ data }) => {
    //       //console.log('data', data)
    //       this.dataTableRedeemer = [];
    //       this.dataTableMobileRedeemer = [];
    //       //Get the first object and loop
    //       Object.entries(data.mb_views_nft_tokens).forEach(([key, value]) => {
    //         var startTime =
    //           value.last_transfer_receipt_id === null
    //             ? moment.utc(value.burned_timestamp)
    //             : moment.utc(value.last_transfer_timestamp);
    //         var endTime = moment.utc(new Date());
    //         var minutesDiff = endTime.diff(startTime, "minutes");
    //         var hoursDiff = endTime.diff(startTime, "hours");
    //         var daysDiff = endTime.diff(startTime, "day");
    //         var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
    //         var time2 = time > 24 ? daysDiff : time;
    //         var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
    //         var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
    //         var receipe = value.burned_receipt_id;
    //         rows = {
    //           nft: value.title,
    //           signer: value.owner,
    //           quantity: 1,
    //           created: time2 + " " + timedesc2,
    //           transaction: this.$explorer + "?query=" + receipe,
    //           tokenid: value.token_id,
    //           loadingBtn: false,
    //           show: false,
    //           key: key,
    //         };
    //         this.dataTableRedeemer.push(rows);
    //         this.dataTableMobileRedeemer.push(rows);
    //         this.dataTableRedeemer.sort((a, b) => (a.key > b.key ? -1 : 1));
    //         this.dataTableMobileRedeemer.sort((a, b) =>
    //           a.key > b.key ? -1 : 1
    //         );
    //       });
    //       this.loading = false;
    //       this.dataFilters[3].value = this.$session.get("tokensRedeemed").length;
    //     });
    // },
    fetch() {
      const BINANCE_NEAR = this.$binance;
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
            setTimeout( ()=> element.loadingBtn = false, 1500 );
            //setTimeout( ()=> this.$router.go(0), 3000);
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
      //console.log(url, item);
      this.axios
        .post(url, item)
        .then(() => {
            setTimeout( ()=> element.loadingBtn = false, 1500 );
            //setTimeout( ()=> this.$router.go(0), 3000);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ModalQR() {
      this.modalQR = true;
    },
    onDecode(result) {
      // this.owner = result.split(":")[1];
      // this.dataTableMobile = [];
      // this.dataTableOrdersMobile = [];
      // this.dataTable = [];
      // this.dataTableOrders = [];
      // this.getFansInside();
      // this.getExtra();
      // this.$forceUpdate();
      this.search = result.includes(":") ? result.split(":")[1] : result;
      this.$forceUpdate();
      setTimeout((this.modalQR = false), 5000);
      // console.log(`Decode text from QR code is ${this.owner}`)
    },
    onLoaded() {
      console.log(`Ready to start scanning barcodes`);
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
