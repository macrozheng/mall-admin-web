<template> 
  <brand-detail :is-edit='true'></brand-detail>
</template>
<script>
  import brandDetail from './components/brandDetail'
  export default {
    name: 'updateBrand',
    components: { brandDetail }
  }
</script>
<style>
</style>


