<template>
  <product-attr-detail :is-edit='false'></product-attr-detail>
</template>

<script>
  import ProductAttrDetail from './components/ProductAttrDetail'
  export default {
    name: 'addProductAttr',
    components: { ProductAttrDetail }
  }
</script>

<style scoped>

</style>
