<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="coupon"
             :rules="rules"
             ref="couponFrom"
             label-width="150px"
             size="small">
      <el-form-item label="优惠券类型：">
        <el-select v-model="coupon.type">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券名称：" prop="name">
        <el-input v-model="coupon.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="适用平台：">
        <el-select v-model="coupon.platform">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总发行量：" prop="publishCount">
        <el-input v-model.number="coupon.publishCount" placeholder="只能输入正整数" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="面额：" prop="amount">
        <el-input v-model.number="coupon.amount" placeholder="面值只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="每人限领：">
        <el-input v-model="coupon.perLimit" placeholder="只能输入正整数" class="input-width">
          <template slot="append">张</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用门槛：" prop="minPoint">
        <el-input v-model="coupon.minPoint" placeholder="只能输入正整数" class="input-width">
          <template slot="prepend">满</template>
          <template slot="append">元可用</template>
        </el-input>
      </el-form-item>
      <el-form-item label="有效期：">
        <el-date-picker type="date" placeholder="选择日期" v-model="coupon.startTime" style="width: 150px"></el-date-picker>
        <span style="margin-left: 20px;margin-right: 20px">至</span>
        <el-date-picker type="date" placeholder="选择日期" v-model="coupon.endTime" style="width: 150px"></el-date-picker>
      </el-form-item>
      <el-form-item label="可使用商品：">
        <el-radio-group v-model="coupon.useType">
          <el-radio-button :label="0">全场通用</el-radio-button>
          <el-radio-button :label="1">指定分类</el-radio-button>
          <el-radio-button :label="2">指定商品</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="coupon.useType===1">
        xx1

      </el-form-item>
      <el-form-item v-show="coupon.useType===2">
        xx2
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="coupon.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('couponFrom')">提交</el-button>
        <el-button @click="resetForm('couponFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createCoupon} from '@/api/coupon';
  const defaultCoupon = {
    type: 0,
    name: null,
    platform: 0,
    amount: null,
    perLimit: 1,
    minPoint: null,
    startTime: null,
    endTime: null,
    useType: 0,
    note: null,
    publishCount: null,
    productRelationList: [],
    productCategoryRelationList: []
  };
  const defaultTypeOptions = [
    {
      label: '全场赠券',
      value: 0
    },
    {
      label: '会员赠券',
      value: 1
    },
    {
      label: '购物赠券',
      value: 2
    },
    {
      label: '注册赠券',
      value: 3
    }
  ];
  const defaultPlatformOptions = [
    {
      label: '全平台',
      value: 0
    },
    {
      label: '移动平台',
      value: 1
    },
    {
      label: 'PC平台',
      value: 2
    }
  ];
  export default {
    name: 'CouponDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        coupon: Object.assign({}, defaultCoupon),
        typeOptions: Object.assign({}, defaultTypeOptions),
        platformOptions: Object.assign({}, defaultPlatformOptions),
        rules: {
          name: [
            {required: true, message: '请输入优惠券名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          publishCount: [
            {type: 'number',required: true, message: '只能输入正整数', trigger: 'blur'}
          ],
          amount: [
            {type: 'number',required: true,message: '面值只能是数值，0.01-10000，限2位小数',trigger: 'blur'}
          ],
          minPoint: [
            {type: 'number',required: true,message: '只能输入正整数',trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              createCoupon(this.coupon).then(response=>{
                this.$refs[formName].resetFields();
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration:1000
                });
                this.$router.back();
              });
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.coupon = Object.assign({},defaultCoupon);
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 60%;
  }
</style>


