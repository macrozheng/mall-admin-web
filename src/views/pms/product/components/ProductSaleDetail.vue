<script setup lang="ts">
import { ref, computed, onMounted, inject, type Ref } from 'vue'
import { ElButton, ElSwitch, ElCheckboxGroup, ElCheckbox, ElRadioGroup, ElRadioButton, ElInput, ElDatePicker, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getMemberLevelListAPI } from '@/apis/memberLevel'
import type { PmsProductParam } from '@/types/product'

// 定义属性
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['prev-step', 'next-step'])

// 获取跨层传递的数据
const compProductParam = inject('product-key') as Ref<PmsProductParam>

const getMemberLevelList = async () => {
  const res = await getMemberLevelListAPI({ defaultStatus: 0 })
  const memberPriceList = res.data.map(item => ({ memberLevelId: item.id, memberLevelName: item.name }))
  compProductParam.value.memberPriceList = memberPriceList
}

// 组件挂载时调用
onMounted(() => {
  getMemberLevelList()
})

// 模板引用
const productSaleForm = ref<FormInstance>()

// 日期禁用函数
const isDisabledDate = (time: Date) => {
  return time.getTime() < Date.now()
}

// 被选中的服务保证，多个以逗号分割
const selectServiceList = computed({
  get() {
    if (!compProductParam.value.serviceIds) return []
    return compProductParam.value.serviceIds.split(',').map(item => Number(item))
  },
  set(newValue: number[]) {
    let serviceIds = ''
    if (newValue && newValue.length > 0) {
      for (let i = 0; i < newValue.length; i++) {
        serviceIds += newValue[i] + ','
      }
      if (serviceIds.endsWith(',')) {
        serviceIds = serviceIds.substring(0, serviceIds.length - 1)
      }
      compProductParam.value.serviceIds = serviceIds
    } else {
      compProductParam.value.serviceIds = ''
    }
  }
})

// 处理删除阶梯价格操作
const handleRemoveProductLadder = (index: number) => {
  const productLadderList = compProductParam.value.productLadderList
  if (!productLadderList) return
  if (productLadderList.length === 1) {
    productLadderList.pop()
    productLadderList.push({
      count: 0,
      discount: 0,
      price: 0
    })
  } else {
    productLadderList.splice(index, 1)
  }
}

// 处理添加阶梯价格操作
const handleAddProductLadder = () => {
  const productLadderList = compProductParam.value.productLadderList
  if (productLadderList && productLadderList.length < 3) {
    productLadderList.push({
      count: 0,
      discount: 0,
      price: 0
    })
  } else {
    ElMessage({
      message: '最多只能添加三条',
      type: 'warning'
    })
  }
}

// 处理删除满减价格操作
const handleRemoveFullReduction = (index: number) => {
  const fullReductionList = compProductParam.value.productFullReductionList
  if (!fullReductionList) return
  if (fullReductionList.length === 1) {
    fullReductionList.pop()
    fullReductionList.push({
      fullPrice: 0,
      reducePrice: 0
    })
  } else {
    fullReductionList.splice(index, 1)
  }
}

// 处理添加满减价格操作
const handleAddFullReduction = () => {
  const fullReductionList = compProductParam.value.productFullReductionList
  if (fullReductionList && fullReductionList.length < 3) {
    fullReductionList.push({
      fullPrice: 0,
      reducePrice: 0
    })
  } else {
    ElMessage({
      message: '最多只能添加三条',
      type: 'warning'
    })
  }
}

// 处理上一步
const handlePrev = () => {
  emit('prev-step')
}

// 处理下一步
const handleNext = () => {
  emit('next-step')
}
</script>

<template>
  <div style="margin-top: 50px">
    <el-form :model="compProductParam" ref="productSaleForm" label-width="120px" class="form-inner-container">
      <el-form-item label="赠送积分：">
        <el-input v-model="compProductParam.giftPoint"></el-input>
      </el-form-item>
      <el-form-item label="赠送成长值：">
        <el-input v-model="compProductParam.giftGrowth"></el-input>
      </el-form-item>
      <el-form-item label="积分购买限制：">
        <el-input v-model="compProductParam.usePointLimit"></el-input>
      </el-form-item>
      <el-form-item label="预告商品：">
        <el-switch v-model="compProductParam.previewStatus" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch v-model="compProductParam.publishStatus" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch v-model="compProductParam.newStatus" :active-value="1" :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch v-model="compProductParam.recommandStatus" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="服务保证：">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">无忧退货</el-checkbox>
          <el-checkbox :label="2">快速退款</el-checkbox>
          <el-checkbox :label="3">免费包邮</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="详细页标题：">
        <el-input v-model="compProductParam.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="详细页描述：">
        <el-input v-model="compProductParam.detailDesc"></el-input>
      </el-form-item>
      <el-form-item label="商品关键字：">
        <el-input v-model="compProductParam.keywords"></el-input>
      </el-form-item>
      <el-form-item label="商品备注：">
        <el-input v-model="compProductParam.note" type="textarea" :autoSize="true"></el-input>
      </el-form-item>
      <el-form-item label="选择优惠方式：">
        <el-radio-group v-model="compProductParam.promotionType">
          <el-radio-button :label="0">无优惠</el-radio-button>
          <el-radio-button :label="1">特惠促销</el-radio-button>
          <el-radio-button :label="2">会员价格</el-radio-button>
          <el-radio-button :label="3">阶梯价格</el-radio-button>
          <el-radio-button :label="4">满减价格</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="compProductParam.promotionType === 1">
        <div>
          <div>
            开始时间：
            <el-date-picker v-model="compProductParam.promotionStartTime" type="datetime"
              :disabled-date="isDisabledDate" placeholder="选择开始时间">
            </el-date-picker>
          </div>
          <div class="littleMargin">
            结束时间：
            <el-date-picker v-model="compProductParam.promotionEndTime" type="datetime" :disabled-date="isDisabledDate"
              placeholder="选择结束时间">
            </el-date-picker>
          </div>
          <div class="littleMargin">
            促销价格：
            <el-input style="width: 220px" v-model="compProductParam.promotionPrice" placeholder="输入促销价格"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-show="compProductParam.promotionType === 2">
        <div>
          <div v-for="(item, index) in compProductParam.memberPriceList" :class="{ littleMargin: index !== 0 }"
            :key="item.id">
            {{ item.memberLevelName }}：
            <el-input v-model="item.memberPrice" style="width: 200px"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-show="compProductParam.promotionType === 3">
        <el-table :data="compProductParam.productLadderList" style="width: 80%" border>
          <el-table-column label="数量" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.count"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="折扣" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.discount"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button type="text" @click="handleRemoveProductLadder(scope.$index)">删除</el-button>
              <el-button type="text" @click="handleAddProductLadder()">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="compProductParam.promotionType === 4">
        <el-table :data="compProductParam.productFullReductionList" style="width: 80%" border>
          <el-table-column label="满" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.fullPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="立减" align="center" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.reducePrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button type="text" @click="handleRemoveFullReduction(scope.$index)">删除</el-button>
              <el-button type="text" @click="handleAddFullReduction()">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <div style="width: 100%;text-align: center">
          <el-button @click="handlePrev">上一步，填写商品信息</el-button>
          <el-button type="primary" @click="handleNext">下一步，填写商品属性</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.littleMargin {
  margin-top: 10px
}
</style>
