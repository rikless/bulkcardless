<template>
  <div class="container mx-auto">
    <div class="mx-auto px-4 box-content w-3/12 p-4">
      <img id="logo" src="~@/assets/logo-001.png" alt="electron-vue">
    </div>
    <div class="px-4 box-content w-12/12 p-4">
      <gocard-less ref="gocard"></gocard-less>
    </div>
  </div>
</template>

<script>
  import GocardLess from './GocardLess'

  export default {
    name: 'landing-page',
    components: { GocardLess },
    methods: {
      async chooseFile () {
        await this.$refs.gocard.selectFilePlease()
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }


</style>
