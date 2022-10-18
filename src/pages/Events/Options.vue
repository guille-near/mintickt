<template>
  <section id="options" class="divcol gap align">
    <div class="acenter">
      <v-btn icon to="/events">
        <v-icon style="color: #ffffff !important">mdi-arrow-left</v-icon>
      </v-btn>
      <h2 class="p" style="margin: 0">{{ name }} / Settings</h2>
    </div>

    <aside class="container-actions divcol">
      <span>Burn a ticket</span>
      <label>(Access Control)</label>
      <div class="space">
        <v-btn @click="ModalQR('ticket')">
          <img src="@/assets/icons/qr.svg" alt="qr icon" />
          Show QR
        </v-btn>
        <v-btn>
          <img src="@/assets/icons/copy.svg" alt="copy icon" />
          Copy url
        </v-btn>
      </div>
    </aside>

    <aside class="container-actions divcol">
      <span>Burn a goodie</span>
      <label>(Goodies)</label>
      <div class="space">
        <v-btn @click="ModalQR('goodie')">
          <img src="@/assets/icons/qr.svg" alt="qr icon" />
          Show QR
        </v-btn>
        <v-btn>
          <img src="@/assets/icons/copy.svg" alt="copy icon" />
          Copy url
        </v-btn>
      </div>
    </aside>

    <aside class="container-info divcol">
      <div class="space">
        <div class="divcol">
          <label>Tickets minted</label>
          <span>{{ listed }} / {{ minted }}</span>
        </div>

        <v-btn @click="modalMintMore = true">Mint more</v-btn>
      </div>

      <div class="space">
        <div class="divcol">
          <label>Tickets listed</label>
          <span>{{ listed }}</span>
        </div>

        <v-btn @click="modalListMore = true">List more</v-btn>
      </div>
    </aside>

    <!-- modalQr -->
    <v-dialog v-model="modalQR" width="300px">
      <StreamBarcodeReader
        @decode="onDecode('hola')"
        @loaded="onLoaded"
      ></StreamBarcodeReader>
    </v-dialog>

    <!-- modal mint more -->
    <v-dialog v-model="modalMintMore" width="300px">
      <v-card class="modalMore" color="rgb(225 225 225 / .1)">
        <label for="cantidad">Amount</label>
        <v-text-field
          id="cantidad"
          v-model="cantidad"
          type="number"
          hide-spin-buttons
          hide-details
          solo
        >
          <template v-slot:append>
            <v-btn color=" #C4C4C4" @click="controlAmount('less')">
              <v-icon color="black"> mdi-minus </v-icon>
            </v-btn>
            <v-btn color=" #C4C4C4" @click="controlAmount('more')">
              <v-icon color="black"> mdi-plus </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-card>
    </v-dialog>
    
    
    <!-- modal list more -->
    <v-dialog v-model="modalListMore" width="300px">
      <v-card class="modalMore divcol" color="rgb(225 225 225 / .1)" style="gap: 2em">
        <div class="divcol">
          <label for="cantidad">Amount</label>
          <v-text-field
            id="cantidad"
            v-model="cantidad_list"
            type="number"
            hide-spin-buttons
            hide-details
            solo
          >
            <template v-slot:append>
              <v-btn color=" #C4C4C4" @click="controlAmount('less')">
                <v-icon color="black"> mdi-minus </v-icon>
              </v-btn>
              <v-btn color=" #C4C4C4" @click="controlAmount('more')">
                <v-icon color="black"> mdi-plus </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>

        <div class="divcol">
          <label for="cantidad">Price (NEAR)</label>
          <v-text-field
            id="cantidad"
            v-model="price_list"
            type="number"
            hide-spin-buttons
            hide-details
            solo
          >
            <template v-slot:append>
              <v-btn color=" #C4C4C4" @click="controlAmount('less')">
                <v-icon color="black"> mdi-minus </v-icon>
              </v-btn>
              <v-btn color=" #C4C4C4" @click="controlAmount('more')">
                <v-icon color="black"> mdi-plus </v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <span class="conversion">~ {{ usd }} USD</span>
        </div>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import gql from "graphql-tag";
const your_events = gql`
  query MyQuery($store: String!, $user: String!, $metadata_id: String!) {
  mb_views_nft_metadata(
    where: {nft_contract_id: {_eq: $store}
      , listings: {price: {_is_null: false}
        , metadata_id: {_eq: $metadata_id}}, nft_contract_owner_id: {_eq: $user}}
  ) {
    title
    reference_blob
    id
    listings_aggregate {
      aggregate {
        count
      }
    }
    nft_contract_owner_id
  }
}
`;
const mb_views_nft_tokens_aggregate = gql`
  query MyQuery($store: String!, $user: String!, $metadata_id: String!) {
    nft_tokens_aggregate(
      where: {
        nft_contract_id: { _eq: $store }
        metadata_id: { _eq: $metadata_id }
      }
    ) {
      aggregate {
        count
      }
    }
    nft_earnings_aggregate(
      where: {
        receiver_id: { _eq: $user }
        offer: { token: { metadata_id: { _eq: $metadata_id } } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
export default {
  name: "options",
  components: { StreamBarcodeReader },
  data() {
    return {
      modalMintMore: false,
      modalListMore: false,
      cantidad: 0,
      modalQR: false,
      minted: 0,
      listed: 0,
      usd: 0,
      name: "",
      price_list: 0,
      cantidad_list: 0,
    };
  },
  mounted() {
    this.getData();
    this.pollData();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    urlParams.get("transactionHashes");
    this.hash =
      "https://explorer.mainnet.near.org/transactions/" +
      urlParams.get("transactionHashes");
    if (urlParams.get("transactionHashes") !== null) {
      this.$refs.modal.modalSuccess = true;
      this.$refs.modal.url =
        this.$explorer+"/accounts/"+user
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/mintickt/#/events/options?event="+localStorage.getItem('event_name')+"&thingid="+localStorage.getItem('eventid')
      );
    }
    if (urlParams.get("errorCode") !== null) {
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/mintickt/#/events/options?event="+localStorage.getItem('event_name')+"&thingid="+localStorage.getItem('eventid')
      );
    }
  },
  methods: {
    onDecode(text) {
      console.log(`Decode text from QR code is ${text}`);
    },
    onLoaded() {
      console.log(`Ready to start scanning barcodes`);
    },
    ModalQR(key) {
      if (key == "ticket") {
        this.modalQR = true;
      }
      if (key == "goodie") {
        this.modalQR = true;
      }
    },
    async getData() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      this.$apollo
        .query({
          query: your_events,
          variables: {
            store: this.$store_mintbase,
            user: user,
            metadata_id: this.$route.query.thingid.toLowerCase(),
          },
        })
        .then((response) => {
          //Map the objectvalue
          Object.entries(response.data).forEach(([key, value]) => {
            // inner object entries
            Object.entries(value).forEach(([i, value1]) => {
              //Getting the minted nft
              //Tokens aggregate and earnings by metadata id
              this.$apollo
                .query({
                  query: mb_views_nft_tokens_aggregate,
                  variables: {
                    store: this.$store_mintbase,
                    user: user,
                    metadata_id: this.$route.query.thingid.toLowerCase(),
                  },
                })
                .then((response) => {
                  this.name = this.$route.query.event,
                  this.minted = response.data.nft_tokens_aggregate.aggregate.count,
                  this.listed = value1.listings_aggregate.aggregate.count
                })
                .catch((err) => {
                  console.log("Error", err);
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
    controlAmount(item) {
      this.getData();
      if (item == "more") {
        this.cantidad++;
      }
      if (item == "less" && this.cantidad > 1) {
        this.cantidad--;
      }
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
