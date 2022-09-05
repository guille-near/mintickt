<template>
  <section id="createTickets" class="registerDashboard divcol gap align">
    <v-window v-model="step">
      <v-window-item :value="1">
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
              v-model="ticket.imgTop"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('top')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlTop" :src="ticket.urlTop">
              </template>
            </v-file-input>
            
            <v-file-input
              v-model="ticket.imgBottomLeft"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('left')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlBottomLeft" :src="ticket.urlBottomLeft">
              </template>
            </v-file-input>
            
            <v-file-input
              v-model="ticket.imgBottomRight"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('right')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlBottomRight" :src="ticket.urlBottomRight">
              </template>
            </v-file-input>
          </div>

          <aside class="divcol">
            <h3>Basic Information</h3>
            <p>
              Choose a name for your event and tell attendees why you think they
              will have a great time. Add details that highlight why your event
              is unique.
            </p>

            <div class="divcol">
              <label for="name">Event name</label>
              <v-text-field
                v-model="dataTickets.name"
                id="name"
                solo
              ></v-text-field>
            </div>

            <div class="divcol">
              <label for="promoter">Promoter / Organizer name</label>
              <v-text-field
                v-model="dataTickets.promoter"
                id="promoter"
                solo
              ></v-text-field>
            </div>

            <h3>Description</h3>
            <p>
              Add more details of your event, such as program, sponsors or
              featured guests.
            </p>

            <vue-editor v-model="dataTickets.description"></vue-editor>
            <!-- <v-textarea
              v-model="dataTickets.description"
              solo
              auto-grow
            ></v-textarea> -->

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
                  <v-date-picker v-model="dates" range no-title scrollable color="hsl(306, 100%, 50%)" dark>
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
              <v-btn @click="step++">
                Next
                <!-- <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                > -->
              </v-btn>
            </div>
          </aside>
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
              v-model="ticket.imgTop"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('top')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlTop" :src="ticket.urlTop">
              </template>
            </v-file-input>
            
            <v-file-input
              v-model="ticket.imgBottomLeft"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('left')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlBottomLeft" :src="ticket.urlBottomLeft">
              </template>
            </v-file-input>
            
            <v-file-input
              v-model="ticket.imgBottomRight"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('right')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlBottomRight" :src="ticket.urlBottomRight">
              </template>
            </v-file-input>
          </div>

          <aside class="divcol" style="min-height: 100%">
            <div class="divcol">
              <h3>Main event image</h3>
              <p>
                This is the first image attendees will see at the top of your
                event page..
              </p>

              <v-file-input
                v-model="dataTickets.img"
                solo
                prepend-icon
                accept="image/*"
                @change="ImagePreview('image')"
                class="input-unique"
              >
                <template v-slot:selection>
                  <img class="imagePreview" :src="url" alt="Image preview" />
                </template>

                <template v-slot:label>
                  <img src="@/assets/icons/drag-img.svg" alt="drag icon" />
                  <p class="p">
                    Drag and drop or click here to upload your main event
                    image
                    
                  </p>
                </template>
              </v-file-input>
                                  <input class="uploading-image-input" type="file" accept="image/jpeg" @change="onChangeImg" />
            </div>

            <div id="container-actions" class="gap">
              <v-btn @click="step--">
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn @click="step++">
                Next<v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                >
              </v-btn>
            </div>
          </aside>
        </section>
      </v-window-item>

      <v-window-item :value="3">
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
              v-model="ticket.imgTop"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('top')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlTop" :src="ticket.urlTop">
              </template>
            </v-file-input>
            
            <v-file-input
              v-model="ticket.imgBottomLeft"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('left')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlBottomLeft" :src="ticket.urlBottomLeft">
              </template>
            </v-file-input>
            
            <v-file-input
              v-model="ticket.imgBottomRight"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('right')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlBottomRight" :src="ticket.urlBottomRight">
              </template>
            </v-file-input>
          </div>

          <aside class="divcol gap" style="min-height: 100%">
            <div class="divcol">
              <h3>Royalties</h3>
              <p>
                Royalties are perpetual. You can add royalties up to 50% across
                25 accounts.
              </p>

              <v-btn>Add royalties</v-btn>
            </div>

            <div class="divcol">
              <h3>Split Revenue</h3>
              <p>
                Split revenue clears after each sale. Needs at least two wallet
                addresses. The minter will receive 100% of split revenue unless
                splits are added.
              </p>

              <v-btn>Add split</v-btn>
            </div>

            <div id="container-actions" class="gap">
              <v-btn @click="step--">
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn @click="step++">
                Next<v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                >
              </v-btn>
            </div>
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
              v-model="ticket.imgTop"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('top')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlTop" :src="ticket.urlTop">
              </template>
            </v-file-input>
            
            <v-file-input
              v-model="ticket.imgBottomLeft"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('left')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlBottomLeft" :src="ticket.urlBottomLeft">
              </template>
            </v-file-input>
            
            <v-file-input
              v-model="ticket.imgBottomRight"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('right')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlBottomRight" :src="ticket.urlBottomRight">
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
import { VueEditor } from "vue2-editor";
import { Wallet, Chain, Network, MetadataField } from "mintbase";
export default {
  name: "RegisterDashboard",
  components: {
    VueEditor
  },
  data() {
    return {
      step: 1,
      dataTickets: {
        name: null,
        promoter: null,
        img: null,
        description: null,
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
      ticket: {
        urlTop: "",
        imgTop: "",
        urlBottomLeft: "",
        imgBottomLeft: "",
        urlBottomRight: "",
        imgBottomRight: "",
      },
      dates: [],
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  methods: {
    uploadImg(key) {
      switch (key) {
        case "top": this.ticket.urlTop = URL.createObjectURL(this.ticket.imgTop);
          break;
        case "left": this.ticket.urlBottomLeft = URL.createObjectURL(this.ticket.imgBottomLeft);
          break;
        case "right": this.ticket.urlBottomRight = URL.createObjectURL(this.ticket.imgBottomRight);
          break;
        default: null;
      }
    },
    ImagePreview(key) {
      //const file = e.target.files[0];
      //this.image = file;
      console.log(this.image)
      if (key == "image") {
        this.url = URL.createObjectURL(this.dataTickets.img);
      }
      if (key == "main") {
        this.url2 = URL
          .createObjectURL
          // this.dataTickets.img    - crear modelo
          ();
      }
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
      let API_KEY = "63b2aa55-8acd-4b7c-85b4-397cea9bcae9";
      const { data: walletData } = await new Wallet().init({
        networkName: Network.testnet,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;

      try {
        const file = this.image;
        const { data: fileUploadResult, error: fileError } =
          await wallet.minter.uploadField(MetadataField.Media, file);
        if (fileError) {
          throw new Error(fileError);
        } else {
          console.log(fileUploadResult);
        }
      } catch (error) {
        console.error(error);
        // TODO: handle error
      }

      let extra = [
        {
          trait_type: "location",
          value: this.location,
        },
        {
          trait_type: "latitude",
          value: this.latitude,
        },
        {
          trait_type: "longitude",
          value: this.longitude,
        },
        {
          trait_type: "place_id",
          value: this.place_id,
        },
        {
          trait_type: "zoom",
          value: 9,
        },
        {
          trait_type: "Start Date",
          value: 1661572800,
          display_type: "date",
        },
        {
          trait_type: "End Date",
          value: 1661918400,
          display_type: "date",
        },
      ];
      let store = "globaldv.mintspace2.testnet";
      let category = "Fashion";

      const metadata = {
        title: "Cinema2",
        description: "Cinema2",
        extra,
        store,
        type: "NEP171",
        category,
      };
      wallet.minter.setMetadata(metadata, true);

      const royalties = 0;
      const splits = 0;

      wallet
        .mint(
          18,
          "globaldv.mintspace2.testnet",
          !royalties ? undefined : royalties.royaltyArgs,
          !splits ? undefined : splits,
          category
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    onChangeImg(e) {
      const file = e.target.files[0];
      this.image = file;
      console.log(this.image)
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
  },
};
</script>

<style src="../pages.scss" lang="scss" />
