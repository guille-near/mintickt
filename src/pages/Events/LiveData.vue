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
        <span>{{ incomes }} N</span>
      </div>
      <label style="margin-top: auto"
        >≈ USD {{ (lastPrice.lastPrice * incomes).toFixed(4) }}</label
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
        :loading="loading"
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

      <v-data-table
        id="dataTable"
        v-show="
          dataFilters[dataFilters.findIndex((e) => e.key == 'redeemed')]
            .active == true
        "
        :headers="headersTableExtra"
        :items="dataTableExtra"
        :loading="loading"
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
    </section>
  </section>
</template>

<script>
import moment from "moment";
import gql from "graphql-tag";
const earnings = gql`
  query MyQuery($user: String!, $thingId: String!) {
    earnings_aggregate(
      where: {
        receiverId: { _eq: $user }
        list: { thingId: { _eq: $thingId } }
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
  query MyQuery($user: String!, $_has_key: String!) {
    store(
      where: { name: { _eq: "globaldv" }, minters: { account: { _eq: $user } } }
    ) {
      things(
        order_by: { createdAt: desc }
        where: { metadata: { extra: { _has_key: $_has_key } } }
      ) {
        metadata {
          extra
          description
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
export default {
  name: "LiveData",

  data() {
    return {
      dataFilters: [
        {
          key: "redeemed",
          name: "Goods redeemed",
          value: "12/250",
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
      dataTable: [],
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
      this.$apollo
        .query({
          query: earnings,
          variables: {
            user: user,
            thingId: this.$route.query.thingid,
          },
        })
        .then((response) => {
          this.ticketsSold = response.data.earnings_aggregate.aggregate.count;
          this.incomes =
            response.data.earnings_aggregate.aggregate.sum.amount /
            Math.pow(10, 24);
          this.getTicketsBurn();
          this.getExtra();
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    //Data to get burned
    async getTicketsBurn() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      var rows = [];
      var rowsfilter = [];
      const user = datos.accountId;
      this.$apollo
        .query({
          query: tickets,
          variables: {
            user: user,
          },
        })
        .then((response) => {
          //Get the first object and loop
          Object.entries(response.data).forEach(([key, value]) => {
            //Get the second object and loop
            Object.entries(value[0].things).forEach(([i, value1]) => {
              var objfilter = value1.metadata.extra.tickets.value;
              //Get the third object and loop
              rowsfilter = {
                key: "fans",
                name: "Fans inside",
                value:
                  value1.tokens.length +
                  " / " +
                  value1.tokens_aggregate.aggregate.count,
                active: true,
              };
              this.dataFilters.push(rowsfilter);
              Object.entries(value1.tokens).forEach(([x, value2]) => {
                //Times diference handle
                var startTime = moment.utc(value2.lastTransferred);
                var endTime = moment.utc(new Date());
                var minutesDiff = endTime.diff(startTime, "minutes");
                var hoursDiff = endTime.diff(startTime, "hours");
                var daysDiff = endTime.diff(startTime, "day");
                var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
                var time2 = time > 24 ? daysDiff : time;
                var timedesc =
                  minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
                var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
                //Filter by thingid
                objfilter === this.$route.query.thingid
                  ? (rows = {
                      nft: "Ticket",
                      signer: value2.ownerId,
                      quantity: 1,
                      created: time2 + " " + timedesc2,
                    })
                  : null;
                this.dataTable.push(rows);
                //Filter by not null
                this.dataTable = this.dataTable.filter((el) => el.nft != null);
              });
            });
          });
        })
        .catch((err) => {
          console.log("Error", err);
        })
        .finally(() => (this.loading = false));
    },
    //Data extra to get burned, beers, tshirts, pop corn, etc
    async getExtra() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      var rows = [];
      var rowsfilter = [];
      var thingid = this.$route.query.thingid.toLowerCase().split(":");
      const user = datos.accountId;
      this.$apollo
        .query({
          query: goods_redeemed,
          variables: {
            user: user,
            _has_key: thingid[0],
          },
        })
        .then((response) => {
          //Get the first object and loop
          Object.entries(response.data).forEach(([key, value]) => {
            //Get the second object and loop
            Object.entries(value[0].things).forEach(([i, value1]) => {
              rowsfilter = {
                key: "redeemed",
                name: "Goods redeemed",
                value:
                  value1.tokens.length +
                  " / " +
                  value1.tokens_aggregate.aggregate.count,
                active: false,
              };
              this.dataFilters.push(rowsfilter);
              Object.entries(value1.tokens).forEach(([x, value2]) => {
                //Times diference handle
                var startTime = moment.utc(value2.lastTransferred);
                var endTime = moment.utc(new Date());
                var minutesDiff = endTime.diff(startTime, "minutes");
                var hoursDiff = endTime.diff(startTime, "hours");
                var daysDiff = endTime.diff(startTime, "day");
                var time = minutesDiff > 60 ? hoursDiff : minutesDiff;
                var time2 = time > 24 ? daysDiff : time;
                var timedesc =
                  minutesDiff > 60 ? "hour(s) ago" : "minute(s) ago";
                var timedesc2 = time > 24 ? "day(s) ago" : timedesc;
                rows = {
                  ticket: value1.metadata.description,
                  signer: value2.ownerId,
                  quantity: 1,
                  created: time2 + " " + timedesc2,
                };
                this.dataTableExtra.push(rows);
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
