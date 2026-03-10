<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { getProductCategoryListAPI, productCategoryCreateAPI, productCategoryUpdateByIdAPI, getProductCategoryByIdAPI } from '@/apis/productCate'
import { productAttributeCategoryListWithAttrAPI } from '@/apis/productAttrCate'
import { getProductAttrInfoByCateIdAPI } from '@/apis/productAttr'
import SingleUpload from '@/components/Upload/singleUpload.vue'
import type { PmsProductCategory } from '@/types/productCate'
import type { ElCascaderDataVo } from '@/types/common'

// 获取路由对象
const router = useRouter()
const route = useRoute()

// 定义属性
const props = defineProps({
  // 是否为编辑模式
  isEdit: {
    type: Boolean,
    default: false
  }
})

// 默认商品分类
const defaultProductCate: PmsProductCategory = {
  description: '',
  icon: '',
  keywords: '',
  name: '',
  navStatus: 0,
  parentId: 0,
  productUnit: '',
  showStatus: 0,
  sort: 0
}
// 定义分类id（编辑使用）
const cateId = computed(() => Number(route.query.id))
// 当前操作的商品分类
const productCate = ref<PmsProductCategory>(Object.assign({}, defaultProductCate))
// 可选上级分类
const selectProductCateList = ref<PmsProductCategory[]>([])
// 商品属性ID及属性分类ID集合（筛选属性）
const filterProductAttrList = ref<{ key: number, value: number[] }[]>([{ key: 0, value: [] }])
// 筛选属性级联选择器中的数据
const filterAttrs = ref<ElCascaderDataVo[]>([])
// 获取可选上级分类列表
const getSelectProductCateList = async () => {
  const res = await getProductCategoryListAPI(0, { pageSize: 100, pageNum: 1 })
  selectProductCateList.value = res.data.list
  const noTopProductCate = Object.assign({}, defaultProductCate)
  noTopProductCate.id = 0
  noTopProductCate.name = '无上级分类'
  selectProductCateList.value.unshift(noTopProductCate)
}
// 获取商品属性分类列表
const getProductAttrCateList = async () => {
  const res = await productAttributeCategoryListWithAttrAPI()
  const list = res.data
  filterAttrs.value = list.map(item => ({
    label: item.name,
    value: item.id!,
    children: item.productAttributeList?.map(it => ({ label: it.name, value: it.id! }))
  }))
}

// 组件挂载后执行
onMounted(async () => {
  if (props.isEdit) {
    const res = await getProductCategoryByIdAPI(cateId.value)
    productCate.value = res.data
    const attrRes = await getProductAttrInfoByCateIdAPI(cateId.value)
    filterProductAttrList.value = attrRes.data.map((item, index) => ({
      key: Date.now() + index,
      value: [item.attributeCategoryId, item.attributeId]
    }))
  } else {
    productCate.value = Object.assign({}, defaultProductCate)
  }
  getSelectProductCateList()
  getProductAttrCateList()
})

// 商品分类表单引用
const productCateFrom = ref<FormInstance>()
// 商品分类表单校验规则
const rules = reactive<FormRules<PmsProductCategory>>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ]
})

// 获取选中的筛选商品属性ID
const getProductAttributeIdList = () => {
  return filterProductAttrList.value.filter(item => item.value && item.value.length === 2)
    .map(item => item.value[1]!)
}

// 提交表单
const onSubmit = async () => {
  if (!productCateFrom.value) return
  const valid = await productCateFrom.value.validate().catch(() => false)
  if (valid) {
    await ElMessageBox.confirm('是否提交数据', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (props.isEdit) {
      productCate.value.productAttributeIdList = getProductAttributeIdList()
      await productCategoryUpdateByIdAPI(cateId.value, productCate.value)
      ElMessage({
        message: '修改成功',
        type: 'success',
        duration: 1000
      })
      router.back()
    } else {
      productCate.value.productAttributeIdList = getProductAttributeIdList()
      await productCategoryCreateAPI(productCate.value)
      productCateFrom.value.resetFields()
      resetForm()
      ElMessage({
        message: '提交成功',
        type: 'success',
        duration: 1000
      })
    }
  } else {
    ElMessage({
      message: '验证失败',
      type: 'error',
      duration: 1000
    })
  }
}

// 重置表单
const resetForm = () => {
  if (productCateFrom.value) {
    productCateFrom.value.resetFields()
    productCate.value = Object.assign({}, defaultProductCate)
    getSelectProductCateList()
    filterProductAttrList.value = [{ key: 0, value: [] }]
  }
}

// 删除筛选属性
const removeFilterAttr = (filterProductAttr: { key: number, value: number[] }) => {
  if (filterProductAttrList.value.length === 1) {
    ElMessage({
      message: '至少要留一个',
      type: 'warning',
      duration: 1000
    })
    return
  }
  const index = filterProductAttrList.value.indexOf(filterProductAttr)
  if (index !== -1) {
    filterProductAttrList.value.splice(index, 1)
  }
}

// 添加筛选属性
const handleAddFilterAttr = () => {
  if (filterProductAttrList.value.length === 3) {
    ElMessage({
      message: '最多添加三个',
      type: 'warning',
      duration: 1000
    })
    return
  }
  filterProductAttrList.value.push({
    value: [],
    key: Date.now()
  })
}

// 过滤器
const filterLabelFilter = (index: number) => {
  if (index === 0) {
    return '筛选属性：'
  } else {
    return ''
  }
}
</script>

<template>
  <el-card class="form-container" shadow="never">
    <el-form ref="productCateFrom" :model="productCate" :rules="rules" label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="productCate.parentId" placeholder="请选择分类">
          <el-option v-for="item in selectProductCateList" :key="item.id" :label="item.name" :value="item.id!">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量单位：">
        <el-input v-model="productCate.productUnit"></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="productCate.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="productCate.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示在导航栏：">
        <el-radio-group v-model="productCate.navStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类图标：">
        <single-upload v-model="productCate.icon"></single-upload>
      </el-form-item>
      <el-form-item v-for="(filterProductAttr, index) in filterProductAttrList" :label="filterLabelFilter(index)"
        :key="filterProductAttr.key">
        <el-cascader clearable v-model="filterProductAttr.value" :options="filterAttrs">
        </el-cascader>
        <el-button style="margin-left: 20px" @click.prevent="removeFilterAttr(filterProductAttr)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddFilterAttr()">新增</el-button>
      </el-form-item>
      <el-form-item label="关键词：">
        <el-input v-model="productCate.keywords"></el-input>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input type="textarea" :autosize="true" v-model="productCate.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">提交</el-button>
        <el-button v-if="!props.isEdit" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped></style>
