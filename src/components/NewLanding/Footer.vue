<template>
  <section id="newLanding--footer">
    <div class="divcol">
      <aside class="top">
        <div class="left">
          <img src="../../assets/newLanding/Logo.svg" alt="logo" width="155px">

          <div class="divcol">
            
            
            <span style="font-size: 16px; margin-block: 20px 10px">Sign up for our newsletter and be the first to receive updates on new features and releases!</span>

            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
            <v-text-field
              v-model="email"
              :error="errorBtn"
              solo hide-details
              placeholder="Enter your email"
              :rules="rules.email"
            >
              <template v-slot:append-outer>
                <v-btn class="stylish" :color="colorBtn" @click="subscribe()">Subscribe</v-btn>
              </template>
            </v-text-field>

          </v-form>

            <span style="font-size: 12px;">
              By registering, you agree to our  <a href="" target="_blank">Privacy Policy</a> and consent to receive updates from us.
            </span>
          </div>
        </div>

        <div class="right">
          <h3>Connect With Us</h3>

          <div class="divcol" style="gap: 10px">
            <a
              v-for="(item, i) in socials" :key="i"
              :href="item.href" target="_blank"
            >
              <img :src="item.icon" :alt="item.name">
              <span>{{item.name}}</span>
            </a>
          </div>
          <!-- content -->
        </div>
      </aside>

      <aside class="bottom">
        <span>© 2023 Mintickt. All rights reserved.</span>

        <div class="center" style="gap: 10px">
          <a @click="$router.push('/privacy-policy')">Privacy Policy</a>
          <a @click="$router.push('/terms-and-conditions')">Terms of Service</a>
          <a>Cookies Settings</a>
        </div>
      </aside>
    </div>
  </section>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      socials: [
        {
          icon: require("@/assets/newLanding/twitter.svg"),
          name: "Twitter",
          href: "https://twitter.com/Mintickt",
        },
        {
          icon: require("@/assets/newLanding/instagram.svg"),
          name: "Instagram",
          href: "https://instagram.com/mintickt?igshid=MmJiY2I4NDBkZg==",
        },
        {
          icon: require("@/assets/newLanding/facebook.svg"),
          name: "Facebook",
          href: "https://www.facebook.com/mintickt",
        },
        {
          icon: require("@/assets/newLanding/medium.svg"),
          name: "Medium",
          href: "https://medium.com/@mintickt",
        },
        {
          icon: require("@/assets/newLanding/linkedin.svg"),
          name: "LinkedIn",
          href: "https://medium.com/@mintickt",
        },
        {
          icon: require("@/assets/newLanding/telegram.svg"),
          name: "Telegram",
          href: "https://t.me/mintickt",
        },
        
        {
          icon: require("@/assets/newLanding/discord.svg"),
          name: "Discord",
          href: "https://discord.gg/ebPUNdD4Bf",
        },
      ],
      rules: {
        required: [(v) => !!v || "Field required"],
        email: [
          v => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(v) || 'Invalid email.'
          },
        ],
      },
      colorBtn: "",
      errorBtn: false,
    }
  },
  methods: {
    subscribe() {
      if (this.$refs.form.validate()) {
        axios.post(process.env.VUE_APP_BOTDISCORD_URL + "/api/set-email-subscribe/", { "email": this.email })
        .then(result => {
          this.colorBtn = "green"

          setTimeout(() => {
            this.colorBtn = ""
          }, 3000);
          
        }).catch(err => {
          this.colorBtn = "red"
          this.errorBtn = true

          setTimeout(() => {
            this.colorBtn = ""
            this.errorBtn = false
          }, 3000);
        })
      }
    },
  },
}
</script>

<style src="../Layout/layout.scss" lang="scss" />
