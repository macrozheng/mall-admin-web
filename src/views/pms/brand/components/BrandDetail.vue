<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { createBrandAPI, getBrandAPI, updateBrandAPI } from '@/apis/brand'
import SingleUpload from '@/components/Upload/singleUpload.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { PmsBrand } from '@/types/brand'

// 获取路由对象
const route = useRoute()
const router = useRouter()

// 定义属性
const props = defineProps({
  // 是否为编辑模式
  isEdit: {
    type: Boolean,
    default: false
  }
})

// 定义品牌id
const brandId = computed(() => Number(route.query.id))

// 默认品牌，添加时使用
const defaultBrand: PmsBrand = {
  bigPic: '',
  brandStory: '',
  factoryStatus: 0,
  firstLetter: '',
  logo: '',
  name: '',
  showStatus: 0,
  sort: 0
}
// 定义品牌对象
const brand = ref<PmsBrand>(Object.assign({}, defaultBrand))
// 品牌表单组件引用
const brandFromRef = ref<FormInstance>()
// 品牌表单校验规则
const rules = reactive<FormRules<typeof brand>>({
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ],
  logo: [
    { required: true, message: '请输入品牌logo', trigger: 'blur' }
  ],
  sort: [
    { type: 'number', message: '排序必须为数字' }
  ],
})

// 组件挂载时加载数据
onMounted(async () => {
  if (props.isEdit) {
    // 编辑模式调用接口获取品牌详情
    const res = await getBrandAPI(brandId.value)
    brand.value = res.data
  } else {
    // 添加模式使用默认品牌
    brand.value = Object.assign({}, defaultBrand)
  }
})

// 处理品牌表单提交
const handleBrandSubmit = () => {
  brandFromRef.value!.validate(async (valid) => {
    if (valid) {
      await ElMessageBox.confirm('是否提交数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (props.isEdit) {
        await updateBrandAPI(brandId.value, brand.value)
        brandFromRef.value!.resetFields()
        ElMessage({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
        router.back()
      } else {
        await createBrandAPI(brand.value)
        brandFromRef.value!.resetFields()
        brand.value = Object.assign({}, defaultBrand)
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
  })
}

// 处理品牌表单重置
const handleBrandReset = () => {
  brandFromRef.value!.resetFields()
  brand.value = Object.assign({}, defaultBrand)
}
</script>

<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" ref="brandFromRef" label-width="150px">
      <el-form-item label="品牌名称：" prop="name">
        <el-input v-model="brand.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母：">
        <el-input v-model="brand.firstLetter"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO：" prop="logo">
        <single-upload v-model="brand.logo"></single-upload>
      </el-form-item>
      <el-form-item label="品牌专区大图：">
        <single-upload v-model="brand.bigPic"></single-upload>
      </el-form-item>
      <el-form-item label="品牌故事：">
        <el-input placeholder="请输入内容" type="textarea" v-model="brand.brandStory" :autosize="true"></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input v-model.number="brand.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="brand.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="品牌制造商：">
        <el-radio-group v-model="brand.factoryStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleBrandSubmit()">提交</el-button>
        <el-button v-if="!props.isEdit" @click="handleBrandReset()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style></style>
