<template>
  <div>
    <perfect-scrollbar style="height:100vh" ref="scroll">
      <router-view style="isolation:isolate" />
    </perfect-scrollbar>
  </div>
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
