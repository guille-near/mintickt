<template>
  <section id="createTickets" class="center align relative">
    <div class="filtro1"></div>
    <div class="filtro2"></div>
    <div class="filtro3"></div>
    <div class="filtro4"></div>

    <v-window v-model="step">
      <v-window-item :value="1">
        <h2 class="align" style="text-align: center">
          Let's create your NFT for your event!
        </h2>

        <section class="center divwrap">
          <img class="ticket" src="@/assets/img/ticket.svg" alt="Ticket image">

          <aside class="divcol">
            <h3>Basic Information</h3>
            <p>
              Basic Information Choose a name for your event and tell attendees why you 
              think they will have a great time. Add details that highlight why your event is unique.
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
              <label for="promoter">Promoter/Organizer name</label>
              <v-text-field
                v-model="dataTickets.promoter"
                id="promoter"
                solo
              ></v-text-field>
            </div>

            <h3>Location</h3>
            <p>
              Location Help people in the area find out about the event and make 
              sure your attendees know where to go.
            </p>

            <div class="divcol">
              <label for="location">Search your location</label>
              <v-text-field
                v-model="dataTickets.location"
                id="location"
                solo
              ></v-text-field>
            </div>

            <v-btn @click="step++">Next step</v-btn>
          </aside>
        </section>
      </v-window-item>



      <v-window-item :value="2">
        <h2 class="align" style="text-align: center">
          Let's create your ticket!
        </h2>

        <section class="center divwrap">
          <img class="ticket" src="@/assets/img/ticket.svg" alt="Ticket image">

          <aside class="divcol">
            <h3>Main event image</h3>
            <p>This is the first image attendees will see at the top of your event page..</p>

            <v-file-input
              v-model="dataTickets.img"
              solo
              prepend-icon
              accept="image/*"
              @change="ImagePreview()"
            >
              <template v-slot:selection>
                <img class="imagePreview" :src="url" alt="Image preview">
              </template>
            </v-file-input>

            <h3>Description</h3>
            <p>Add more details of your event, such as program, sponsors or featured guests.</p>

            <v-textarea
              v-model="dataTickets.description"
              solo
              auto-grow
            >
            </v-textarea>

            <v-btn @click="step++, console()">Next step</v-btn>
          </aside>
        </section>
      </v-window-item>
    </v-window>
  </section>
</template>

<script>
export default {
  name: "CreateTickets",
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
    };
  },
  methods: {
    ImagePreview() {
      this.url= URL.createObjectURL(this.dataTickets.img)
    },
    console() {
      console.log(this.dataTickets, 'and', this.url)
    }
  }
};
</script>

<style src="../pages.scss" lang="scss" />
