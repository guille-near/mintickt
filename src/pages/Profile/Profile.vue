<template>
  <div id="profile">
    <section id="profile-header">
      <div class="container-avatar">
        <img src="@/assets/profile/user.svg" alt="user img">
      </div>
    </section>

    <section id="profile-content">
      <h2 class="title-tabs vermobile">My tickets</h2>

      <v-tabs v-model="tab" background-color="transparent">
        <v-tab v-for="item in dataTabs" :key="item" v-ripple="false">{{item.title}}</v-tab>
      </v-tabs>


      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in dataTabs" :key="item" :style="`--imageSize: ${tab === 2 ? 150 : 105}px`">
          <v-card
            v-for="(item2,i) in item.content" :key="i" color="transparent"
            v-ripple="false"
            @click="$router.push(`/profile-ticket-details/:${item2.name}`)"
          >
            <img :src="item2.img" :alt="`${item2.name} image`">

            <div class="divcol" style="gap: 1px">
              <span>{{item2.name}}</span>
              <span v-show="tab !== 2">{{item2.date}}</span>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

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

export default {
  name: "Profile",
  data() {
    return {
      tab: 0,
      dataTabs: [
        {
          title: "Events",
          content: [
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
          ],
        },
        {
          title: "Past events",
          content: [
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
              date: "13th Feb, 2024",
            },
          ],
        },
        {
          title: "Collectibles",
          content: [
            {
              img: require("@/assets/profile/img-test.png"),
              name: "Nearcon",
            },
          ],
        },
      ],
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
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
          }
        });
    },
  }
}
</script>

<style src="./Profile.scss" lang="scss" />
