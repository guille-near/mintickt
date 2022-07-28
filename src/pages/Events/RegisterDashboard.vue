<template>
  <section id="createTickets" class="registerDashboard divcol gap align">
    <v-window v-model="step">
      <v-window-item :value="1">
        <h2 class="align" style="text-align: center">
          Let's create your NFT for your event!
        </h2>

        <section class="center divwrap">
          <img class="ticket" src="@/assets/img/ticket-register.svg" alt="Ticket image">

          <aside class="divcol">
            <h3>Basic Information</h3>
            <p>
              Choose a name for your event and tell attendees why you think they will have a great time. Add details that highlight why your event is unique.
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
            <p>Add more details of your event, such as program, sponsors or featured guests.</p>

            <v-textarea
              v-model="dataTickets.description"
              solo
              auto-grow
            ></v-textarea>

            <h3>Location</h3>
            <p>Help people in the area find out about the event and make sure your attendees know where to go.</p>

            <label for="location">Search your location</label>
            <v-select
              id="location"
              solo
            ></v-select>

            <h3>Date and time</h3>
            <p>Inform attendees when the event starts and ends so they can get organized</p>

            <div id="container-datatime" class="gap">
              <div class="divcol">
                <label for="date">Date</label>
                <v-select
                  id="date"
                  solo
                ></v-select>
              </div>
              <div class="divcol">
                <label for="time">Time</label>
                <v-select
                  id="time"
                  solo
                ></v-select>
              </div>
            </div>

            <div id="container-actions" class="gap">
              <v-btn disabled>
                <v-icon style="color:#FFFFFF !important" small>mdi-arrow-left</v-icon>Back
              </v-btn>
              <v-btn @click="step++">
                Next<v-icon style="color:#FFFFFF !important" small>mdi-arrow-right</v-icon>
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
          <img class="ticket" src="@/assets/img/ticket-register.svg" alt="Ticket image">

          <aside class="divcol" style="min-height:100%">
            <div class="divcol">
              <h3>Main event image</h3>
              <p>This is the first image attendees will see at the top of your event page..</p>

              <v-file-input
                v-model="dataTickets.img"
                solo
                prepend-icon
                accept="image/*"
                @change="ImagePreview('image')"
              >
                <template v-slot:selection>
                  <img class="imagePreview" :src="url" alt="Image preview">
                </template>

                <template v-slot:label>
                  <div id="container-tag" class="divcol center tcenter">
                    <img src="@/assets/icons/drag-img.svg" alt="drag icon">
                    <p class="p">Drag and drop or click here to upload your main event image</p>
                  </div>
                </template>
              </v-file-input>
            </div>

            <div id="container-actions" class="gap">
              <v-btn @click="step--">
                <v-icon style="color:#FFFFFF !important" small>mdi-arrow-left</v-icon>Back
              </v-btn>
              <v-btn @click="step++">
                Next<v-icon style="color:#FFFFFF !important" small>mdi-arrow-right</v-icon>
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
          <img class="ticket" src="@/assets/img/ticket-register.svg" alt="Ticket image">

          <aside class="divcol gap" style="min-height:100%">
            <div class="divcol">
              <h3>Royalties</h3>
              <p>Royalties are perpetual. You can add royalties up to 50% across 25 accounts.</p>
              
              <v-btn>Add royalties</v-btn>
            </div>
            
            <div class="divcol">
              <h3>Split Revenue</h3>
              <p>Split revenue clears after each sale. Needs at least two wallet addresses. The minter will receive 100% of split revenue unless splits are added.</p>
              
              <v-btn>Add split</v-btn>
            </div>

            <div id="container-actions" class="gap">
              <v-btn @click="step--">
                <v-icon style="color:#FFFFFF !important" small>mdi-arrow-left</v-icon>Back
              </v-btn>
              <v-btn @click="step++">
                Next<v-icon style="color:#FFFFFF !important" small>mdi-arrow-right</v-icon>
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
          <img class="ticket" src="@/assets/img/ticket-register.svg" alt="Ticket image">

          <aside class="divcol" style="min-height:100%">
            <div class="divcol">
              <h3>Would you like to give a physical goodie with your ticket? (Drink, popcorn...)</h3>
              <p>We will transfer this NFT once your attendes get inside the venue so they can redeem it to get a real good.</p>
              
              <div id="container-actions" class="gap">
                <v-btn @click="goodie=true">Yes</v-btn>
                <v-btn :disabled="goodie">No</v-btn>
              </div>
            </div>

            <template v-if="goodie">
              <div class="divcol" style="margin-top:1.5em">
                <label for="attendees">What are attendees going to receive with the NFT ticket?</label>
                <v-text-field
                  v-model="dataTickets.attendees"
                  id="attendees"
                  solo
                ></v-text-field>
              </div>
              
              <div class="divcol">
                <label for="goodies">How much goodies for each attendee per ticket?</label>
                <v-text-field
                  v-model="dataTickets.goodies"
                  id="goodies"
                  type="number"
                  solo
                ></v-text-field>
              </div>
              
              <div class="divcol">
                <h4>Main image</h4>
                <p>This is the first image attendees will see at the top of your event page..</p>

                <v-file-input
                  solo
                  prepend-icon
                  accept="image/*"
                  @change="ImagePreview('main')"
                >
                  <template v-slot:selection>
                    <img class="imagePreview" :src="url2" alt="Image preview">
                  </template>

                  <template v-slot:label>
                    <div id="container-tag" class="divcol center tcenter">
                      <img src="@/assets/icons/drag-img.svg" alt="drag icon">
                      <p class="p">Drag and drop or click here to upload your main event image</p>
                    </div>
                  </template>
                </v-file-input>
              </div>
            </template>

            <div id="container-actions" class="gap">
              <v-btn @click="step--;goodie=false">
                <v-icon style="color:#FFFFFF !important" small>mdi-arrow-left</v-icon>Back
              </v-btn>
              <v-btn v-show="goodie" @click="console()" style="background:linear-gradient(183.61deg, #CC00B7 49.78%, rgba(0, 0, 0, 0) 225.35%);">
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
    };
  },
  methods: {
    ImagePreview(key) {
      if (key=='image') {this.url= URL.createObjectURL(this.dataTickets.img)}
      if (key=='main') {this.url2= URL.createObjectURL(
        // this.dataTickets.img    - crear modelo
      )}
    },
    console() {
      console.log(this.dataTickets, 'and', this.url)
    }
  }
};
</script>

<style src="../pages.scss" lang="scss" />
