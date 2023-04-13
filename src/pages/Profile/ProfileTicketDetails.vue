<template>
  <div id="profile" class="details">
    <section id="profile-header">
      <img src="@/assets/profile/user.svg" alt="user img">
    </section>

    <section id="profile-content" class="center">
      <article>
        <div class="container-ticket">
          <img src="@/assets/profile/ticket-test.svg" alt="tikcet test">

          <div class="divcol center">
            <span>Terminator (Let me in)</span>
            <span>Burn this NFT so event staff let you in at the venue.</span>
          </div>
        </div>



        <div class="divcol" style="gap: 10px">
          <v-btn class="btn-bordered vermobile">
            <img src="@/assets/profile/discord.svg" alt="discord" width="15px">
            <span>Unlock your invitation</span>
          </v-btn>
          <v-btn class="btn-bordered" @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
            <span>Back</span>
          </v-btn>
          <v-btn class="btn-filled">Burn it</v-btn>
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
