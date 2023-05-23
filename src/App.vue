<template>

  <router-view  />
 
</template>

<script>

  export default {
    name: 'App',
    data() {
    return {
    };
  },
    mounted() {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      console.log("HOLA")
      const [accessToken] = [fragment.get('access_token'), fragment.get('token_type')];

      if (accessToken) {
        const item = {
          access_token: fragment.get('access_token'),
          token_type: fragment.get('token_type')
        }
        localStorage.setItem('discord_sinc', JSON.stringify(item))
        this.$router.push("/profile")
      }
    },
    methods: {
      
    }
  };
</script>

<style src="./styles/app.scss" lang="scss"/>
