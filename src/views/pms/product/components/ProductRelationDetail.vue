<script setup lang="ts">
import { onMounted, inject, type Ref, computed, ref } from 'vue'
import { type TransferDataItem } from 'element-plus'
import type { PmsProductParam } from '@/types/product'
import { getSubjectListAllAPI } from '@/apis/subject'
import { getPrefrenceAreaListAllAPI } from '@/apis/prefrenceArea'
import type { ElTransferDataVo } from '@/types/common'

// 定义属性
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['prev-step', 'finish-commit'])

// 获取跨层传递的数据
const compProductParam = inject('product-key') as Ref<PmsProductParam>

// 所有专题列表
const subjectList = ref<ElTransferDataVo[]>([])
// 所有优选专区列表
const prefrenceAreaList = ref<ElTransferDataVo[]>([])
// 获取专题列表
const getSubjectList = async () => {
  const res = await getSubjectListAllAPI()
  subjectList.value = res.data.map(item => ({
    label: item.title,
    key: item.id
  }))
}
// 获取优选区域列表
const getPrefrenceAreaList = async () => {
  const res = await getPrefrenceAreaListAllAPI()
  prefrenceAreaList.value = res.data.map(item => ({
    label: item.name,
    key: item.id
  }))
}

// 初始化数据
onMounted(() => {
  getSubjectList()
  getPrefrenceAreaList()
})

// 关联专题
const selectSubject = computed({
  get: function () {
    return compProductParam.value.subjectProductRelationList?.map(item => item.subjectId!)
  },
  set: function (newValue) {
    compProductParam.value.subjectProductRelationList = []
    newValue?.forEach(item => {
      compProductParam.value.subjectProductRelationList!.push({ subjectId: item })
    })
  }
})

// 关联优选
const selectPrefrenceArea = computed({
  get: function () {
    return compProductParam.value.prefrenceAreaProductRelationList?.map(item => item.prefrenceAreaId!)
  },
  set: function (newValue) {
    compProductParam.value.prefrenceAreaProductRelationList = []
    newValue?.forEach(item => {
      compProductParam.value.prefrenceAreaProductRelationList!.push({ prefrenceAreaId: item })
    })
  }
})

// 过滤方法
const filterMethod = (query: string, item: TransferDataItem) => {
  return item.label.indexOf(query) > -1
}

// 上一步处理
const handlePrev = () => {
  emit('prev-step')
}

// 完成提交处理
const handleFinishCommit = async () => {
  emit('finish-commit', props.isEdit)
}
</script>

<template>
  <div style="margin-top: 50px">
    <el-form :model="compProductParam" ref="productRelationForm" label-width="120px" class="form-inner-container">
      <el-form-item label="关联专题：">
        <el-transfer style="display: inline-block" filterable :filter-method="filterMethod" filter-placeholder="请输入专题名称"
          v-model="selectSubject" :titles="['待选择', '已选择']" :data="subjectList">
        </el-transfer>
      </el-form-item>
      <el-form-item label="关联优选：">
        <el-transfer style="display: inline-block" filterable :filter-method="filterMethod" filter-placeholder="请输入优选名称"
          v-model="selectPrefrenceArea" :titles="['待选择', '已选择']" :data="prefrenceAreaList">
        </el-transfer>
      </el-form-item>
      <el-form-item>
        <div style="width: 100%;text-align: center">
          <el-button @click="handlePrev">上一步，填写商品属性</el-button>
          <el-button type="primary" @click="handleFinishCommit">完成，提交商品</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
