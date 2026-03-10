<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import SingleUpload from '@/components/Upload/singleUpload.vue'
import { homeAdvertiseCreateAPI, getHomeAdvertiseByIdAPI, homeAdvertiseUpdateAPI } from '@/apis/homeAdvertise'
import type { SmsHomeAdvertise } from '@/types/homeAdvertist'

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

// 默认轮播广告，添加时使用
const defaultHomeAdvertise: SmsHomeAdvertise = {
  name: '',
  type: 1,
  status: 0,
  sort: 0
}
// 定义轮播广告对象
const homeAdvertise = ref<SmsHomeAdvertise>(Object.assign({}, defaultHomeAdvertise))
// 轮播广告位置
const typeOptions = ref([
  {
    label: 'PC首页轮播',
    value: 0
  },
  {
    label: 'APP首页轮播',
    value: 1
  }
])
// 轮播广告表单组件引用
const homeAdvertiseFrom = ref<FormInstance>()
// 轮播广告表单校验规则
const rules = reactive<FormRules<SmsHomeAdvertise>>({
  name: [
    { required: true, message: '请输入广告名称', trigger: 'blur' },
    { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入广告链接', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '请选择到期时间', trigger: 'blur' }
  ],
  pic: [
    { required: true, message: '请选择广告图片', trigger: 'blur' }
  ]
})

// 页面加载时获取数据
onMounted(async () => {
  if (props.isEdit) {
    const res = await getHomeAdvertiseByIdAPI(Number(route.query.id))
    homeAdvertise.value = res.data
  } else {
    homeAdvertise.value = Object.assign({}, defaultHomeAdvertise)
  }
})

// 提交表单
const onSubmit = async () => {
  homeAdvertiseFrom.value!.validate(async (valid) => {
    if (valid) {
      await ElMessageBox.confirm('是否提交数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (props.isEdit) {
        await homeAdvertiseUpdateAPI(Number(route.query.id), homeAdvertise.value)
        homeAdvertiseFrom.value!.resetFields()
        ElMessage({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
        router.back()
      } else {
        await homeAdvertiseCreateAPI(homeAdvertise.value)
        homeAdvertiseFrom.value!.resetFields()
        homeAdvertise.value = Object.assign({}, defaultHomeAdvertise)
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

// 重置表单
const resetForm = () => {
  if (homeAdvertiseFrom.value) {
    homeAdvertiseFrom.value.resetFields()
    homeAdvertise.value = Object.assign({}, defaultHomeAdvertise)
  }
}
</script>

<template>
  <el-card class="form-container" shadow="never">
    <el-form ref="homeAdvertiseFrom" :model="homeAdvertise" :rules="rules" label-width="150px">
      <el-form-item label="广告名称：" prop="name">
        <el-input v-model="homeAdvertise.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告位置：">
        <el-select v-model="homeAdvertise.type">
          <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：" prop="startTime">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="homeAdvertise.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间：" prop="endTime">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="homeAdvertise.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="上线/下线：">
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="0">下线</el-radio>
          <el-radio :label="1">上线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告图片：">
        <single-upload v-model="homeAdvertise.pic"></single-upload>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="homeAdvertise.sort" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告链接：" prop="url">
        <el-input v-model="homeAdvertise.url" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告备注：">
        <el-input class="input-width" type="textarea" :rows="5" placeholder="请输入内容" v-model="homeAdvertise.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">提交</el-button>
        <el-button v-if="!props.isEdit" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.input-width {
  width: 70%;
}
</style>
