<template>
  <section id="createTickets" class="registerDashboard divcol gap align">
    <ModalSuccess ref="modal"></ModalSuccess>

    <h2
      class="eliminarmobile align"
      v-if="step == 1"
      style="text-align: center"
    >
      Let's create your event!
    </h2>

    <v-window v-model="step" to touchless>
      <v-window-item :value="1">
        <section class="center divwrap">
          <h2 class="vermobile align" style="text-align: center">
            Let's create your NFT for your event!
          </h2>
          <!-- // * canvas ticket -->
          <div class="ticket-wrapper" @click="loadAgain" v-if="imagecanvas">
            <img class="ticket" :src="canvas" alt="Ticket image" />
          </div>

          <!-- // * custome ticket -->
          <div
            v-if="imagecanvas1 && ticketType === 'custom'"
            class="ticket-wrapper custom"
          >
            <img
              src="@/assets/ticket-selection/ticket-custom-upload.svg"
              alt="custom ticket"
              class="image-ticket-event-empty"
              :class="{ active: dataTicket[0].img }"
            />

            <v-file-input
              v-model="dataTicket[0].img"
              hide-details
              solo
              name="ticket_design"
              prepend-icon=""
              :clearable="false"
              @change="uploadImg(dataTicket[0])"
              :class="{ active: dataTicket[0].img }"
            >
              <template v-slot:selection>
                <div
                  class="image-ticket-event"
                  :style="`--bg-image: url(${dataTicket[0].url})`"
                />
              </template>
            </v-file-input>
          </div>

          <!-- // * normal tickets -->
          <div
            class="ticket-wrapper"
            v-else-if="imagecanvas1 && ticketType"
            id="my-node"
            data-ticket
            :class="ticketType"
          >
            <img
              class="ticket"
              id="ticket-design"
              :src="
                require(`@/assets/ticket-selection/ticket-${ticketType}-upload.svg`)
              "
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
              :class="{ active: ticket.img }"
            >
              <template v-slot:selection>
                <!-- <img v-if="ticket.url" :src="ticket.url" /> -->
                <div
                  class="image-ticket-event"
                  :style="`--bg-image: url(${ticket.url})`"
                />
              </template>
            </v-file-input>
          </div>

          <div class="container-content divcol" style="gap: 20px">
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent="next()"
              class="divcol"
            >
              <h3>Basic Information</h3>
              <p>
                Choose a name for your event and tell attendees why you think
                they will have a great time. Add details that highlight why your
                event is unique.
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

              <vue-editor
                v-model="dataTickets.description"
                class="editor"
                :class="{ rules: editorRules }"
              />
              <!--<v-textarea
                v-model="dataTickets.description"
                solo
                auto-grow
                :rules="rules.required"
              ></v-textarea>-->

              <h3>Location <span style="color: red">*</span></h3>
              <p>
                Help people in the area discover your event and let attendees
                know where to show up.
              </p>

              <vuetify-google-autocomplete
                id="map"
                :loading="loading"
                append-icon="search"
                v-bind:disabled="false"
                flat
                v-model="location"
                hide-no-data
                hide-selected
                placeholder="Search your location"
                clearable
                classname="form-control"
                style="padding-bottom: 15px"
                :enable-geolocation="false"
                :rules="rules.required"
                solo
                v-on:placechanged="getAddressData"
              >
              </vuetify-google-autocomplete>

              <h3>Date and time <span style="color: red">*</span></h3>
              <p>
                Tell event-goers when your event starts and ends so they can
                make plans to attend.
              </p>

              <!-- full date -->
              <div class="divcol" style="gap: 6px">
                <label for="date"> Full Date </label>
                <v-menu
                  ref="menu-date"
                  v-model="MenuDates"
                  :close-on-content-click="false"
                  :return-value.sync="dates"
                  :rules="rules.required"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <label for="date">
                      <v-text-field
                        id="date"
                        v-model="dateRangeText"
                        readonly
                        solo
                        v-on="on"
                        v-bind="attrs"
                        :rules="rules.required"
                      ></v-text-field>
                    </label>
                    <!-- <label for="date" class="mb-5">
                      <v-combobox
                        v-model="dates"
                        id="date"
                        solo
                        multiple
                        deletable-chips
                        chips
                        readonly
                        clearable
                        hide-details
                        :class="{ rules: comboboxRules }"
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules.required"
                      ></v-combobox>
                    </label> -->
                  </template>
                  <v-date-picker
                    v-model="dates"
                    no-title
                    scrollable
                    range
                    color="hsl(306, 100%, 50%)"
                    dark
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs['menu-date'].save(dates)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>

              <div class="space" style="gap: 20px">
                <!-- start time -->
                <div class="divcol" style="gap: 6px">
                  <label for="start-time"> Start Time </label>

                  <!-- <label for=""> -->
                  <date-picker
                    id="start-time"
                    v-model="startTime"
                    type="time"
                    :time-picker-options="{
                      start: '06:00',
                      step: '00:30',
                      end: '23:30',
                    }"
                    format="HH:mm"
                    placeholder="hh:mm"
                    :class="{ rules: timepickerStartRules }"
                    :editable="false"
                    @input="validatorStartTime(startTime)"
                  >
                  </date-picker>
                  <!-- </label> -->
                  <!-- <time-picker v-model="startTime" dialog minute-interval="15">
										<template v-slot:activator="{ on }">
                      <label for="start-time">
                        <v-text-field
                          v-model="startTime"
                          id="start-time"
                          readonly
                          solo
                          v-on="on"
                          :rules="rules.required"
                          style="pointer-events: none"
                        ></v-text-field>
                      </label>
										</template>
                  </time-picker> -->

                  <!-- <v-menu
										ref="menu-start-time"
										v-model="menuStartTime"
										:close-on-content-click="false"
										:return-value.sync="startTime"
										transition="scale-transition"
										nudge-left="100%"
									>
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
												v-model="startTime"
												id="start-time"
												readonly
												solo
												v-bind="attrs"
												v-on="on"
												:rules="rules.required"
											></v-text-field>
										</template>
										<v-time-picker
											v-if="menuStartTime"
											v-model="startTime"
											width="200px"
											color="hsl(306, 100%, 50%)"
											header-color="#1e1e1e"
											dark
											@click:minute="$refs[`menu-start-time`].save(startTime)"
										></v-time-picker>
									</v-menu> -->
                </div>

                <!-- end date -->
                <div class="divcol" style="gap: 6px">
                  <label for="end-time"> End Time </label>

                  <date-picker
                    v-model="endTime"
                    type="time"
                    :time-picker-options="{
                      start: '06:00',
                      step: '00:30',
                      end: '23:30',
                    }"
                    :open.sync="open"
                    format="HH:mm"
                    placeholder="hh:mm"
                    :class="{ rules: timepickerEndRules }"
                    :editable="false"
                    @input="validatorEndTime(endTime)"
                  ></date-picker>

                  <!-- <time-picker v-model="endTime" dialog minute-interval="15">
										<template v-slot:activator="{ on }">
                      <label for="end-time">
                        <v-text-field
                          v-model="endTime"
                          id="end-time"
                          readonly
                          solo
                          v-on="on"
                          :rules="rules.required"
                          style="pointer-events: none"
                        ></v-text-field>
                      </label>
										</template>
                  </time-picker> -->

                  <!-- <v-menu
										ref="menu-end-time"
										v-model="menuEndTime"
										:close-on-content-click="false"
										:return-value.sync="endTime"
										transition="scale-transition"
										nudge-left="100%"
									>
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
												v-model="endTime"
												id="end-time"
												readonly
												solo
												v-bind="attrs"
												v-on="on"
												:rules="rules.required"
											></v-text-field>
										</template>
										<v-time-picker
											v-if="menuEndTime"
											v-model="endTime"
											width="200px"
											color="hsl(306, 100%, 50%)"
											header-color="#1e1e1e"
											dark
											@click:minute="$refs[`menu-end-time`].save(endTime)"
										></v-time-picker>
									</v-menu> -->
                </div>
              </div>

              <v-btn v-if="i > 0" icon @click="dates.splice(i, 1)">
                <v-icon color="#868686">mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-form>

            <div class="container-content--actions center gap eliminarmobile">
              <v-btn @click="design">
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >
                Back
              </v-btn>
              <v-btn :loading="loading" @click="next">
                Next
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                >
              </v-btn>
            </div>
          </div>
        </section>

        <div class="container-content--actions center gap vermobile">
          <v-btn disabled>
            <v-icon style="color: #ffffff !important" small
              >mdi-arrow-left</v-icon
            >
            Back
          </v-btn>
          <v-btn @click="next">
            Next
            <v-icon style="color: #ffffff !important" small
              >mdi-arrow-right</v-icon
            >
          </v-btn>
        </div>
      </v-window-item>

      <v-window-item :value="2">
        <section class="jcenter divwrap">
          <div class="ticket-wrapper">
            <img
              class="ticket"
              :class="ticketType"
              :src="canvas"
              alt="Ticket image"
            />
          </div>
          <div class="container-content divcol" style="gap: 20px">
            <v-form
              ref="form1"
              v-model="valid"
              enctype="multipart/form-data"
              @submit.prevent="next1()"
              class="divcol"
              style="min-height: 100%"
            >
              <div class="divcol">
                <h3>Main event image <span style="color: red">*</span></h3>
                <p>
                  This is the first image attendees will see at the top of your
                  event page.
                </p>

                <v-file-input
                  v-model="dataTickets.img_main"
                  solo
                  prepend-icon
                  name="uploaded_file"
                  accept="image/*"
                  :rules="rules.required"
                  @change="ImagePreview"
                  class="input-unique"
                >
                  <template v-slot:selection>
                    <img
                      class="imagePreview"
                      :src="url"
                      alt="Image preview"
                      style="object-fit: cover"
                    />
                  </template>

                  <template v-slot:label>
                    <img src="@/assets/icons/link.svg" alt="drag icon" />
                    <p class="p">
                      Drag and drop or click here to upload your main event
                      image
                    </p>
                  </template>
                </v-file-input>
                <h3>
                  How many tickets you would like have for your event?
                  <span style="color: red">*</span>
                </h3>
                <p>You can always mint/list more NFT tickets later.</p>

                <v-text-field
                  v-model="dataTickets.mint_amount"
                  id="amount_list"
                  solo
                  :rules="rules.required"
                  v-debounce:800ms="checkMintAmount"
                  type="number"
                  hide-spin-buttons
                >
                  <template v-slot:append>
                    <v-btn
                      class="btn-control"
                      :disabled="dataTickets.mint_amount == 0"
                      @click="dataTickets.mint_amount--"
                      >-</v-btn
                    >
                    <v-btn
                      class="btn-control"
                      :disabled="dataTickets.mint_amount == 20"
                      @click="dataTickets.mint_amount++"
                      >+</v-btn
                    >
                  </template>
                </v-text-field>
              </div>
            </v-form>

            <div class="container-content--actions center gap eliminarmobile">
              <v-btn @click="back">
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
          </div>
        </section>

        <div class="container-content--actions center gap vermobile">
          <v-btn @click="back">
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
      </v-window-item>

      <v-window-item :value="3">
        <section class="jcenter divwrap">
          <div class="ticket-wrapper">
            <img class="ticket" :src="canvas" alt="Ticket image" />
          </div>
          <div class="container-content divcol" style="gap: 20px">
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
                    @click="dataRoyalties.push({ account: '', percentage: 0 })"
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
                        min="0"
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

                <div class="divcol" style="margin-top: 30px">
                  <h3>Split Revenue</h3>
                  <p>
                    Split revenue clears after each sale. Needs at least two
                    wallet addresses. The minter will receive 100% of split
                    revenue unless splits are added.
                  </p>

                  <v-btn @click="dataSplit.push({ account: '', percentage: 0 })"
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
                        min="0"
                        v-debounce:300ms="chkPercentage1"
                        :error-messages="errorPercentaje1[i]"
                        type="number"
                      ></v-text-field>
                    </div>

                    <v-btn icon @click="remove1(i)">
                      <v-icon color="#868686">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </v-sheet>
                </section>
              </v-form>
            </aside>

            <div class="container-content--actions center gap eliminarmobile">
              <v-btn @click="back">
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn
                type="submit"
                @click="mint()"
                :loading="loading"
                :disabled="disable"
                class="mint"
              >
                Mint<v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                >
              </v-btn>
            </div>
          </div>
        </section>

        <div class="container-content--actions center gap vermobile">
          <v-btn @click="back">
            <v-icon style="color: #ffffff !important" small
              >mdi-arrow-left</v-icon
            >Back
          </v-btn>
          <v-btn
            type="submit"
            @click="mint"
            :loading="loading"
            :disabled="disable"
            class="mint"
          >
            Mint<v-icon style="color: #ffffff !important" small
              >mdi-arrow-right</v-icon
            >
          </v-btn>
        </div>
      </v-window-item>

      <v-window-item :value="4">
        <section class="jcenter divwrap">
          <div class="ticket-wrapper">
            <img class="ticket" :src="canvas" alt="Ticket image" />
          </div>
          <div class="container-content divcol" style="gap: 20px">
            <v-form
              ref="form3"
              v-model="valid"
              @submit.prevent="list()"
              class="divcol"
              style="min-height: 100%"
            >
              <div class="divcol">
                <h3>List NFT For Sale <span style="color: red">*</span></h3>

                <div class="divcol">
                  <label for="amount_list"
                    >Amount to list Max ( {{ show_total_minted }} )
                    <span style="color: red">*</span></label
                  >
                  <div class="divcol">
                    <v-text-field
                      v-model="amount_list"
                      id="amount_list"
                      solo
                      :rules="rules.required"
                      min="0"
                      v-debounce:800ms="checkListAmount"
                      type="number"
                      hide-spin-buttons
                    >
                      <template v-slot:append>
                        <v-btn
                          class="btn-control"
                          :disabled="amount_list == 0"
                          @click="substract"
                          >-</v-btn
                        >
                        <v-btn
                          class="btn-control"
                          :disabled="amount_list == total_minted"
                          @click="add"
                          >+</v-btn
                        >
                      </template>
                    </v-text-field>
                  </div>
                </div>

                <div class="divcol">
                  <label for="price"
                    >Price (NEAR)<span style="color: red">*</span></label
                  >
                  <div class="divcol">
                    <v-text-field
                      v-model="price"
                      id="price"
                      solo
                      v-debounce:300ms="priceNEAR"
                      min="0"
                      :rules="rules.required"
                      type="number"
                    ></v-text-field>
                    <span class="conversion">~ {{ usd }} USD</span>
                  </div>
                </div>
              </div>
            </v-form>

            <div class="container-content--actions center gap eliminarmobile">
              <v-btn @click="back">
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn
                type="submit"
                @click="list()"
                :loading="loading"
                :disabled="disable"
              >
                List<v-icon style="color: #ffffff !important" small
                  >mdi-arrow-right</v-icon
                >
              </v-btn>
            </div>
          </div>
        </section>

        <div class="container-content--actions center gap vermobile">
          <v-btn @click="back">
            <v-icon style="color: #ffffff !important" small
              >mdi-arrow-left</v-icon
            >Back
          </v-btn>
          <v-btn
            type="submit"
            @click="list"
            :loading="loading"
            :disabled="disable"
          >
            List<v-icon style="color: #ffffff !important" small
              >mdi-arrow-right</v-icon
            >
          </v-btn>
        </div>
      </v-window-item>

      <v-window-item :value="5">
        <section class="jcenter divwrap">
          <div class="ticket-wrapper">
            <img class="ticket" :src="canvas" alt="Ticket image" />
          </div>
          <div class="container-content divcol" style="gap: 20px">
            <v-form
              ref="form4"
              v-model="valid"
              @submit.prevent="mintGoodie()"
              class="divcol"
              style="min-height: 100%"
            >
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
                    <v-btn @click="showModal" :disabled="goodie">No</v-btn>
                  </div>
                </div>

                <template v-if="goodie">
                  <div class="divcol" style="margin-top: 1.5em">
                    <label for="attendees" class="sf-pro"
                      >What are attendees going to receive with the NFT
                      ticket?</label
                    >
                    <v-text-field
                      v-model="dataTickets.attendees"
                      :rules="rules.required"
                      id="attendees"
                      solo
                    ></v-text-field>
                  </div>

                  <div class="divcol" style="display: none">
                    <label for="goodies" class="sf-pro"
                      >How much goodies for each attendee per ticket?</label
                    >
                    <v-text-field
                      v-model="dataTickets.goodies"
                      id="goodies"
                      solo
                      :rules="rules.required"
                      type="number"
                      min="0"
                      hide-spin-buttons
                    >
                      <template v-slot:append>
                        <v-btn
                          class="btn-control"
                          @click="dataTickets.goodies--"
                          >-</v-btn
                        >
                        <v-btn
                          class="btn-control"
                          @click="dataTickets.goodies++"
                          >+</v-btn
                        >
                      </template>
                    </v-text-field>
                  </div>
                </template>
              </aside>
            </v-form>

            <div class="container-content--actions center gap eliminarmobile">
              <v-btn @click="back">
                <v-icon style="color: #ffffff !important" small
                  >mdi-arrow-left</v-icon
                >Back
              </v-btn>
              <v-btn
                v-show="goodie"
                type="submit"
                @click="mintGoodie"
                :loading="loading"
                :disabled="disable"
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
          </div>
        </section>

        <div class="container-content--actions center gap vermobile">
          <v-btn @click="back">
            <v-icon style="color: #ffffff !important" small
              >mdi-arrow-left</v-icon
            >Back
          </v-btn>
          <v-btn
            v-show="goodie"
            type="submit"
            @click="mintGoodie"
            :loading="loading"
            :disabled="disable"
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
      </v-window-item>
    </v-window>
    <div class="text-center">
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <h3 class="mt-3">Minting in progress...</h3>
        <h3 ref="tminted">{{ show_total_minted }}</h3>
      </v-overlay>
      <v-overlay :value="overlay_building">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <h3 class="mt-3">Building event be pacient...</h3>
      </v-overlay>
      <v-overlay :value="overlay_ticket">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <h3 class="mt-3">Building ticket be pacient...</h3>
      </v-overlay>
    </div>
  </section>
</template>

<script>
import ModalSuccess from "./ModalSuccess";
import { VueEditor } from "vue2-editor";
import moment from "moment";
import { CONFIG } from "@/services/api";
import * as nearAPI from "near-api-js";
const { connect, keyStores, utils } = nearAPI;
import { Wallet, Chain, Network, MetadataField } from "mintbase";
import html2canvas from "html2canvas";
import gql from "graphql-tag";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

const nft_tokens_aggregate = gql`
  query MyQuery($store: String!, $tittle: String!, $_iregex: String!) {
    nft_metadata(
      where: {
        title: { _eq: $tittle }
        nft_contract_id: { _eq: $store }
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
      }
      order_by: { nft_contracts: { created_at: desc } }
    ) {
      id
    }
  }
`;
const mb_views_nft_tokens = gql`
  query MyQuery($_iregex: String!) {
    mb_views_nft_tokens_aggregate(
      where: {
        reference_blob: { _cast: { String: { _iregex: $_iregex } } }
        burned_receipt_id: { _is_null: true }
        last_transfer_timestamp: { _is_null: true }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
const tokens_id = gql`
  query MyQuery($metadata_id: String) {
    nft_tokens_aggregate(
      where: { nft_contract_id: {}, metadata_id: { _eq: $metadata_id } }
      order_by: { token_id: asc }
    ) {
      nodes {
        token_id
      }
    }
  }
`;
const ipfs = gql`
  query MyQuery($_iregex: String!) {
    ipfs(where: { thingid: $_iregex }) {
      tokenid
    }
  }
`;

const minted = gql`
  query MyQuery($metadata_id: String) {
    nft_tokens_aggregate(
      where: { nft_contract_id: {}, metadata_id: { _eq: $metadata_id } }
    ) {
      aggregate {
        count
      }
    }
  }
`;
const minter = gql`
  query MyQuery($store: String!, $user: String!) {
    mb_store_minters(
      where: { nft_contract_id: { _eq: $store }, minter_id: { _eq: $user } }
    ) {
      minter_id
    }
  }
`;

export default {
  name: "RegisterDashboard",
  components: {
    VueEditor,
    ModalSuccess,
    DatePicker,
  },
  data() {
    return {
      step:
        this.$session.get("step") === undefined ? 1 : this.$session.get("step"),
      dataTickets: {
        name:
          this.$session.get("dataFormName") === undefined
            ? ""
            : this.$session.get("dataFormName"),
        promoter:
          this.$session.get("dataFormPromoter") === undefined
            ? ""
            : this.$session.get("dataFormPromoter"),
        img: "",
        // this.$session.get("canvas") === undefined
        //   ? ""
        //   : this.$session.get("canvas"),
        img_main: this.url,
        // this.$session.get("canvas_main_image") === undefined
        //   ? undefined
        //   : this.$session.get("canvas_main_image"),
        description:
          this.$session.get("dataFormDescription") === undefined
            ? ""
            : this.$session.get("dataFormDescription"),
        mint_amount:
          this.$session.get("dataFormMintAmount") === undefined
            ? ""
            : this.$session.get("dataFormMintAmount"),
        attendees:
          this.$session.get("dataFormAttendees") === undefined
            ? ""
            : this.$session.get("dataFormAttendees"),
        goodies: "1", // localStorage.getItem("dataFormGoodies") === null  ? "" : localStorage.getItem("dataFormGoodies"),
      },
      url: "",
      // this.$session.get("canvas_main_image") === undefined
      //   ? undefined
      //   : this.$session.get("canvas_main_image"),
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
      place_id:
        this.$session.get("dataFormPlaceId") === undefined
          ? ""
          : this.$session.get("dataFormPlaceId"),
      latitude:
        this.$session.get("dataFormLatitud") === undefined
          ? ""
          : this.$session.get("dataFormLatitud"),
      longitude:
        this.$session.get("dataFormLongitud") === undefined
          ? ""
          : this.$session.get("dataFormLongitud"),
      location:
        this.$session.get("dataFormLocation") === undefined
          ? ""
          : this.$session.get("dataFormLocation"),
      address: "1234",
      amount_list:
        this.$session.get("amount_list") === undefined
          ? 0
          : this.$session.get("amount_list"),
      price:
        this.$session.get("price") === undefined
          ? 0
          : this.$session.get("price"),
      menu: "",
      time:
        this.$session.get("dataFormTime") === undefined
          ? ""
          : this.$session.get("dataFormTime"),
      menu2: false,
      dataTicket: [
        {
          url: "",
          img: undefined,
        },
        {
          url: "",
          img: undefined,
        },
        {
          url: "",
          img: undefined,
        },
      ],
      MenuDates: false,
      dates:
        this.$session.get("dataFormDate") === undefined
          ? undefined
          : this.$session.get("dataFormDate"),
      menuStartTime: false,
      startTime:
        this.$session.get("dataFormTimeStart") === undefined
          ? ""
          : new Date(this.$session.get("dataFormTimeStart")),
      menuEndTime: "",
      endTime:
        this.$session.get("dataFormTimeEnd") === undefined
          ? ""
          : new Date(this.$session.get("dataFormTimeEnd")),
      // dates: [
      //   {
      //     id: 1,
      //     menuStartDate: false,
      //     startDate: undefined,
      //     menuStartTime: false,
      //     startTime: undefined,

      //     menuEndDate: false,
      //     endDate: undefined,
      //     menuEndTime: false,
      //     endTime: undefined,
      //   },
      // ],
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
      available1: parseInt(100 - this.$owner_split),
      errorPercentaje: [],
      errorPercentaje1: [],
      counter: 0,
      counter1: 0,
      arr: [],
      arr1: [],
      disable: false,
      txs: [],
      usd: 0,
      canvas:
        this.$session.get("canvas") === undefined
          ? "@/assets/ticket-selection/ticket-custom-upload.svg"
          : "",
      canvas_burn:
        this.$session.get("canvas_burn") === undefined
          ? ""
          : this.$session.get("canvas_burn"),
      canvas_goodie:
        this.$session.get("canvas_goodie") === undefined
          ? ""
          : this.$session.get("canvas_goodie"),
      editorRules: false,
      timepickerStartRules: false,
      timepickerEndRules: false,
      comboboxRules: false,
      total_minted: parseInt(
        this.$session.get("total_minted") === undefined
          ? 0
          : this.$session.get("total_minted")
      ),
      nearid: false,
      burn_ticket_image:
        this.$pinata_gateway + "QmdW7LfjTfHWmpRadqk2o5oUUFutPuqUx2dZj3C4CH2Jjr",
      burn_goodie_image:
        this.$pinata_gateway + "QmQxY2cqZ5LZ6cfArVsdskrKfmPLZ3NdsZxbJWxbmeXURw",
      imagecanvas: this.$session.get("canvas") === undefined ? false : true,
      imagecanvas1: this.$session.get("canvas") === undefined ? true : false,
      imagegoodie:
        this.$session.get("canvas_goodie") === undefined ? false : true,
      imagegoodie1:
        this.$session.get("canvas_goodie") === undefined ? true : false,
      show_total_minted:
        this.$session.get("total_minted") === undefined
          ? "0"
          : this.$session.get("total_minted"),
      overlay: false,
      overlay_building: false,
      overlay_ticket: false,
      mint_amount:
        this.$session.get("mint_amount") === undefined
          ? 0
          : parseInt(this.$session.get("mint_amount")),
      open: false,
      i: null,
    };
  },
  watch: {
    step(newValue) {
      if (newValue === 1) this.listenerEditor();
      setTimeout(() => {
        this.addTicketClass();
      }, 100);
    },
    dates(curr) {
      this.validatorCombobox(curr);
    },
    $route(curr, old) {
      if (curr !== old) this.checkoutTicketType();
    },
  },
  beforeMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //
    if (
      urlParams.get("errorCode") === "userRejected" &&
      urlParams.get("signMeta") === "mint"
    ) {
      this.back();
    }
    if (
      urlParams.get("errorCode") === "userRejected" &&
      urlParams.get("signMeta") === "list"
    ) {
      this.back();
    }
    if (
      urlParams.get("errorCode") === "userRejected" &&
      urlParams.get("signMeta") === "goodies"
    ) {
      this.back();
    }
  },
  mounted() {
    this.checkoutTicketType();
    // this.hideScroll(this.$route)
    this.revisar();
    if (this.step === 1) {
      this.listenerEditor();
    }
    if (!this.$session.exists()) {
      this.$session.start();
    }
    this.grantMinter();
    let datos = JSON.parse(localStorage.getItem("Mintbase.js_wallet_auth_key"));
    const user = datos.accountId;
    this.getData();
    this.pollData();
    if (this.$session.get("dataFormName")) {
      this.getCanvas();
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    ///Mint option
    if (
      urlParams.get("transactionHashes") !== null &&
      urlParams.get("signMeta") === "mint"
    ) {
      this.$refs.modal.modalSuccess = true;
      this.$refs.modal.url = this.$explorer + "/accounts/" + user;
      this.step = 4;
      this.getData();
      this.$session.set("step", 4);
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/events/register:" + this.$session.get("ticketval")
      );
    }
    //List option
    if (
      urlParams.get("transactionHashes") !== null &&
      urlParams.get("signMeta") === "list"
    ) {
      this.$refs.modal.modalSuccess = true;
      this.$refs.modal.url = this.$explorer + "/accounts/" + user;
      this.step = 5;
      this.$session.set("step", this.step);
      this.$session.remove("canvas_burn");
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/events/register:" + this.$session.get("ticketval")
      );
    }
    //goodies option
    if (
      urlParams.get("transactionHashes") !== null &&
      urlParams.get("signMeta") === "goodies"
    ) {
      this.getMinted();
      this.polling = setInterval(() => {
        this.getMinted();
        //When the amount is equal close the overlay
        // this.overlay = !this.overlay;
        this.$forceUpdate();
      }, 5000);
      this.$session.remove("canvas_goodie");
      this.gotToEvents();
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/events/register:" + this.$session.get("ticketval")
      );
    }
    //
    if (urlParams.get("errorCode") === "userRejected") {
      this.$refs.modal.modalSuccess = false;
      history.replaceState(
        null,
        location.href.split("?")[0],
        "/#/events/register:" + this.$session.get("ticketval")
      );
    }
  },
  computed: {
    dateRangeText() {
      return this.dates?.join(" ~ ");
    },
    ticketType() {
      return this.$route.params.type?.split(":")[1];
    },
  },
  methods: {
    uploadImg(item) {
      if (item.img) {
        item.url = URL.createObjectURL(item.img);
      }
    },
    async ImagePreview(e) {
      if (e) {
        this.url = URL.createObjectURL(this.dataTickets.img_main);
        const file = e;
        const formData = new FormData();
        formData.append("uploaded_file", this.dataTickets.img_main);
        formData.append("name", this.dataTickets.name);
        //  console.log('formData', formData)
        //  console.log(this.$ipfs)
        await this.axios.post(this.$ipfs, formData).then((res) => {
          //console.log("res", res.data);
          this.$session.set("IpfsHash", res.data.IpfsHash);
        });
        setTimeout(() => {
          this.getBase64FromUrlMainImage(this.url);
        }, 1500);
        this.image = file;
        //console.log(e);
      }
    },
    onFileChange(file) {
      //console.log(file);
      if (!file) {
        return;
      }
      this.createImage(file);
    },
    async grantMinter() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      this.$apollo
        .query({
          query: minter,
          variables: {
            store: this.$store_mintbase,
            user: user,
          },
        })
        .then((response) => {
          //console.log(response.data.mb_store_minters.length)
          //If the user is not minter just give grant to him/her
          if (response.data.mb_store_minters.length == 0) {
            const url = this.$node_url + "/minter";
            let item = {
              account_id: user,
            };
            this.axios
              .post(url, item)
              .then(() => {
                console.log("Hash up");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    async mint() {
      if (this.$refs.form2.validate()) {
        this.$session.set("step", 4);
        this.loading = true;
        this.disable = true;
        let datos = JSON.parse(
          localStorage.getItem("Mintbase.js_wallet_auth_key")
        );
        const user = datos.accountId;
        //Api key an data
        let API_KEY = this.$dev_key.toString();
        let networkName = this.$networkName.toString();
        const { data: walletData } = await new Wallet().init({
          networkName: networkName,
          chain: Chain.near,
          apiKey: API_KEY,
        });
        const { wallet } = walletData;
        //Loading image
        try {
          this.getCanvas();
          var image = new Image();
          image.src = this.canvas;
          this.image = image;

          const file = this.dataURLtoFile(this.image, "mint.png");
          const { data: fileUploadResult, error: fileError } =
            await wallet.minter.uploadField(MetadataField.Media, file);
          // localStorage.setItem("file", file);
          if (fileError) {
            throw new Error(fileError);
          } else {
            console.log(fileUploadResult);
          }
        } catch (error) {
          console.error(error);
          // TODO: handle error
        }

        const random = (length = 8) => {
          this.$session.set(
            "tempid",
            Math.random().toString(16).substr(2, length)
          );
          return Math.random().toString(16).substr(2, length);
        };

        random(14);

        //Estra data location , dates, place id
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
            trait_type: "Promoter / Organizer name",
            value: this.dataTickets.promoter,
          },
          {
            trait_type: "Start Date",
            value: moment(this.dates[0]).unix(),
            display_type: "date",
          },
          {
            trait_type: "End Date",
            value: moment(this.dates[1]).unix(),
            display_type: "date",
          },
          {
            trait_type: this.$session.get("tempid"),
            value: "NFT",
          },
          {
            trait_type: "start_time",
            value: this.startTime,
          },
          {
            trait_type: "end_time",
            value: this.endTime,
          },
        ];
        let store = this.$store_mintbase;
        let category = "ticketing";

        //Metadata Object
        const metadata = {
          title: this.dataTickets.name,
          description: this.dataTickets.description,
          extra,
          store,
          type: "NEP171",
          category,
        };
        await wallet.minter.setMetadata(metadata, true);
        // console.log(metadata);

        this.$session.set("mint_tittle", this.dataTickets.name);
        //LocalStorage Metadata
        this.$session.set("metadata", JSON.stringify(metadata));

        //handle royalties
        const royalties = {};
        const multiplied = 10000;
        var counter = this.counter;
        const multiplier = multiplied / counter;
        //console.log(multiplier)
        this.dataRoyalties.forEach((element) => {
          royalties[element.account] = parseInt(
            element.percentage * multiplier
          );
        });

        //handle splits
        const splits = {};
        var counter1 = this.counter1;
        var royaltie_for_owner = 0;
        // console.log(counter1)
        // const multiplier1 = Math.round(multiplied1 / counter1);
        this.dataSplit.forEach((element) => {
          //Validate not to add your own
          splits[element.account] = parseInt(element.percentage * 100);
          //If the user adds royaltie to the owner needs to sum more
          if (element.account === this.$owner) {
            royaltie_for_owner = parseInt(element.percentage * 100);
          }
        });
        //Add split for owner
        if (user != this.$owner) {
          splits[this.$owner] = parseInt(
            parseInt(this.$owner_split) * 100 + royaltie_for_owner
          );
          counter1 = counter1 + parseInt(this.$owner_split);
        }
        //Add the rest for minter
        if (user === this.$owner && this.dataSplit.length === 0) {
          splits[user] = parseInt(10000);
        } else {
          splits[user] = parseInt(10000 - counter1 * 100);
        }
        //end split

        //LocalStora Mint amount
        this.$session.set(
          "mint_amount",
          parseInt(this.dataTickets.mint_amount)
        );
        this.$session.set(
          "total_minted",
          parseInt(this.dataTickets.mint_amount)
        );
        //Control goodies and let me in for approval
        this.$session.set(
          "control_mint_appoval",
          parseInt(this.dataTickets.mint_amount)
        );
        await wallet.mint(
          parseInt(this.dataTickets.mint_amount),
          store.toString(),
          JSON.stringify(royalties) === "{}" ? null : royalties,
          JSON.stringify(splits) === "{}" ? null : splits,
          category,
          {
            meta: "mint",
            royaltyPercentage: this.counter * 100,
          }
        );
      }
    },
    async mintGoodie() {
      if (this.$refs.form4.validate()) {
        this.getBase64FromUrlGoodie(this.burn_goodie_image);
        setTimeout(() => {
          this.mintGoodieProccess();
        }, 1500);
      }
    },
    async mintGoodieProccess() {
      if (this.$refs.form4.validate()) {
        // console.log(this.dataTickets.attendees);
        //this.nextLast();
        this.loading = true;
        this.disable = true;
        //Api key an data
        let API_KEY = this.$dev_key.toString();
        let networkName = this.$networkName.toString();
        const { data: walletData } = await new Wallet().init({
          networkName: networkName,
          chain: Chain.near,
          apiKey: API_KEY,
        });
        const { wallet } = walletData;
        //Loading image
        try {
          this.getBase64FromUrlGoodie(this.burn_goodie_image);
          var image = new Image();
          image.src = this.$session.get("canvas_goodie");
          //image.src = localStorage.getItem("canvas");
          this.image = image;

          const file = this.dataURLtoFile(this.image, "mint.png");
          const { data: fileUploadResult, error: fileError } =
            await wallet.minter.uploadField(MetadataField.Media, file);
          // localStorage.setItem("file", file);
          if (fileError) {
            throw new Error(fileError);
          } else {
            console.log(fileUploadResult);
          }
        } catch (error) {
          console.error(error);
          // TODO: handle error
        }

        //Extra data location , dates, place id
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
            trait_type: "Promoter / Organizer name",
            value: this.dataTickets.promoter,
          },
          {
            trait_type: "Start Date",
            value: moment(this.dates[0]).unix(),
            display_type: "date",
          },
          {
            trait_type: "End Date",
            value: moment(this.dates[1]).unix(),
            display_type: "date",
          },
          {
            trait_type:
              this.$session.get("metadata_id").split(":")[1] === undefined
                ? ""
                : this.$session.get("metadata_id").split(":")[1],
            value: this.dataTickets.attendees,
          },
          {
            trait_type: "start_time",
            value: this.startTime,
          },
          {
            trait_type: "end_time",
            value: this.endTime,
          },
        ];
        let store = this.$store_mintbase;
        let category = "redeemed";

        //Metadata Object
        const metadata = {
          title: this.dataTickets.attendees,
          description: this.dataTickets.attendees,
          extra,
          store,
          type: "NEP171",
          category,
        };
        await wallet.minter.setMetadata(metadata, true);
        // console.log(metadata);

        this.$session.set("dataFormAttendees", this.dataTickets.attendees);
        this.$session.set("dataFormGoodies", this.dataTickets.goodies);

        //handle royalties
        const royalties = {};

        //handle splits
        const splits = {};

        await wallet.mint(
          parseInt(1),
          store.toString(),
          JSON.stringify(royalties) === "{}" ? null : royalties,
          JSON.stringify(splits) === "{}" ? null : splits,
          category,
          {
            meta: "goodies",
          }
        );
        // this.$session.set('step', 6)
      }
    },
    /**
     * When the location found
     * @param {Object} addressData Data of the found location
     * @param {Object} placeResultData PlaceResult object
     * @param {String} id Input container ID
     */
    getAddressData: function (addressData, placeResultData, id) {
      this.address =
        this.$session.get("dataFormPlaceId") === undefined
          ? addressData
          : this.$session.get("dataFormPlaceId");
      this.place_id =
        this.$session.get("dataFormPlaceId") === undefined
          ? addressData.place_id
          : this.$session.get("dataFormPlaceId");
      this.location =
        this.$session.get("dataFormLocation") === undefined
          ? placeResultData.formatted_address
          : this.$session.get("dataFormLocation");
      this.latitude =
        this.$session.get("dataFormLatitud") === undefined
          ? addressData.latitude
          : this.$session.get("dataFormLatitud");
      this.longitude =
        this.$session.get("dataFormLatitud") === undefined
          ? addressData.longitude
          : this.$session.get("dataFormLatitud");
      this.$session.set("dataFormPlaceId", addressData.place_id);
      this.$session.set("dataFormLocation", placeResultData.formatted_address);
      this.$session.set("dataFormLatitude", addressData.latitude);
      this.$session.set("dataFormLongitude", addressData.longitude);
    },
    next() {
      if (
        this.$refs.form.validate() &&
        this.dataTickets.description &&
        this.dates
      ) {
        //this.loading = true;
        this.overlay_ticket = true;
        this.editorRules = false;
        this.comboboxRules = false;
        let datos = JSON.parse(
          localStorage.getItem("Mintbase.js_wallet_auth_key")
        );
        const user = datos.accountId;
        if (!this.$session.get("canvas")) {
          if(this.$session.get("ticketval") !== "custom"){
            var container = document.getElementById("my-node");
            const options = {
              backgroundColor: null,
              allowTaint: true,
              removeContainer: true,
              scale: 10,
              quality: 1 // Set the maximum quality
            };
            html2canvas(container, options).then((canvas) => {
              this.axios
                .post(this.$node_url + "/uploads", {
                  name: user + "-" + this.dataTickets.name,
                  data: canvas.toDataURL("image/png", 1),
                })
                .then((response) => {
                  //console.log(response.data);
                  this.timepickerStartRules = false;
                  this.timepickerEndRules = false;
                  //Store all form data
                  this.$session.set("dataFormName", this.dataTickets.name);
                  this.$session.set(
                    "dataFormPromoter",
                    this.dataTickets.promoter
                  );
                  this.$session.set(
                    "dataFormDescription",
                    this.dataTickets.description
                  );
                  this.$session.set("dataFormDate", this.dates);
                  this.$session.set("dataFormTimeStart", this.startTime);
                  this.$session.set("dataFormTimeEnd", this.endTime);
                  this.$session.set("canvas", true);
                  //this.canvas = response.data;
                  this.$session.set("step", 2);
                  this.step = this.$session.get("step");
                  //this.loading = false;
                  this.overlay_ticket = false;
                  this.getBase64FromUrl(this.burn_ticket_image)
                  canvas.remove();
                  container.parentNode.removeChild(container);
                  setTimeout(() => this.getCanvas(), 800);
                  //console.log(response.data);
                })
                .catch((error) => {
                  console.error(error);
                });
            });
          } else {
            // get the div element
            const getBase64StringFromDataURL = (dataURL) =>
              dataURL.replace("data:", "").replace(/^.+,/, "");

            const design = document.getElementById("my-node1");
              // Get the remote image as a Blob with the fetch API
              fetch(design.src)
                .then((res) => res.blob())
                .then((blob) => {
                  // Read the Blob as DataURL using the FileReader API
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    // console.log(reader.result);
                    // Logs data:image/jpeg;base64,wL2dvYWwgbW9yZ...

                    // Convert to Base64 string
                    const base64 = getBase64StringFromDataURL(reader.result);
                    //console.log(base64);
                    // Logs wL2dvYWwgbW9yZ...
                    this.axios
                      .post(this.$node_url + "/uploads", {
                        name: user + "-" + this.dataTickets.name,
                        data: base64,
                      })
                      .then((response) => {
                        console.log(response.data);
                          this.timepickerStartRules = false;
                            this.timepickerEndRules = false;
                            //Store all form data
                        this.$session.set("dataFormName", this.dataTickets.name);
                        this.$session.set(
                          "dataFormPromoter",
                          this.dataTickets.promoter
                        );
                        this.$session.set(
                          "dataFormDescription",
                          this.dataTickets.description
                        );
                        this.$session.set("dataFormDate", this.dates);
                        this.$session.set("dataFormTimeStart", this.startTime);
                        this.$session.set("dataFormTimeEnd", this.endTime);
                        this.$session.set("canvas", true);
                        //this.canvas = response.data;
                        this.$session.set("step", 2);
                        this.step = this.$session.get("step");
                        //this.loading = false;
                        this.overlay_ticket = false;
                        this.getBase64FromUrl(this.burn_ticket_image)
                        setTimeout(() => this.getCanvas(), 800); 
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  };
                  reader.readAsDataURL(blob);
                });
          }  
        } else {
          this.$session.set("step", 2);
          this.step = this.$session.get("step");
          this.loading = false;
        }
      }
      if (!this.dataTickets.description) this.editorRules = true;
      if (!this.dates || this.dates.length === 0) this.comboboxRules = true;
      if (!this.startTime) this.timepickerStartRules = true;
      if (!this.endTime) this.timepickerEndRules = true;
    },
    async getCanvas() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      await this.axios
        .post(this.$node_url + "/get-uploads", {
          name: user + "-" + this.$session.get("dataFormName"),
        })
        .then((response) => {
          this.canvas = response.data;
          //console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async delCanvas() {
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      await this.axios
        .post(this.$node_url + "/del-uploads", {
          name: user + "-" + this.$session.get("dataFormName"),
        })
        .then((response) => {
          //console.log(response.data);
          this.canvas = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async getBase64FromUrl(url) {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
          this.$session.set("canvas_burn", base64data);
          //this.canvas_burn = base64data;
        };
      });
    },
    async getBase64FromUrlGoodie(url) {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
          this.$session.set("canvas_goodie", base64data);
          //this.canvas_goodie = base64data;
        };
      });
    },
    async getBase64FromUrlMainImage(url) {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
          //this.$session.set("canvas_main_image", base64data);
          this.url = base64data;
          //console.log(base64data)
        };
      });
    },
    // nextLast() {
    //   if (this.$refs.form4.validate()) {
    //     var container = document.getElementById("my-node-goodie"); /* full page */
    //     html2canvas(container, {
    //       backgroundColor: null,
    //       //y: (container / 2, container / 2, 30),
    //       //height: 580,
    //     }).then((canvas) => {
    //       // let link = document.createElement("a");
    //       // link.download = "image_name.png";
    //       // link.href = canvas.toDataURL("image/png", 1.0);
    //       // document.body.appendChild(link);
    //       // link.click();

    //       // var image = new Image();
    //       // image.src = canvas.toDataURL("image/png", 1.0);
    //       // localStorage.setItem("canvas_goodie", canvas.toDataURL("image/png", 1.0));
    //       // this.image = image;
    //       this.getBase64FromUrlGoodie(this.burn_goodie_image)
    //       // console.log(this.image);
    //     });
    //   }
    // },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.src.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    async next1() {
      if (this.$refs.form1.validate()) {
        this.$session.set("step", 3);
        this.step = this.$session.get("step");
        this.ipfs();
        this.$session.set("dataFormMintAmount", this.dataTickets.mint_amount);
      }
    },
    next2() {
      if (this.$refs.form2.validate()) {
        this.$session.set("step", 4);
        this.step = this.$session.get("step");
      }
    },
    back() {
      this.step--;
      this.goodie = false;
      var step = this.$session.get("step") - 1;
      this.$session.set("step", step);
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
          this.disable = false;
        })
        .catch((error) => {
          this.disable = true;
          this.errorAccount[pos] = "Not valid NEAR Account";
          this.successAccount[pos] = null;
          this.disable = true;
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
          this.disable = false;
        })
        .catch((error) => {
          this.disable = true;
          this.errorAccount1[pos] = "Not valid NEAR Account";
          this.successAccount1[pos] = null;
          this.disable = true;
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
      if (
        Number.isInteger(parseInt(this.dataRoyalties[pos].percentage)) === false
      ) {
        this.disable = true;
        this.available = 0;
        this.errorPercentaje[pos] = "Only int";
      }
      if (parseInt(this.dataRoyalties[pos].percentage) < 0) {
        this.disable = true;
        this.available = 0;
        this.errorPercentaje[pos] = "Only int";
      }
    },
    chkPercentage1(val, e) {
      //get the position from target, declaring the input name and poisition split |
      var pos = parseInt(e.target.id.split("|")[1]);
      this.arr = [];
      let datos = JSON.parse(
        localStorage.getItem("Mintbase.js_wallet_auth_key")
      );
      const user = datos.accountId;
      for (const prop in this.dataSplit) {
        if (user != this.dataSplit[prop].account) {
          this.arr.push(parseInt(this.dataSplit[prop].percentage));
        }
      }
      this.counter1 = this.arr.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.available1 = parseInt(100 - this.$owner_split) - this.counter1;
      //console.log(this.counter1)
      if (this.counter1 > parseInt(100 - this.$owner_split)) {
        this.disable = true;
        this.available1 = 0;
        this.errorPercentaje1[pos] =
          "≤" + parseInt(97 - this.$owner_split) + "%";
      } else {
        this.disable = false;
        this.errorPercentaje1[pos] = null;
      }
      if (
        Number.isInteger(parseInt(this.dataSplit[pos].percentage)) === false
      ) {
        this.disable = true;
        this.available1 = 0;
        this.errorPercentaje1[pos] = "Only int";
      }
      if (parseInt(this.dataSplit[pos].percentage) < 0) {
        this.disable = true;
        this.available1 = 0;
        this.errorPercentaje1[pos] = "Only int";
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
      this.$session.get("splits", this.dataSplit);
      this.arr = [];
      for (const prop in this.dataRoyalties) {
        this.arr.push(parseInt(this.dataRoyalties[prop].percentage));
      }
      this.counter1 = this.arr.reduce(function (a, b) {
        return a + b;
      }, 0);
      this.available1 = parseInt(100 - this.$$owner_split) - this.counter1;
      this.successAccount1[pos] = null;
      this.errorAccount1[pos] = null;
      this.errorPercentaje1[pos] = null;
    },
    //Getting new minted thingid
    //The function getMetadataID is not working, if we call it the mint does not working
    //Need to ask mintbase team 13/0*/2023
    //Meanwhile getting las mint created filter by name
    async getData() {
      this.$apollo
        .mutate({
          mutation: nft_tokens_aggregate,
          variables: {
            store: this.$store_mintbase,
            tittle:
              this.$session.get("mint_tittle") === undefined
                ? ""
                : this.$session.get("mint_tittle"),
            _iregex:
              this.$session.get("tempid") === undefined
                ? ""
                : this.$session.get("tempid"),
          },
        })
        .then((response) => {
          //Map the objectvalue
          //  console.log(this.$store_mintbase.toString())
          //  console.log(localStorage.getItem("mint_tittle") === null ? "" : localStorage.getItem("mint_tittle"))
          //  console.log(localStorage.getItem("tempid") === null ? "" : localStorage.getItem("tempid"))
          //  console.log(response.data.nft_metadata.length)
          if (response.data.nft_metadata.length > 0) {
            //console.log('no pada')
            Object.entries(response.data).forEach(([key, value]) => {
              // inner object entries
              //console.log(value[0].id);
              //Set total minted
              this.$session.set("metadata_id", value[0].id);
              this.$apollo
                .mutate({
                  mutation: minted,
                  variables: {
                    metadata_id: value[0].id,
                  },
                })
                .then((response) => {
                  //console.log(response.data.nft_tokens_aggregate.aggregate.count);
                  this.$session.set(
                    "total_minted",
                    response.data.nft_tokens_aggregate.aggregate.count
                  );
                  this.show_total_minted = this.$session.get("total_minted");
                })
                .catch((err) => {
                  console.log("Error", err);
                });
            });
          }
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    async getMinted() {
      this.$apollo
        .mutate({
          mutation: mb_views_nft_tokens,
          variables: {
            _iregex:
              this.$session.get("metadata_id").split(":")[1] === undefined
                ? ""
                : this.$session.get("metadata_id").split(":")[1],
          },
        })
        .then((response) => {
          var counter =
            response.data.mb_views_nft_tokens_aggregate.aggregate.count;
          //console.log(counter)
          if (counter >= parseInt(this.$session.get("control_mint_appoval"))) {
            this.overlay_building = false;
          } else {
            this.overlay_building = true;
          }
        })
        .catch((err) => {
          console.log("Error", err);
        });
    },
    gotToEvents() {
      this.step = 1;
      this.$session.set("step", this.step);
      this.$router.push("/events");
      this.delCanvas();
      this.$session.clear();
    },
    //Get the tokens id minted
    async list() {
      if (this.$refs.form3.validate()) {
        //Upload ipfs
        this.$session.set("step", 5);
        this.getData();
        this.loading = true;
        this.disable = true;
        // this.completeIpfs();
        const mintbase_marketplace = this.$mintbase_marketplace;
        let store = this.$store_mintbase;
        let API_KEY = this.$dev_key.toString();
        let networkName = this.$networkName.toString();
        const { data: walletData } = await new Wallet().init({
          networkName: networkName,
          chain: Chain.near,
          apiKey: API_KEY,
        });
        const { wallet } = walletData;
        //Adding metadatada for the burned ticket
        //Loading image
        try {
          this.getBase64FromUrl(this.burn_ticket_image);
          var image = new Image();
          image.src = this.$session.get("canvas_burn");
          this.image = image;
          const file = this.dataURLtoFile(this.image, "mint.png");
          const { data: fileUploadResult, error: fileError } =
            await wallet.minter.uploadField(MetadataField.Media, file);
          // localStorage.setItem("file", file);
          if (fileError) {
            throw new Error(fileError);
          } else {
            console.log(fileUploadResult);
          }
        } catch (error) {
          console.error(error);
          // TODO: handle error
        }

        //Complete IPFS, adding to the smart contract the data to match the ipfs image of the store
        // this.$apollo
        //   .query({
        //     query: ipfs,
        //     variables: {
        //       _iregex: localStorage.getItem("metadata_id").toString(),
        //     },
        //     client: "mintickClient",
        //   })
        //   .then((res) => {
        //     //if data is available add ipfs data
        //     //console.log(res.data.ipfs.length);
        //     const url = this.$node_url + "/ipfs";
        //       //console.log(url);
        //       let item = {
        //         thingid: localStorage.getItem("metadata_id").toString(),
        //         tokenid: localStorage.getItem("IpfsHash"),
        //       };
        //       //console.log(item)
        //       this.axios
        //         .post(url, item)
        //         .then(() => {
        //           console.log("Hash up");
        //         })
        //         .catch((error) => {
        //           console.log(error);
        //         });
        //   })
        //   .catch((err) => {
        //     console.log("Error", err);
        //   });

        //Metadata Object
        const metadata = JSON.parse(this.$session.get("metadata"));
        metadata.extra.push({
          trait_type:
            this.$session.get("metadata_id").split(":")[1] === undefined
              ? ""
              : this.$session.get("metadata_id").split(":")[1],
          value: "BurnTicket",
        });
        await wallet.minter.setMetadata(metadata, true);

        const { data: metadataId, error } = await wallet.minter.getMetadataId();
        this.$session.set("metadata_reference", metadataId);
        //console.log("metadata_reference", metadataId);
        this.$apollo
          .query({
            query: tokens_id,
            variables: {
              metadata_id: this.$session.get("metadata_id").toString(),
            },
          })
          .then((response) => {
            //
            //Firts call storage deposit
            this.txs.push({
              receiverId: mintbase_marketplace,
              functionCalls: [
                {
                  methodName: "deposit_storage",
                  receiverId: mintbase_marketplace,
                  gas: "200000000000000",
                  args: {},
                  deposit: utils.format.parseNearAmount(
                    (0.0108 * this.amount_list).toString()
                  ),
                },
              ],
            });
            //Map the objectvalue
            Object.entries(response.data).forEach(([key, value]) => {
              // inner object entries
              for (let i = 0; i < value.nodes.length; i++) {
                if (i < this.amount_list) {
                  this.txs.push({
                    receiverId: store,
                    functionCalls: [
                      {
                        methodName: "nft_approve",
                        receiverId: store,
                        gas: "200000000000000",
                        args: {
                          token_id: value.nodes[i].token_id.toString(),
                          account_id: mintbase_marketplace,
                          msg: JSON.stringify({
                            price: this.nearToYocto(this.price),
                            autotransfer: true,
                          }),
                        },
                        deposit: utils.format.parseNearAmount(
                          (0.0008).toString()
                        ),
                      },
                    ],
                  });
                }
              }
              //console.log(this.txs)
            });

            let datos = JSON.parse(
              localStorage.getItem("Mintbase.js_wallet_auth_key")
            );
            const user = datos.accountId;
            const owners = {};
            owners[datos.accountId] = 9000;
            owners[this.$value_user_mint] = 1000;

            // This is the let me in
            this.txs.push({
              receiverId: store,
              functionCalls: [
                {
                  methodName: "nft_batch_mint",
                  receiverId: store,
                  gas: "200000000000000",
                  args: {
                    owner_id: user,
                    metadata: {
                      reference: metadataId, //this.$session.get("metadata_reference"),
                      extra: "Ticketing",
                    },
                    num_to_mint: parseInt(1),
                    royalty_args: null,
                    split_owners: owners,
                  },
                  deposit: "1", //utils.format.parseNearAmount((0.01).toString()),
                },
              ],
            });
          })
          .catch((err) => {
            console.log("Error", err);
          });
        this.executeMultipleTransactions();
      }
    },
    async executeMultipleTransactions() {
      //Gettintg the tokens ID
      //this.getTokensId();
      //Adding metadata for the burn ticket
      this.completeIpfs();
      let API_KEY = this.$dev_key.toString();
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet } = walletData;

      await wallet.executeMultipleTransactions({
        transactions: this.txs,
        options: {
          meta: "list",
        },
      });
    },
    async completeIpfs() {
      //this.ipfs();
      if (
        this.$session.get("metadata_id") != undefined &&
        this.$session.get("IpfsHash") != undefined
      ) {
        this.$apollo
          .query({
            query: ipfs,
            variables: {
              _iregex: this.$session.get("metadata_id"),
            },
            client: "mintickClient",
          })
          .then((res) => {
            //if data is available add ipfs data
            //console.log(res.data.ipfs.length);
            const url = this.$node_url + "/ipfs";
            if (res.data.ipfs.length === 0) {
              //console.log(url);
              let item = {
                thingid: this.$session.get("metadata_id"),
                tokenid: this.$session.get("IpfsHash"),
              };
              //console.log(item)
              this.axios
                .post(url, item)
                .then(() => {
                  console.log("Hash up");
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((err) => {
            console.log("Error", err);
          });
      }
    },
    nearToYocto: function (nearToYocto) {
      const amountInYocto = utils.format.parseNearAmount(nearToYocto);
      // console.log(amountInYocto);
      return amountInYocto.toString();
    },
    priceNEAR() {
      const BINANCE_NEAR = this.$binance;
      var request = new XMLHttpRequest();
      request.open("GET", BINANCE_NEAR);
      request.send();
      this.price < 0 ? (this.price = 0) : this.price;
      request.onload = () => {
        this.usd = (
          parseFloat(JSON.parse(request.responseText).lastPrice) * this.price
        ).toFixed(4);
      };
      this.$session.set("price", this.price);
    },
    async ipfs() {
      const formData = new FormData();
      formData.append("uploaded_file", this.dataTickets.img_main);
      formData.append("name", this.dataTickets.name);
      //console.log('formData', formData)
      //console.log(this.$ipfs)
      await this.axios.post(this.$ipfs, formData).then((res) => {
        //console.log('res', res.data)
        this.$session.set("IpfsHash", res.data.IpfsHash);
      });
    },
    async completeIpfs() {
      //this.ipfs();
      if (
        this.$session.get("metadata_id") != undefined &&
        this.$session.get("IpfsHash") != undefined
      ) {
        this.$apollo
          .query({
            query: ipfs,
            variables: {
              _iregex: this.$session.get("metadata_id"),
            },
            client: "mintickClient",
          })
          .then((res) => {
            //if data is available add ipfs data
            //console.log(res.data.ipfs.length);
            const url = this.$node_url + "/ipfs";
            if (res.data.ipfs.length === 0) {
              //console.log(url);
              let item = {
                thingid: this.$session.get("metadata_id"),
                tokenid: this.$session.get("IpfsHash"),
              };
              //console.log(item)
              this.axios
                .post(url, item)
                .then(() => {
                  console.log("Hash up");
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((err) => {
            console.log("Error", err);
          });
      }
    },
    pollData() {
      this.polling = setInterval(() => {
        //check until mintin is done
        //Fecth until the total minted is ok
        //console.log(this.show_total_minted, this.mint_amount)
        if (parseInt(this.show_total_minted) < parseInt(this.mint_amount)) {
          this.overlay = true;
          //setTimeout(this.getData(), 10000);
          //  console.log(this.show_total_minted, this.mint_amount)
          //  console.log('polling', this.show_total_minted);
          this.getData();
        } else {
          this.overlay = false;
        }
        //When the amount is equal close the overlay
        // this.overlay = !this.overlay;
        this.$forceUpdate();
      }, 5000);
    },
    listenerEditor() {
      setTimeout(() => {
        const editor = document.querySelector(".editor .ql-editor");
        editor?.addEventListener("keyup", () =>
          this.validator(this.dataTickets.description)
        );
      }, 400);
    },
    validator(model) {
      if (model) return (this.editorRules = false);
      this.editorRules = true;
    },
    validatorCombobox(model) {
      if (model && model.length > 0) return (this.comboboxRules = false);
      this.comboboxRules = true;
    },
    validatorStartTime(model) {
      if (model) return (this.timepickerStartRules = false);
      this.timepickerStartRules = true;
    },
    validatorEndTime(model) {
      if (model) return (this.timepickerEndRules = false);
      this.timepickerEndRules = true;
    },
    checkMintAmount() {
      parseInt(this.dataTickets.mint_amount) > 20
        ? (this.dataTickets.mint_amount = 20)
        : (this.dataTickets.mint_amount = this.dataTickets.mint_amount);
      parseInt(this.dataTickets.mint_amount) < 0
        ? (this.dataTickets.mint_amount = 0)
        : (this.dataTickets.mint_amount = this.dataTickets.mint_amount);
    },
    checkListAmount() {
      //this.getData();
      var total_minted = parseInt(this.$session.get("total_minted"));
      parseInt(this.amount_list) > total_minted
        ? (this.amount_list = total_minted)
        : (this.amount_list = this.amount_list);
      parseInt(this.amount_list) < 0
        ? (this.amount_list = 0)
        : (this.amount_list = this.amount_list);
      this.$session.set("amount_list", this.amount_list);
    },
    checkGoodiesAmount() {
      var total_minted = parseInt(this.$session.get("total_minted"));
      parseInt(this.dataTickets.goodies) > total_minted
        ? (this.dataTickets.goodies = total_minted)
        : (this.dataTickets.goodies = this.dataTickets.goodies);
    },
    async revisar() {
      let API_KEY = this.$dev_key;
      let networkName = this.$networkName.toString();
      const { data: walletData } = await new Wallet().init({
        networkName: networkName,
        chain: Chain.near,
        apiKey: API_KEY,
      });
      const { wallet, isConnected } = walletData;
      //console.info(isConnected)
      if (!isConnected) {
        //console.info("user")
        if (this.nearid === false) {
          wallet.connect({ requestSignIn: true }).then;
          this.nearid = true;
          const { data: details } = await wallet.details();
          this.user = details.accountId;
        } else if (this.nearid === true) {
          wallet.disconnect();
          localStorage.clear();
          this.$router.go();
          this.nearid = false;
          this.user = "Login with NEAR";
        }
      }
      if (localStorage.getItem("Mintbase.js_wallet_auth_key") !== null) {
        this.nearid = true;
        let datos = JSON.parse(
          localStorage.getItem("Mintbase.js_wallet_auth_key")
        );
        this.user = datos.accountId;
      }
    },
    onlyNumberKey(evt) {
      // Only ASCII character in that range allowed
      var ASCIICode = evt.which ? evt.which : evt.keyCode;
      if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
      return true;
    },
    loadAgain() {
      this.imagecanvas = false;
      this.imagecanvas1 = true;
      this.$session.remove("canvas");
      this.$forceUpdate();
    },
    showModal() {
      this.step = 1;
      this.$session.set("step", this.step);
      this.$router.push("/events");
      this.delCanvas();
      this.$session.clear();
    },
    design() {
      this.$router.push("/events/select-ticket");
    },
    async add() {
      this.amount_list++;
      //this.getData();
      var total_minted = parseInt(this.$session.get("total_minted"));
      parseInt(this.amount_list) > total_minted
        ? (this.amount_list = total_minted)
        : (this.amount_list = this.amount_list);
    },
    async substract() {
      this.amount_list--;
      //this.getData();
      var total_minted = parseInt(this.$session.get("total_minted"));
      parseInt(this.amount_list) > total_minted
        ? (this.amount_list = total_minted)
        : (this.amount_list = this.amount_list);
    },
    // hideScroll(curr) {
    //   if (curr.path === "/events/register" && window.innerHeight >= 950) {
    //     document.body.style.overflow = "hidden"
    //   } else {
    //     document.body.style.overflow = "visible"
    //   }
    // },
    checkoutTicketType() {
      if (!this.ticketType) return this.$router.push("/events/select-ticket");

      if (
        this.ticketType === "con" ||
        this.ticketType === "cinema" ||
        this.ticketType === "custom"
      ) {
        this.dataTicket.shift();
        this.dataTicket.shift();
        this.addTicketClass();
      }
    },
    addTicketClass() {
      const tickets = document.querySelectorAll(".ticket-wrapper");
      tickets.forEach((e) => e.classList.add(this.ticketType));
    },
  },
};
</script>

<style src="../pages.scss" lang="scss" />
