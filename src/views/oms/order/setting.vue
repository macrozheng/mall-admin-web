<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderSettingByIdAPI, orderSettingUpdateByIdAPI } from '@/apis/orderSetting'
import type { FormInstance, FormRules } from 'element-plus'
import type { OmsOrderSetting } from '@/types/orderSetting'

// 默认订单设置数据
const defaultOrderSetting = {
  id: 1,
  flashOrderOvertime: 0,
  normalOrderOvertime: 0,
  confirmOvertime: 0,
  finishOvertime: 0,
  commentOvertime: 0
}
// 订单设置数据
const orderSetting = ref<OmsOrderSetting>(Object.assign({}, defaultOrderSetting))
// 获取详情
const getDetail = async () => {
  const response = await getOrderSettingByIdAPI(orderSetting.value.id)
  orderSetting.value = response.data
}

// 组件挂载后获取详情
onMounted(() => {
  getDetail()
})

// 订单设置表单引用
const orderSettingForm = ref<FormInstance>()
// 时间验证规则
const checkTime = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) {
    return callback(new Error('时间不能为空'))
  }
  const intValue = parseInt(value)
  if (!Number.isInteger(intValue)) {
    return callback(new Error('请输入数字值'))
  }
  callback()
}
// 表单验证规则
const rules = ref<FormRules>({
  flashOrderOvertime: { validator: checkTime, trigger: 'blur' },
  normalOrderOvertime: { validator: checkTime, trigger: 'blur' },
  confirmOvertime: { validator: checkTime, trigger: 'blur' },
  finishOvertime: { validator: checkTime, trigger: 'blur' },
  commentOvertime: { validator: checkTime, trigger: 'blur' }
})

// 确认提交表单
const confirm = async () => {
  if (!orderSettingForm.value) return
  const valid = await orderSettingForm.value.validate()
  if (valid) {
    await ElMessageBox.confirm('是否要提交修改?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await orderSettingUpdateByIdAPI(1, orderSetting.value)
    ElMessage({
      type: 'success',
      message: '提交成功!',
      duration: 1000
    })
  } else {
    ElMessage({
      message: '提交参数不合法',
      type: 'warning'
    })
    return false
  }
}
</script>

<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="orderSetting" ref="orderSettingForm" :rules="rules" label-width="150px">
      <el-form-item label="秒杀订单超过：" prop="flashOrderOvertime">
        <el-input v-model="orderSetting.flashOrderOvertime" class="input-width">
          <template #append>分</template>
        </el-input>
        <span class="note-margin">未付款，订单自动关闭</span>
      </el-form-item>
      <el-form-item label="正常订单超过：" prop="normalOrderOvertime">
        <el-input v-model="orderSetting.normalOrderOvertime" class="input-width">
          <template #append>分</template>
        </el-input>
        <span class="note-margin">未付款，订单自动关闭</span>
      </el-form-item>
      <el-form-item label="发货超过：" prop="confirmOvertime">
        <el-input v-model="orderSetting.confirmOvertime" class="input-width">
          <template #append>天</template>
        </el-input>
        <span class="note-margin">未收货，订单自动完成</span>
      </el-form-item>
      <el-form-item label="订单完成超过：" prop="finishOvertime">
        <el-input v-model="orderSetting.finishOvertime" class="input-width">
          <template #append>天</template>
        </el-input>
        <span class="note-margin">自动结束交易，不能申请售后</span>
      </el-form-item>
      <el-form-item label="订单完成超过：" prop="commentOvertime">
        <el-input v-model="orderSetting.commentOvertime" class="input-width">
          <template #append>天</template>
        </el-input>
        <span class="note-margin">自动五星好评</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="confirm()" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.input-width {
  width: 50%
}

.note-margin {
  margin-left: 15px
}
</style>
