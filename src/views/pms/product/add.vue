<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps>
    <add-product-info v-show="showStatus[0]" v-model="productParam"></add-product-info>
    <add-product-sale v-show="showStatus[1]" v-model="productParam"></add-product-sale>
    <add-product-attr v-show="showStatus[2]" v-model="productParam"></add-product-attr>
    <add-product-relation v-show="showStatus[3]"></add-product-relation>
    <div style="display: block;text-align: center;margin-top: 50px">
      <el-button-group>
        <el-button icon="el-icon-arrow-left" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
    </div>
  </el-card>
</template>
<script>
  import AddProductInfo from './components/addProductInfo';
  import AddProductSale from './components/addProductSale';
  import AddProductAttr from './components/addProductAttr';
  import AddProductRelation from './components/addProductRelation';

  const defaultProductParam = {
    albumPics: '',
    brandId: null,
    brandName: '',
    deleteStatus: 0,
    description: '',
    detailDesc: '',
    detailHtml: '',
    detailMobileHtml: '',
    detailTitle: '',
    feightTemplateId: 0,
    flashPromotionCount: 0,
    flashPromotionId: 0,
    flashPromotionPrice: 0,
    flashPromotionSort: 0,
    giftPoint: 0,
    giftGrowth: 0,
    keywords: '',
    lowStock: 0,
    name: '',
    newStatus: 0,
    note: '',
    originalPrice: 0,
    pic: '',
    //促销价格相关
    memberPriceList: [
      {
        memberLevelId: 0,
        memberPrice: 0,
        memberLevelName:null
      }
    ],
    productFullReductionList: [
      {
        fullPrice: 0,
        reducePrice: 0
      }
    ],
    productLadderList: [
      {
        count: 0,
        discount: 0,
        price: 0
      }
    ],
    previewStatus: 0,
    price: 0,
    productAttributeCategoryId: null,
    //商品属性相关
    productAttributeValueList: [
      {
        productAttributeId: 0,
        value: ''
      }
    ],
    skuStockList: [
      {
        lowStock: 0,
        pic: '',
        price: 0,
        sale: 0,
        skuCode: '',
        sp1: '',
        sp2: '',
        sp3: '',
        stock: 0
      }
    ],
    //商品关联信息
    subjectProductRelationList: [
      {
        subjectId: 0
      }
    ],
    prefrenceAreaProductRelationList: [
      {
        prefrenceAreaId: 0,
      }
    ],
    productCategoryId: null,
    productCategoryName: '',
    productSn: '',
    promotionEndTime: '',
    promotionPerLimit: 0,
    promotionPrice: null,
    promotionStartTime: '',
    promotionType: 0,
    publishStatus: 0,
    recommandStatus: 0,
    sale: 0,
    serviceIds: '',
    sort: 0,
    stock: 0,
    subTitle: '',
    unit: '',
    usePointLimit: 0,
    verifyStatus: 0,
    weight: 0
  };
  export default {
    name: 'addProduct',
    components: {AddProductInfo, AddProductSale, AddProductAttr, AddProductRelation},
    data() {
      return {
        active: 0,
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false, false]
      }
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prev() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      next() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      }
    }
  }
</script>
<style>
  .form-container {
    width: 860px;
  }
</style>


