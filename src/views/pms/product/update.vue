<template> 
  <product-detail :is-edit='true'></product-detail>
</template>
<script>
  import ProductDetail from './components/ProductDetail'
  export default {
    name: 'updateProduct',
    components: { ProductDetail }
  }
</script>
<style>
</style>
