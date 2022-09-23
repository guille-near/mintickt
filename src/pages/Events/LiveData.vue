<template>
  <section id="liveData" class="align divcol gap">
    <div class="acenter">
      <v-btn icon to="/events">
        <v-icon style="color: #ffffff !important">mdi-arrow-left</v-icon>
      </v-btn>
      <h2 style="margin: 0">Event / {{ this.$route.query.event }}</h2>
    </div>

    <aside class="container-info acenter">
      <div class="divcol">
        <label>Tickets sold</label>
        <span>{{ ticketsSold }}</span>
      </div>
      <div class="divcol">
        <label>Your incomes</label>
        <span>{{ incomes.toFixed(2) }} N</span>
      </div>
      <label style="margin-top: auto"
        >≈ USD {{ (lastPrice.lastPrice * incomes).toFixed(2) }}</label
      >
    </aside>

    <div class="divcol">
      <h2 style="margin-bottom: 0.3em">Last updates</h2>
      <label>Filter by</label>
    </div>

    <section class="container-down">
      <div class="container-filter acenter gap">
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

      <v-data-table
        id="dataTable"
        v-show="
          dataFilters[dataFilters.findIndex((e) => e.key == 'fans')].active ==
          true
        "
        :headers="headersTable"
        :items="dataTable"
        hide-default-footer
        :mobile-breakpoint="-1"
      >
        <template v-slot:[`item.transaction`]>
          <v-btn icon>
            <img
              class="copyImg"
              src="@/assets/icons/link.svg"
              alt="external link"
            />
          </v-btn>
        </template>

        <template v-slot:[`item.action`]>
          <v-btn>Complete order</v-btn>
        </template>
      </v-data-table>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        class="search"
      />
      <v-data-table
        id="dataTable"
        :loading="loading"
        :search="search"
        v-show="
          dataFilters[dataFilters.findIndex((e) => e.key == 'redeemed')]
            .active == true
        "
        :headers="headersTableExtra"
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

        <template v-slot:[`item.action`]>
          <v-btn>Complete order</v-btn>
        </template>
      </v-data-table>
    </section>
  </section>
</template>

<script>
import moment from "moment";
import gql from "graphql-tag";
const mb_views_nft_tokens_aggregate = gql`
  query MyQuery($user: String!, $metadata_id: String!) {
    nft_earnings_aggregate(
      where: {
        receiver_id: { _eq: $user }
        offer: { token: { metadata_id: { _eq: $metadata_id } } }
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
const tickets = gql`
  query MyQuery($user: String!) {
    store(
      where: { name: { _eq: "globaldv" }, minters: { account: { _eq: $user } } }
    ) {
      things(
        order_by: { createdAt: desc }
        where: { metadata: { extra: { _has_key: "tickets" } } }
      ) {
        metadata {
          extra
        }
        tokens(
          where: {
            _not: { ownerId: { _eq: $user }, burnedAt: { _is_null: true } }
          }
        ) {
          id
          ownerId
          lastTransferred
        }
        tokens_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;
const goods_redeemed = gql`
  query MyQuery($_iregex: String!) {
    mb_views_nft_tokens(
      where: {
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
        extra: { _eq: "ticketing" }
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
    }
  }
`;
export default {
  name: "LiveData",
  data() {
    return {
      dataFilters: [
        {
          key: "fans",
          name: "Fans inside",
          value: "122/250",
          active: false,
        },
        {
          key: "redeemed",
          name: "Goods redeemed",
          value: "12/250",
          active: true,
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
      dataTable: [
        {
          nft: "Near Beer",
          signer: "guille.near",
          quantity: 1,
          created: "1 min ago",
        },
        {
          nft: "Near Beer",
          signer: "guille.near",
          quantity: 1,
          created: "1 min ago",
        },
      ],
      headersTableExtra: [
        { value: "ticket", text: "TICKET" },
        { value: "signer", text: "SIGNER" },
        { value: "quantity", text: "QUANTITY" },
        { value: "created", text: "CREATED" },
        { value: "transaction", text: "TRANSACTION", sortable: false },
        { value: "action", text: "ACTION", sortable: false },
      ],
      dataTableExtra: [],
      ticketsSold: 0,
      incomes: 0,
      lastPrice: [],
      fans_inside_total_of: 0,
      fans_inside_tota: 0,
      loading: true,
      search: "",
    };
  },
  mounted() {
    this.responsive();
    this.fetch();
    this.getData();
  },
  methods: {
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
      const user = datos.accountId;
      var metadata_id = this.$route.query.thingid.toLowerCase();
      console.log(metadata_id);
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
          //this.getTicketsBurn();
          this.getExtra();
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    //Data extra to get burned, beers, tshirts, pop corn, etc
    async getExtra() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      var rows = [];
      var rowsfilter = [];
      var receip = null;
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      this.$apollo
        .query({
          query: goods_redeemed,
          variables: {
            _iregex: thingid[1],
          },
        })
        .then((response) => {
          //Get the first object and loop
          Object.entries(response.data.mb_views_nft_tokens).forEach(
            ([key, value]) => {
              var startTime = moment.utc(value.minted_timestamp);
              var endTime = moment.utc(new Date());
              var minutesDiff = endTime.diff(startTime, "minutes");
              var hoursDiff = endTime.diff(startTime, "hours");
              var daysDiff = endTime.diff(startTime, "day");
              var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
              var time2 = time > 24 ? daysDiff : time;
              var timedesc = minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
              var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
              var receipe = value.last_transfer_receipt_id === null ? value.minted_receipt_id : last_transfer_receipt_id;
              rows = {
                ticket: value.description,
                signer: value.owner,
                quantity: 1,
                created: time2 + " " + timedesc2,
                transaction: "https://explorer.testnet.near.org/?query="+receipe,
              };
              this.dataTableExtra.push(rows);
            }
          );
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
      }, 120000);
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
  },
};
</script>

<style src="../pages.scss" lang="scss" />
