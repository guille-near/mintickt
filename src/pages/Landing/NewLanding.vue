<template>
  <div id="newLanding" class="divcol">
    <img class="background-landing eliminarxmobile" src="@/assets/newLanding/background-landing.png">
    <img class="background-landing verxmobile" src="@/assets/newLanding/background-landing-mobile.png">

    <img class="lights-up eliminarxmobile" src="@/assets/newLanding/lights-up.png">
    <img class="lights-up verxmobile" src="@/assets/newLanding/lights-up-mobile.png">

    <!-- hero -->
    <section id="hero">
      <h1>You may want to collect these tickets</h1>
    </section>

    <img id="hero-down-img" src="@/assets/newLanding/hero-down.png" width="100%" class="eliminarmobile">

    <!-- bullshit -->
    <section id="bullshit">
      <h2>0% bullshit, 100% utility</h2>
      <img src="@/assets/newLanding/bullshit-desktop.jpg" alt="utility image" class="eliminarmobile">
      <img src="@/assets/newLanding/bullshit-mobile.jpg" alt="utility image" class="vermobile">
    </section>

    <img id="hero-down-img" src="@/assets/newLanding/hero-down.png" width="100%" class="vermobile">

    <!-- about -->
    <section id="about">
      <article>
        <div class="divcol">
          <h2>Hire a designer to get a custom ticket for your event...</h2>

          <v-btn :href="storeMintabe" target="_blank" class="stylish" >
            <span>More info</span>
          </v-btn>
        </div>

        <img src="@/assets/newLanding/ticket-about-up.png">
      </article>

      <article>
        <img src="@/assets/newLanding/ticket-about-down.png">

        <div class="divcol">
          <h2>... or use one of our templates to design your ticket.</h2>

          <v-btn class="stylish" @click="goToEvent">
            <span>Create event</span>
          </v-btn>
        </div>
      </article>
    </section>

    <!-- FAQ -->
    <section id="FAQ">
      <div class="divcol" style="gap: 25px">
        <h2 id="faq">FAQs</h2>
        <span class="text">Answers to Your Frequently Asked Questions about Mintickt</span>
      </div>

      <v-expansion-panels v-model="expansionModel" class="expansion-faqs">
        <v-expansion-panel v-for="(item,i) in dataFaqs" :key="i">
          <v-expansion-panel-header disable-icon-rotate>
            {{item.question}}

            <template v-slot:actions>
              <v-icon>{{expansionModel === i ? 'mdi-minus' : 'mdi-plus'}}</v-icon>
            </template>
          </v-expansion-panel-header>

          <v-expansion-panel-content>{{item.answer}}</v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="divcol center" style="gap: 20px">
        <h2>Still have a question?</h2>
        <span class="text">We're here to assist you.</span>
        <v-btn class="stylish" href="https://t.me/mintickt" target="_blank">
          <span>Contact</span>
        </v-btn>
      </div>
    </section>

    <!-- memorable -->
    <section id="memorable">
      <div class="divcol">
        <h2>Memorable events start with NFT tickets</h2>
        <v-btn class="stylish" @click="goToEvent">
          <span>Create event</span>
        </v-btn>
      </div>
    </section>


    <img class="lights-down eliminarxmobile" src="@/assets/newLanding/lights-up.png">
    <img class="lights-down verxmobile" src="@/assets/newLanding/lights-up-mobile.png">

    <!-- footer -->
    <section id="footer">
      <div class="divcol">
        <aside class="top">
          <div class="left">
            <img src="../../assets/newLanding/Logo.svg" alt="logo" width="155px">

            <div class="divcol">
              <span style="font-size: 16px; margin-block: 20px 10px">Join our newsletter to stay up to date on features and releases.</span>

              <v-text-field
                v-model="email"
                solo hide-details
                placeholder="Enter your email"
                :rules="rules.email"
              >
                <template v-slot:append-outer>
                  <v-btn class="stylish">Subscribe</v-btn>
                </template>
              </v-text-field>

              <span style="font-size: 12px;">
                By subscribing you agree to with our <a href="" target="_blank">Privacy Policy</a> and provide consent to receive updates from our company.
              </span>
            </div>
          </div>

          <div class="right">
            <h3>Follow Us</h3>

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

          <!-- <div class="center" style="gap: 10px">
            <a href="" target="_blank">Privacy Policy</a>
            <a href="" target="_blank">Terms of Service</a>
            <a href="" target="_blank">Cookies Settings</a>
          </div> -->
        </aside>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Landing",
  data() {
    return {
      email: undefined,
      expansionModel: undefined,
      dataFaqs: [
        {
          question: "Why NFT Ticketing?",
          answer: "NFTs, or non-fungible tokens, are unique digital assets that are stored on a blockchain. They can be used to represent ownership of a wide variety of things, such as art, music, and even event tickets. Overall, NFTs offer many benefits over traditional ticketing systems, including increased security, unique experiences, and additional revenue opportunities.",
        },
        {
          question: "Do I need a crypto wallet?",
          answer: "",
        },
        {
          question: "Do I have to buy crypto to purchase a ticket?",
          answer: "",
        },
        {
          question: "Why should I collect tickets for the events I attend?",
          answer: "",
        },
        {
          question: "I’m an artist or event organizer. What benefits can I get?",
          answer: "",
        },
      ],
      socials: [
        {
          icon: require("@/assets/newLanding/telegram.svg"),
          name: "Telegram",
          href: "https://t.me/mintickt",
        },
        {
          icon: require("@/assets/newLanding/instagram.svg"),
          name: "Instagram",
          href: "https://instagram.com/mintickt?igshid=MmJiY2I4NDBkZg==",
        },
        {
          icon: require("@/assets/newLanding/twitter.svg"),
          name: "Twitter",
          href: "https://twitter.com/Mintickt",
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
      storeMintabe: process.env.VUE_APP_MINTBASE_STORE
    };
  },
  mounted() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes");
    if (urlParams.get("transactionHashes") !== null) {
     history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/"
      );
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/"
      );
    }
  },
  methods: {
    async goToEvent() {
      const balance = await this.getBalance();
      if (balance < 0.05) {
        this.$refs.modalfill.modalFill = true;
        return;
      }

      this.$session.clear();
      localStorage.setItem("step", 1);
      this.$router.push("/events/register");
    },
    async getBalance() {
      try {
        if (this.$ramper.getUser()) {
          const account = await this.$near.account(this.$ramper.getAccountId());
          const response = await account.state();
          const valueStorage = Math.pow(10, 19);
          const valueYocto = Math.pow(10, 24);

          const storage = (response.storage_usage * valueStorage) / valueYocto;
          return (response.amount / valueYocto - storage).toFixed(2);
        }
      } catch (error) {
        return "0";
      }
    },
  }
};
</script>

<style src="../pages.scss" lang="scss"></style>
<style src="./Landing.scss" lang="scss"></style>
<style src="./NewLanding.scss" lang="scss"></style>
