<template>
  <perfect-scrollbar style="height:100vh; z-index:99" ref="scroll">
    <router-view style="isolation:isolate" />
  </perfect-scrollbar>
</template>

<script>
  export default {
    name: 'App',
    watch: {
      $route() {
        this.$refs.scroll.$el.scrollTop = 0;
      }
    }
  };
</script>

<style src="./styles/app.scss" lang="scss"/>
