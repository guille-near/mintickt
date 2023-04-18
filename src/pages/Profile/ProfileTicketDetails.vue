<template>
  <div id="profile" class="details">
    <section id="profile-header">
      <div class="container-avatar">
        <img src="@/assets/profile/user.svg" alt="user img">
      </div>
    </section>

    <section id="profile-content" class="center">
      <div class="container-title">
        <v-btn icon @click="$router.go(-1)">
          <v-icon color="#fff">mdi-arrow-left</v-icon>
        </v-btn>
        <h2 class="title-tabs p">My Tickets / {{"Nearcon"}}</h2>
      </div>

      <article>
        <div class="container-ticket">
          <img src="@/assets/profile/ticket-test.svg" alt="tikcet test">

          <div class="divcol center">
            <span>Terminator (Let me in)</span>
            <span>Burn this NFT so event staff let you in at the venue.</span>
          </div>
        </div>



        <div class="container-btn">
          <v-btn class="btn-bordered">
            <img src="@/assets/profile/transfer.svg" alt="transfer" width="15px" height="15px">
            <span>Transfer</span>
          </v-btn>
          <v-btn class="btn-bordered">
            <img src="@/assets/profile/burn.svg" alt="burn" width="15px" height="15px">
            <span>Burn</span>
          </v-btn>
          <v-btn class="btn-filled">
            <img src="@/assets/profile/discord.svg" alt="discord" width="15px" height="15px">
            <span>Unlock your invitation</span>
          </v-btn>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: "ProfileTicketDetails",
  data() {
    return {
    }
  }
}
</script>

<style src="./Profile.scss" lang="scss" />
