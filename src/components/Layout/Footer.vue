<template>
  <v-footer color="#0A0A0A" absolute>
    <v-row class="astart jcenter fill-h">
      <div class="footer-div"><img src="@/assets/landing/logo_mintick.png" loading="lazy" alt="Mintickt" class="footer-logo">
        <span class="text-block"> is cooking up a recipe at </span>
        <a href="https://near.org" target="_blank" class="w-inline-block"><img src="@/assets/landing/near_logo_wht.png" loading="lazy" width="347" alt="" class="footer-logo"></a>
        <span class="text-block marginright">,</span>
      </div>
      <div class="footer-div mintbase">
        <span class="text-block"> with a lot of</span>
        <a href="https://mintbase.io" target="_blank" class="w-inline-block"><img src="@/assets/landing/Mintbase_logo.png" loading="lazy" width="347" alt="" class="footer-logo"></a>
      </div>
      <div class="footer-div astro">
        <span class="text-block">a touch of </span>
        <a href="https://cron.cat" target="_blank" class="w-inline-block"><img src="@/assets/landing/cron_logo_light.png" loading="lazy" sizes="(max-width: 479px) 80px, 101px" srcset="@/assets/landing/cron_logo_light-p-500.png 500w, @/assets/landing/cron_logo_light.png 872w" alt="" class="footer-logo"></a>
        <span class="text-block">in every sip and</span>
      </div>
      <div class="footer-div astro">
        <span class="text-block">all the flavor of</span>
        <a href="https://astrodao.com" target="_blank" class="w-inline-block"><img src="@/assets/landing/astro.png" loading="lazy" width="101" alt="" class="footer-logo"></a>
      </div>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style src="./layout.scss" lang="scss" />
