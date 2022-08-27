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
      <label style="margin-top: auto">≈ USD 2323.50</label>
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

      <v-data-table
        id="dataTable"
        v-show="
          dataFilters[dataFilters.findIndex((e) => e.key == 'redeemed')]
            .active == true
        "
        :headers="headersTableVirra"
        :items="dataTableVirra"
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
const axios = require("axios");
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
      headersTableVirra: [
        { value: "ticket", text: "TICKET" },
        { value: "signer", text: "SIGNER" },
        { value: "quantity", text: "QUANTITY" },
        { value: "created", text: "CREATED" },
        { value: "transaction", text: "TRANSACTION", sortable: false },
        { value: "action", text: "ACTION", sortable: false },
      ],
      dataTableVirra: [
        {
          ticket: "Near Beer",
          signer: "guille.near",
          quantity: 1,
          created: "1 min ago",
        },
        {
          ticket: "Near Beer",
          signer: "guille.near",
          quantity: 1,
          created: "1 min ago",
        },
      ],
      ticketsSold: 0,
      incomes: 0,
    };
  },
  mounted() {
    this.responsive();
    this.getData();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes");
    this.hash =
      "https://explorer.mainnet.near.org/transactions/" +
      urlParams.get("transactionHashes");
    if (urlParams.get("transactionHashes") !== null) {
      // console.log('aqui' + urlParams.get("transactionHashes"))
      this.dialog = true;
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/events/crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY:mintickt.mintbase1.near/#/"
      );
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/events/crOw6WeCbB0ZaSXLOAVnJk0CAVKA3ClwSMW1rEYY1kY:mintickt.mintbase1.near/#/"
      );
    }
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
      this.$apollo
        .query({
          query: earnings,
          variables: {
            user: localStorage.getItem("mintickt-user"),
            thingId: this.$route.query.thingid,
          },
        })
        .then((response) => {
          this.ticketsSold = response.data.earnings_aggregate.aggregate.count;
          this.incomes = response.data.earnings_aggregate.aggregate.sum.amount / Math.pow(10,24)
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    pollData() {
      this.polling = setInterval(() => {
        this.getData();
        this.$forceUpdate();
      }, 120000);
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
