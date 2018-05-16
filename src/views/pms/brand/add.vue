<template> 
  <brand-detail :is-edit='false'></brand-detail>
</template>
<script>
  import brandDetail from './components/brandDetail'
  export default {
    name: 'addBrand',
    components: { brandDetail }
  }
</script>
<style>
</style>


