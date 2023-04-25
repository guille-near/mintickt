<template>
  <div id="profile">
    <section id="profile-header">
      <div class="container-avatar">
        <img  :src="src" alt="user img">
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
export default {
  name: "Profile",
  data() {
    return {
      tab: 0,
      dataTabs: [
        {
          title: "Events",
          src: null,
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
  mounted(){
    if(this.$session.get("nearSocialProfileImage") === undefined || this.$session.get("nearSocialProfileImage") === ""){
      this.src = process.env.VUE_APP_API_BASE_URL_PINATA + "QmQDtJ4TEdsQZZssAYtL61ZJ645XvtszUggfqbmHpee1fr";
    } else {
      this.src = process.env.VUE_APP_API_BASE_URL_SOCIAL + this.$session.get("nearSocialProfileImage");
    }
  }
}
</script>

<style src="./Profile.scss" lang="scss" />
