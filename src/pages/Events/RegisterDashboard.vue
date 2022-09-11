<template>
  <section id="createTickets" class="registerDashboard divcol gap align">
    <ModalSuccess ref="modal"></ModalSuccess>

    <v-window v-model="step">
      <v-window-item :value="3">
        <h2 class="align" style="text-align: center">
          Let's create your NFT for your event!
        </h2>

        <section class="center divwrap">
          <div class="ticket-wrapper">
            <img
              class="ticket"
              src="@/assets/img/ticket-register.svg"
              alt="Ticket image"
            />

            <v-file-input
              v-for="(ticket, i) in dataTicket"
              :key="i"
              v-model="ticket.img"
              hide-details
              solo
              prepend-icon=""
              @change="uploadImg(ticket)"
            >
              <template v-slot:selection>
                <img v-if="ticket.url" :src="ticket.url" />
              </template>
            </v-file-input>
          </div>
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="next()"
            class="divcol"
          >
            <h3>Basic Information</h3>
            <p>
              Choose a name for your event and tell attendees why you think they
              will have a great time. Add details that highlight why your event
              is unique.
            </p>

            <div class="divcol">
              <label for="name"
                >Event name <span style="color: red">*</span></label
              >
              <v-text-field
                v-model="dataTickets.name"
                id="name"
                :rules="rules.required"
                solo
              ></v-text-field>
            </div>

            <div class="divcol">
              <label for="promoter"
                >Promoter / Organizer name
                <span style="color: red">*</span></label
              >
              <v-text-field
                v-model="dataTickets.promoter"
                :rules="rules.required"
                id="promoter"
                solo
              ></v-text-field>
            </div>

            <h3>Description <span style="color: red">*</span></h3>
            <p>
              Add more details of your event, such as program, sponsors or
              featured guests.
            </p>

            <!--<vue-editor v-model="dataTickets.description"></vue-editor>-->
            <v-textarea
              v-model="dataTickets.description"
              solo
              auto-grow
              :rules="rules.required"
            ></v-textarea>

            <h3>Location</h3>
            <p>
              Help people in the area find out about the event and make sure
              your attendees know where to go.
            </p>

            <vuetify-google-autocomplete
              id="map"
              :loading="loading"
              append-icon="search"
              v-bind:disabled="false"
              flat
              hide-no-data
              hide-details
              hide-selected
              label="Search your location"
              clearable
              classname="form-control"
              style="padding-bottom: 15px"
              :enable-geolocation="false"
              solo
              v-on:placechanged="getAddressData"
            >
            </vuetify-google-autocomplete>

            <h3>Date</h3>
            <p>
              Inform attendees when the event starts and ends so they can get
              organized
            </p>

            <div id="container-datatime" class="gap">
              <div class="divcol">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="dates"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      label="Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      solo
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates"
                    range
                    no-title
                    scrollable
                    color="hsl(306, 100%, 50%)"
                    dark
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="$refs.menu.save(dates)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
            </div>

            <div id="container-actions" class="gap">
              <v-btn disabled>
                <!-- <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon> -->
                Back
              </v-btn>
              <v-btn @click="next">
                Next
                <!-- <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                > -->
              </v-btn>
            </div>
          </v-form>
        </section>
      </v-window-item>

      <v-window-item :value="2">
        <h2 class="align" style="text-align: center">
          Let's create your ticket!
        </h2>

        <section class="jcenter divwrap">
          <div class="ticket-wrapper">
            <img
              class="ticket"
              src="@/assets/img/ticket-register.svg"
              alt="Ticket image"
            />

            <v-file-input
              v-for="(ticket, i) in dataTicket"
              :key="i"
              v-model="ticket.img"
              hide-details
              solo
              prepend-icon=""
              @change="uploadImg(ticket)"
            >
              <template v-slot:selection>
                <img v-if="ticket.url" :src="ticket.url" />
              </template>
            </v-file-input>
          </div>

          <v-form
            ref="form1"
            v-model="valid"
            @submit.prevent="next1()"
            class="divcol"
            style="min-height: 100%"
          >
            <div class="divcol">
              <h3>Main event image <span style="color: red">*</span></h3>
              <p>
                This is the first image attendees will see at the top of your
                event page..
              </p>

              <v-file-input
                v-model="dataTickets.img"
                solo
                prepend-icon
                accept="image/*"
                :rules="rules.required"
                @change="ImagePreview"
                class="input-unique"
              >
                <template v-slot:selection>
                  <img class="imagePreview" :src="url" alt="Image preview" />
                </template>

                <template v-slot:label>
                  <img src="@/assets/icons/drag-img.svg" alt="drag icon" />
                  <p class="p">
                    Drag and drop or click here to upload your main event image
                  </p>
                </template>
              </v-file-input>
              <h3>
                How many tickets you would like have for your event?
                <span style="color: red">*</span>
              </h3>
              <p>You can always mint/list more NFT tickets later.</p>

              <v-text-field
                :rules="rules.required"
                v-model="dataTickets.mint_amount"
                solo
                type="number"
              ></v-text-field>
            </div>

            <div id="container-actions" class="gap">
              <v-btn @click="step--">
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn @click="next1">
                Next<v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                >
              </v-btn>
            </div>
          </v-form>
        </section>
      </v-window-item>

      <v-window-item :value="1">
        <h2 class="align" style="text-align: center">
          Let's create your ticket!
        </h2>

        <section class="jcenter divwrap">
          <div class="ticket-wrapper">
            <img
              class="ticket"
              src="@/assets/img/ticket-register.svg"
              alt="Ticket image"
            />

            <v-file-input
              v-for="(ticket, i) in dataTicket"
              :key="i"
              v-model="ticket.img"
              hide-details
              solo
              prepend-icon=""
              @change="uploadImg(ticket)"
            >
              <template v-slot:selection>
                <img v-if="ticket.url" :src="ticket.url" />
              </template>
            </v-file-input>
          </div>

          <aside class="divcol gap" style="min-height: 100%">
            <v-form
              ref="form2"
              v-model="valid"
              @submit.prevent="mint()"
              class="divcol"
              style="min-height: 100%"
            >
              <div class="divcol">
                <h3>Royalties</h3>
                <p>
                  Royalties are perpetual. You can add royalties up to 50%
                  across 25 accounts.
                </p>

                <v-btn
                  @click="dataRoyalties.push({ account: '', percentage: '' })"
                  >Add royalties</v-btn
                >
                <p class="p" style="margin-top: 1em">
                  Avalilable {{ available }} %
                </p>
              </div>

              <section class="container-inputs">
                <v-sheet v-for="(item, i) in dataRoyalties" :key="i">
                  <div class="divcol">
                    <label :for="`account${i}`">NEAR account</label>
                    <v-text-field
                      v-model="item.account"
                      :id="`account|${i}`"
                      label="account.near"
                      v-debounce:800ms="validateNearId"
                      :error-messages="errorAccount[i]"
                      :success-messages="successAccount[i]"
                      solo
                    ></v-text-field>
                  </div>

                  <div class="divcol percentage">
                    <label :for="`percentage${i}`">%</label>
                    <v-text-field
                      ref="numberField"
                      v-model="item.percentage"
                      :id="`percentage|${i}`"
                      label="1 %"
                      solo
                      :rules="rules.required"
                      v-debounce:300ms="chkPercentage"
                      :error-messages="errorPercentaje[i]"
                      type="number"
                    ></v-text-field>
                  </div>
                  <v-btn icon @click="remove(i)">
                    <v-icon color="#868686">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-sheet>
              </section>

              <div class="divcol">
                <h3>Split Revenue</h3>
                <p>
                  Split revenue clears after each sale. Needs at least two
                  wallet addresses. The minter will receive 100% of split
                  revenue unless splits are added.
                </p>

                <v-btn @click="dataSplit.push({ account: '', percentage: '' })"
                  >Add split</v-btn
                >
                <p class="p" style="margin-top: 1em">
                  Avalilable {{ available1 }} %
                </p>
              </div>

              <section class="container-inputs">
                <v-sheet v-for="(item, i) in dataSplit" :key="i">
                  <div class="divcol">
                    <label :for="`account${i}`">NEAR account</label>
                    <v-text-field
                      v-model="item.account"
                      :id="`account|${i}`"
                      label="account.near"
                      v-debounce:800ms="validateNearId1"
                      :error-messages="errorAccount1[i]"
                      :success-messages="successAccount1[i]"
                      solo
                    ></v-text-field>
                  </div>

                  <div class="divcol percentage">
                    <label :for="`percentage${i}`">%</label>
                    <v-text-field
                      ref="numberField"
                      v-model="item.percentage"
                      :id="`percentage|${i}`"
                      label="1 %"
                      solo
                      :rules="rules.required"
                      v-debounce:300ms="chkPercentage1"
                      :error-messages="errorPercentaje1[i]"
                      type="number"
                    ></v-text-field>
                  </div>

                  <v-btn icon @click="dataSplit.splice(i, 1)">
                    <v-icon color="#868686">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-sheet>
              </section>

              <div id="container-actions" class="gap">
                <v-btn @click="step--">
                  <v-icon style="color: #ffffff !important" small
                    >mdi-arrow-left</v-icon
                  >Back
                </v-btn>
                <v-btn @click="mint" :disabled=disable>
                  Next<v-icon style="color: #ffffff !important" small
                    >mdi-arrow-right</v-icon
                  >
                </v-btn>
              </div>
            </v-form>
          </aside>
        </section>
      </v-window-item>

      <v-window-item :value="4">
        <h2 class="align" style="text-align: center">
          Let's create your ticket!
        </h2>

        <section class="jcenter divwrap">
          <div class="ticket-wrapper">
            <img
              class="ticket"
              src="@/assets/img/ticket-register.svg"
              alt="Ticket image"
            />

            <v-file-input
              v-for="(ticket, i) in dataTicket"
              :key="i"
              v-model="ticket.img"
              hide-details
              solo
              prepend-icon=""
              @change="uploadImg(ticket)"
            >
              <template v-slot:selection>
                <img v-if="ticket.url" :src="ticket.url" />
              </template>
            </v-file-input>
          </div>

          <v-form
            ref="form3"
            v-model="valid"
            @submit.prevent="next2()"
            class="divcol"
            style="min-height: 100%"
          >
            <div class="divcol">
              <h3>List NFT For Sale <span style="color: red">*</span></h3>

              <div class="divcol" style="margin-top: 4em">
                <label for="amount_list"
                  >Amount to list <span style="color: red">*</span></label
                >
                <div class="divcol">
                  <v-text-field
                    v-model="amount_list"
                    id="amount_list"
                    solo
                    :rules="rules.required"
                    type="number"
                    hide-spin-buttons
                  >
                    <template v-slot:append>
                      <v-btn
                        class="btn-control"
                        :disabled="amount_list == 0"
                        @click="amount_list--"
                        >-</v-btn
                      >
                      <v-btn class="btn-control" @click="amount_list++"
                        >+</v-btn
                      >
                    </template>
                  </v-text-field>
                  <span class="conversion">~ 0.00 USD</span>
                </div>
              </div>

              <div class="divcol">
                <label for="price"
                  >Price <span style="color: red">*</span></label
                >
                <div class="divcol">
                  <v-text-field
                    v-model="price"
                    id="price"
                    solo
                    :rules="rules.required"
                    type="number"
                  ></v-text-field>
                  <span class="conversion">~ 0.00 USD</span>
                </div>
              </div>
            </div>

            <div id="container-actions" class="gap">
              <v-btn @click="step--">
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn @click="next2">
                Next<v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                >
              </v-btn>
            </div>
          </v-form>
        </section>
      </v-window-item>

      <v-window-item :value="5">
        <h2 class="align" style="text-align: center">
          Let's create your ticket!
        </h2>

        <section class="jcenter divwrap">
          <div class="ticket-wrapper">
            <img
              class="ticket"
              src="@/assets/img/ticket-register.svg"
              alt="Ticket image"
            />

            <v-file-input
              v-for="(ticket, i) in dataTicket"
              :key="i"
              v-model="ticket.img"
              hide-details
              solo
              prepend-icon=""
              @change="uploadImg(ticket)"
            >
              <template v-slot:selection>
                <img v-if="ticket.url" :src="ticket.url" />
              </template>
            </v-file-input>
          </div>

          <aside class="divcol" style="min-height: 100%">
            <div class="divcol">
              <h3>
                Would you like to give a physical goodie with your ticket?
                (Drink, popcorn...)
              </h3>
              <p>
                We will transfer this NFT once your attendes get inside the
                venue so they can redeem it to get a real good.
              </p>

              <div id="container-actions" class="gap">
                <v-btn @click="goodie = true">Yes</v-btn>
                <v-btn :disabled="goodie">No</v-btn>
              </div>
            </div>

            <template v-if="goodie">
              <div class="divcol" style="margin-top: 1.5em">
                <label for="attendees"
                  >What are attendees going to receive with the NFT
                  ticket?</label
                >
                <v-text-field
                  v-model="dataTickets.attendees"
                  id="attendees"
                  solo
                ></v-text-field>
              </div>

              <div class="divcol">
                <label for="goodies"
                  >How much goodies for each attendee per ticket?</label
                >
                <v-text-field
                  v-model="dataTickets.goodies"
                  id="goodies"
                  type="number"
                  solo
                ></v-text-field>
              </div>

              <div class="divcol">
                <h4>Main image</h4>
                <p>
                  This is the first image attendees will see at the top of your
                  event page..
                </p>

                <v-file-input
                  solo
                  prepend-icon
                  accept="image/*"
                  @change="ImagePreview('main')"
                >
                  <template v-slot:selection>
                    <img class="imagePreview" :src="url2" alt="Image preview" />
                  </template>

                  <template v-slot:label>
                    <img src="@/assets/icons/drag-img.svg" alt="drag icon" />
                    <p class="p">
                      Drag and drop or click here to upload your main event
                      image
                    </p>
                  </template>
                </v-file-input>
              </div>
            </template>

            <div id="container-actions" class="gap">
              <v-btn
                @click="
                  step--;
                  goodie = false;
                "
              >
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn
                v-show="goodie"
                @click="mint(), console()"
                style="
                  background: linear-gradient(
                    183.61deg,
                    #cc00b7 49.78%,
                    rgba(0, 0, 0, 0) 225.35%
                  );
                "
              >
                Mint
              </v-btn>
            </div>
          </aside>
        </section>
      </v-window-item>
    </v-window>
  </section>
</template>

<script>
import ModalSuccess from "./ModalSuccess";
import { VueEditor } from "vue2-editor";
import { CONFIG } from "@/services/api";
import * as nearAPI from "near-api-js";
const { connect, keyStores } = nearAPI;
import { Wallet, Chain, Network } from "mintbase";
export default {
  name: "RegisterDashboard",
  components: {
    VueEditor,
    ModalSuccess,
  },
  data() {
    return {
      step: 1,
      dataTickets: {
        name: null,
        promoter: null,
        img: null,
        description: null,
        mint_amount: null,
      },
      url: null,
      url2: null,
      goodie: false,
      royalties: null,
      splits: null,
      image: null,
      loading: false,
      items: [],
      model: null,
      search: null,
      address: "",
      place_id: "",
      latitude: "",
      longitude: "",
      location: "",
      address: "",
      amount_list: 0,
      price: 0,
      menu: "",
      dataTicket: [
        {
          url: "",
          img: "",
        },
        {
          url: "",
          img: "",
        },
        {
          url: "",
          img: "",
        },
      ],
      dates: [],
      rules: {
        required: [(v) => !!v || "Field required"],
        percentage_split: [
          (v) => !!v || "Field required",
          () =>
            this.currentPercentage_split > 50 ? "must be 50% or less" : null,
        ],
      },
      valid: false,
      dataRoyalties: [],
      currentPercentage_royalties: 0,
      dataSplit: [],
      currentPercentage_split: 0,
      errorAccount: [],
      errorAccount1: [],
      successAccount: [],
      successAccount1: [],
      available: 50,
      available1: 100,
      errorPercentaje: [],
      errorPercentaje1: [],
      counter: 0,
      counter1: 0,
      arr: [],
      arr1: [],
      disable: false
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  methods: {
    uploadImg(item) {
      item.url = URL.createObjectURL(item.img);
    },
    ImagePreview(e) {
      if (e) {
        this.url = URL.createObjectURL(this.dataTickets.img);
        const file = e;
        this.image = file;
        //console.log(e);
      }
    },
    onFileChange(file) {
      console.log(file);
      if (!file) {
        return;
      }
      this.createImage(file);
    },
    async grantMinter() {
      let API_KEY = process.env.MINTBASE_DEV_API_KEY;
      const { data: walletData } = await new Wallet().init({
        networkName: Network.testnet,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;
      wallet
        .grantMinter("nearp2p.testnet", "globaldv.mintspace2.testnet")
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    async mint() {
     if (this.$refs.form2.validate()) { 
      console.log('mint')
      // let API_KEY = "63b2aa55-8acd-4b7c-85b4-397cea9bcae9";
      // const { data: walletData } = await new Wallet().init({
      //   networkName: Network.testnet,
      //   chain: Chain.near,
      //   apiKey: API_KEY,
      // });
      // const { wallet } = walletData;

      // try {
      //   const file = this.image;
      //   const { data: fileUploadResult, error: fileError } =
      //     await wallet.minter.uploadField(MetadataField.Media, file);
      //   if (fileError) {
      //     throw new Error(fileError);
      //   } else {
      //     console.log(fileUploadResult);
      //   }
      // } catch (error) {
      //   console.error(error);
      //   // TODO: handle error
      // }

      // let extra = [
      //   {
      //     trait_type: "location",
      //     value: this.location,
      //   },
      //   {
      //     trait_type: "latitude",
      //     value: this.latitude,
      //   },
      //   {
      //     trait_type: "longitude",
      //     value: this.longitude,
      //   },
      //   {
      //     trait_type: "place_id",
      //     value: this.place_id,
      //   },
      //   {
      //     trait_type: "zoom",
      //     value: 9,
      //   },
      //   {
      //     trait_type: "Promoter / Organizer name",
      //     value: this.dataTickets.promoter,
      //   },
      //   {
      //     trait_type: "Start Date",
      //     value: moment(this.dates[0]).unix(),
      //     display_type: "date",
      //   },
      //   {
      //     trait_type: "End Date",
      //     value: moment(this.dates[1]).unix(),
      //     display_type: "date",
      //   },
      // ];
      // let store = "globaldv.mintspace2.testnet";
      // let category = "ticketing";

      // const metadata = {
      //   title: this.dataTickets.name,
      //   description: this.dataTickets.description,
      //   extra,
      //   store,
      //   type: "NEP171",
      //   category,
      // };
      // wallet.minter.setMetadata(metadata, true);

      const royalties = {};
      const multiplied = 10000;
      var counter = this.counter;
      const multiplier = Math.round(multiplied / counter);
      this.dataRoyalties.forEach((element) => {
        royalties[element.account] = parseInt(element.percentage * multiplier);
      });
      const splits = {};
      var counter1 = this.counter1;
      const multiplier1 = Math.round(multiplied / counter1);
      this.dataSplit.forEach((element) => {
        splits[element.account] = parseInt(element.percentage * multiplier1);
      });
      // wallet
      //   .mint(
      //     parseFloat(this.dataTickets.mint_amount),
      //     "globaldv.mintspace2.testnet",
      //     !royalties ? undefined : royalties,
      //     !splits ? undefined : splits,
      //     category
      //   )
      //   .then((res) => {
      //     console.log(res.data);
      //   })
      //   .catch((err) => {
      //     console.log("Error", err);
      //   });
     }
    },
    /**
     * When the location found
     * @param {Object} addressData Data of the found location
     * @param {Object} placeResultData PlaceResult object
     * @param {String} id Input container ID
     */
    getAddressData: function (addressData, placeResultData, id) {
      this.address = addressData;
      this.place_id = addressData.place_id;
      this.location = placeResultData.formatted_address;
      this.latitude = addressData.latitude;
      this.longitude = addressData.longitude;
    },
    next() {
      if (this.$refs.form.validate()) {
        this.step++;
      }
    },
    next1() {
      if (this.$refs.form1.validate()) {
        this.step++;
      }
    },
    next2() {
      if (this.$refs.form2.validate()) {
        this.step++;
      }
    },
    // validating NEAR account
    async validateNearId(val, e) {
      //get the position from target, declaring the input name and poisition split |
      var pos = parseInt(e.target.id.split("|")[1]);
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      const account = await near.account(val);
      await account
        .state()
        .then((response) => {
          this.disable = false;
          this.errorAccount[pos] = null;
          this.successAccount[pos] = "Valid";
        })
        .catch((error) => {
          this.disable = true;
          this.errorAccount[pos] = "Not valid NEAR Account";
          this.successAccount[pos] = null;
        });
    },
    // validating NEAR account
    async validateNearId1(val, e) {
      //get the position from target, declaring the input name and poisition split |
      var pos = parseInt(e.target.id.split("|")[1]);
      const near = await connect(
        CONFIG(new keyStores.BrowserLocalStorageKeyStore())
      );
      const account = await near.account(val);
      await account
        .state()
        .then((response) => {
          this.disable = false;
          this.errorAccount1[pos] = null;
          this.successAccount1[pos] = "Valid";
        })
        .catch((error) => {
          this.disable = true;
          this.errorAccount1[pos] = "Not valid NEAR Account";
          this.successAccount1[pos] = null;
        });
    },
    // Function to check the percentage available
    // Get the array object and strore the values in a new array
    // and sum all the values
    chkPercentage(val, e) {
      //get the position from target, declaring the input name and poisition split |
      var pos = parseInt(e.target.id.split("|")[1]);
      this.arr = [];
      for (const prop in this.dataRoyalties) {
        this.arr.push(parseInt(this.dataRoyalties[prop].percentage));
      }
      this.counter = this.arr.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.available = 50 - this.counter;
      if (this.counter > 50) {
        this.disable = true;
        this.available = 0;
        this.errorPercentaje[pos] = "≤ 50%";
      } else {
        this.disable = false;
        this.errorPercentaje[pos] = null;
      }
    },
    chkPercentage1(val, e) {
      //get the position from target, declaring the input name and poisition split |
      var pos = parseInt(e.target.id.split("|")[1]);
      this.arr = [];
      for (const prop in this.dataSplit) {
        this.arr.push(parseInt(this.dataSplit[prop].percentage));
      }
      this.counter1 = this.arr.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.available1 = 100 - this.counter1;
      if (this.counter1 > 100) {
        this.disable = true;
        this.available1 = 0;
        this.errorPercentaje1[pos] = "≤ 100%";
      } else {
        this.disable = false;
        this.errorPercentaje1[pos] = null;
      }
    },
    // Remove data from de object
    remove(pos) {
      this.dataRoyalties.splice(pos, 1);
      this.arr = [];
      for (const prop in this.dataRoyalties) {
        this.arr.push(parseInt(this.dataRoyalties[prop].percentage));
      }
      this.counter = this.arr.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.available = 50 - this.counter;
      this.successAccount[pos] = null;
      this.errorAccount[pos] = null;
      this.errorPercentaje[pos] = null;
    },
    // Remove data from de object
    remove1(pos) {
      this.dataSplit.splice(pos, 1);
      this.arr = [];
      for (const prop in this.dataRoyalties) {
        this.arr.push(parseInt(this.dataRoyalties[prop].percentage));
      }
      this.counter1 = this.arr.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.available1 = 100 - this.counter1;
      this.successAccount1[pos] = null;
      this.errorAccount1[pos] = null;
      this.errorPercentaje1[pos] = null;
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
