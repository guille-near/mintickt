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
            <img v-if="ticket.imgTop" :src="ticket.imgTop" />
            <img v-if="ticket.imgBottomLeft" :src="ticket.imgBottomLeft" />
            <img v-if="ticket.imgBottomRight" :src="ticket.imgBottomRight" />

            <v-file-input
              v-model="ticket.imgTop"
              hide-details
              solo
            <v-file-input
              v-model="ticket.imgTop"
              hide-details solo
              prepend-icon=""
              @change="uploadImg('top')"
            >
              <template v-slot:selection>
                <img v-if="ticket.urlTop" :src="ticket.urlTop" />
              </template>
            </v-file-input>

            <v-file-input
              v-model="ticket.imgBottomLeft"
              hide-details
              solo
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
                <img v-if="ticket.urlBottomLeft" :src="ticket.urlBottomLeft" />
              </template>
            </v-file-input>

            <v-file-input
              v-model="ticket.imgBottomRight"
              hide-details
              solo
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
                <img
                  v-if="ticket.urlBottomRight"
                  :src="ticket.urlBottomRight"
                />
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

            <v-textarea
              v-model="dataTickets.description"
              solo
              auto-grow
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

            <h3>Date and time</h3>
            <p>
              Inform attendees when the event starts and ends so they can get
              organized
            </p>

            <div id="container-datatime" class="gap">
              <div class="divcol">
                <label for="date">Date</label>
                <v-select id="date" solo></v-select>
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dates"
                      range
                      label="Date"
                      hint="MM/DD/YYYY format"
                      solo
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      @blur="date = parseDate(dateFormatted)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates"
                    range
                    no-title
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>

            <div id="container-actions" class="gap">
              <v-btn disabled>
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn @click="step++">
                Next<v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                >
              </v-btn>

              <v-btn @click="mint()">
                Demo<v-icon style="color: #ffffff !important" small
              </v-btn>
              <div>
                <img src:"previewImage" class="uploading-image" />
                <input type="file" accept="image/jpeg" @change="onChangeImg" />
              </div>
            </div>
          </aside>
        </section>
      </v-window-item>

      <v-window-item :value="2">
        <h2 class="align" style="text-align: center">
          Let's create your ticket!
        </h2>

        <section class="jcenter divwrap">
          <img
            class="ticket"
            src="@/assets/img/ticket-register.svg"
            alt="Ticket image"
          />

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
              >
                <template v-slot:selection>
                  <img class="imagePreview" :src="url" alt="Image preview" />
                </template>

                <template v-slot:label>
                  <div id="container-tag" class="divcol center tcenter">
                    <img src="@/assets/icons/drag-img.svg" alt="drag icon" />
                    <p class="p">
                      Drag and drop or click here to upload your main event
                      image
                    </p>
                  </div>
                </template>
              </v-file-input>
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
          <img
            class="ticket"
            src="@/assets/img/ticket-register.svg"
            alt="Ticket image"
          />

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
          <img
            class="ticket"
            src="@/assets/img/ticket-register.svg"
            alt="Ticket image"
          />

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
                    <div id="container-tag" class="divcol center tcenter">
                      <img src="@/assets/icons/drag-img.svg" alt="drag icon" />
                      <p class="p">
                        Drag and drop or click here to upload your main event
                        image
                      </p>
                    </div>
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
import { Wallet, Chain, Network, MetadataField } from "mintbase";
export default {
  name: "RegisterDashboard",
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
        imgTop:
          "data:image/jpeg;base64,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",
        imgBottomLeft:
          "data:image/jpeg;base64,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",
        imgBottomRight:
          "data:image/jpeg;base64,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",
        urlTop: "",
        imgTop: "",
        urlBottomLeft: "",
        imgBottomLeft: "",
        urlBottomRight: "",
        imgBottomRight: "",
      },
      dates: ["2019-09-10", "2019-09-20"],
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
        case "top":
          this.ticket.urlTop = URL.createObjectURL(this.ticket.imgTop);
          break;
        case "left":
          this.ticket.urlBottomLeft = URL.createObjectURL(
            this.ticket.imgBottomLeft
          );
          break;
        case "right":
          this.ticket.urlBottomRight = URL.createObjectURL(
            this.ticket.imgBottomRight
          );
          break;
        default:
          null;
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
