<template>
  <section id="events" class="align divcol gap">
    <h2>Your Events</h2>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Buscar"
      single-line
      hide-details
      class="search"
    />
    <v-data-table
      id="tableEvents"
      :headers="headers"
      :items="data"
      :loading="loading"
      :search="search"
      :page="page"
      :pageCount="numberOfPages"
      calculate-widths
      :mobile-breakpoint="880"
      class="eliminarmobile"
    >
      <template v-slot:[`item.name`]="{ item }">
        <img
          class="bgTicket"
          src="@/assets/img/bg-ticket_events.png"
          alt="ticket image"
        />
        <span class="eventName">{{ item.name }}</span>
      </template>

      <template v-slot:[`item.actions`]>
        <div class="divwrap_inv" style="gap: 1em">
          <v-btn to="/events/liveData">Go to live data</v-btn>

          <!-- <v-menu :close-on-content-click="false" offset-y>
            <template v-slot:activator="{on, attrs}"> -->
          <v-btn v-on="on" v-bind="attrs" to="/events/options"
            ><v-icon size="1.5em">mdi-cog-outline</v-icon></v-btn
          >
          <!-- </template>

            <v-card class="contMoreOptions divcol" style="display:flex" color="#A5A5A5">
              <v-btn v-for="(item2, i2) in dataMore" :key="i2" color="transparent" :class="{active:item2.active}"
                @click="dataMore.forEach(e=>{e.active=false});item2.active=true;mintMore(item2, item)">
                {{item2.name}} more
              </v-btn>
            </v-card>
          </v-menu> -->
        </div>
      </template>
    </v-data-table>

    <section class="vermobile">
      <v-card
        v-for="(item, i) in dataTableMobile"
        :key="i"
        class="up divcol"
        style="display: flex"
      >
        <section class="acenter">
          <span class="eventName">{{ item.name }}</span>
          <span>{{ item.date }}</span>

          <aside class="acenter" style="gap: 0.5em">
            <v-btn class="icon" to="/events/liveData">
              <v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-chart-line</v-icon>
            </v-btn>

            <v-btn class="icon" to="/events/options">
              <v-icon size="clamp(1.3em, 1.5vw, 1.5em)">mdi-cog-outline</v-icon>
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
    </section>
  </section>
</template>

<script>
const axios = require("axios");
import gql from "graphql-tag";
import { Wallet, Chain, Network } from "mintbase";
import * as nearAPI from "near-api-js";
import { CONFIG } from "@/services/api";
const { connect, keyStores, WalletConnection, utils } = nearAPI;
const your_events = gql`
  query MyQuery($user: String!) {
    store(
      where: { name: { _eq: "globaldv" }, minters: { account: { _eq: $user } } }
    ) {
      things(order_by: { createdAt: desc }, limit: 10, offset: 0) {
        metadata {
          title
          media
          extra
          thing_id
          thing {
            tokens_aggregate {
              aggregate {
                count
              }
              nodes {
                approvals_aggregate {
                  aggregate {
                    count
                  }
                }
                list {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
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
      }
    }
  }
`;
export default {
  name: "Events",
  data() {
    return {
      headers: [
        { text: "EVENT NAME", align: "start", value: "name" },
        { text: "DATE", align: "start", value: "date" },
        { text: "LOCATION", align: "start", value: "location" },
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
      numberOfPages: 1,
      dataTableMobile: [
        {
          name: "Nearcon",
          date: "Sep 12-14",
          show: false,
          minted: "283 / 2000",
          sold: "250",
          listed: "283",
        },
        {
          name: "Nearcon",
          date: "Sep 12-14",
          show: false,
          minted: "283 / 2000",
          sold: "250",
          listed: "283",
        },
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.progress = true;
      this.$apollo
        .query({
          query: your_events,
          variables: {
            user: localStorage.getItem("mintickt-user"),
          },
        })
        .then((response) => {
          var options = { year: "numeric", month: "short", day: "numeric" }; //Format data
          //Map the object
          Object.entries(response.data).forEach(([key, value]) => {
            // inner object entries
            Object.entries(value[0].things).forEach(([i, value1]) => {
              var arr = value1.metadata.thing.tokens_aggregate.nodes;
              var total = 0;
              //Map the array and count minted series
              var counter = arr.map(
                (arr) => arr.approvals_aggregate.aggregate.count
              );
              //Reduce the object and sum the values for total minted
              total = Object.values(counter).reduce((a, c) => a + c, 0);
              //Get the earning
              var rows = [];
              this.$apollo
                .query({
                  query: earnings,
                  variables: {
                    user: localStorage.getItem("mintickt-user"),
                    thingId: value1.metadata.thing_id,
                  },
                })
                .then((response) => {
                  //Only push nft listed more than 1
                  //////////////////////////////////////////////////////////////
                  total > 0
                    ? (rows = {
                        name: value1.metadata.title,
                        date: new Date(
                          value1.metadata.extra.start_date.value * 1000
                        ).toLocaleDateString("en-US", options),
                        location: value1.metadata.extra.location.value,
                        minted:
                          total +
                          " / " +
                          value1.metadata.thing.tokens_aggregate.aggregate
                            .count,
                        sold: response.data.earnings_aggregate.aggregate.count,
                        listed: total,
                      })
                    : (rows = {});
                  this.data.push(rows);
                  this.data = this.data.filter((el) => el.name != null);
                })
                .catch((err) => {
                  console.log("Error", err);
                });
              ////End get the earning//////////////////////////////////////
              ////Embed request///////////////////////////////////////////
            }); //End inner object entries
          });
        })
        .catch((err) => {
          console.log("Error", err);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
