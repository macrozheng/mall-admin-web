<template>
  <div class="detail-container">
    <el-card shadow="never">
      <span class="font-title-medium">退货商品</span>
      <el-table
        border
        class="standard-margin"
        ref="productTable"
        :data="productList">
        <el-table-column label="商品图片" width="160" align="center">
          <template slot-scope="scope">
            <img style="height:80px" :src="scope.row.productPic">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span class="font-small">{{scope.row.productName}}</span><br>
            <span class="font-small">品牌：{{scope.row.productBrand}}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <span class="font-small">价格：￥{{scope.row.productRealPrice}}</span><br>
            <span class="font-small">货号：NO.{{scope.row.productId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="180" align="center">
          <template slot-scope="scope">{{scope.row.productAttr}}</template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productCount}}</template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="center">
          <template slot-scope="scope">￥{{totalAmount}}</template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top:15px;margin-bottom:15px">
        <span class="font-title-medium">合计：</span>
        <span class="font-title-medium color-danger">￥{{totalAmount}}</span>
      </div>
    </el-card>
    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">服务单信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">服务单号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.id}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请状态</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.status | formatStatus}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:50px;line-height:30px">订单编号
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:50px">
            {{orderReturnApply.orderSn}}
            <el-button type="text" size="small" @click="handleViewOrder">查看</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请时间</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.createTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">用户账号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.memberUsername}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系人</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.returnName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.returnPhone}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">退货原因</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.reason}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">问题描述</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.description}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:100px;line-height:80px">凭证图片
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:100px">
            <img v-for="item in proofPics" style="width:80px;height:80px" :src="item">
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">订单金额</el-col>
          <el-col class="form-border font-small" :span="18">￥{{totalAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">确认退款金额
          </el-col>
          <el-col class="form-border font-small" style="height:52px" :span="18">
            ￥
            <el-input size="small" v-model="updateStatusParam.returnAmount"
                      :disabled="orderReturnApply.status!==0"
                      style="width:200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
        <div v-show="orderReturnApply.status!==3">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">选择收货点
          </el-col>
          <el-col class="form-border font-small" style="height:52px" :span="18">
            <el-select size="small"
                       style="width:200px"
                       :disabled="orderReturnApply.status!==0"
                       v-model="updateStatusParam.companyAddressId">
              <el-option v-for="address in companyAddressList"
                         :key="address.id"
                         :value="address.id"
                         :label="address.addressName">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">收货人姓名</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.name}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">所在区域</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress | formatRegion}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">详细地址</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.detailAddress}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{currentAddress.phone}}</el-col>
        </el-row>
        </div>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status!==0">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理人员</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.handleMan}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理时间</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.handleTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理备注</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.handleNote}}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===2">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">收货人员</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.receiveMan}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" >收货时间</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.receiveTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">收货备注</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.receiveNote}}</el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===0">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">处理备注</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-input  size="small" v-model="updateStatusParam.handleNote" style="width:200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status===1">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">收货备注</el-col>
          <el-col class="form-border font-small" :span="18">
            <el-input  size="small" v-model="updateStatusParam.receiveNote" style="width:200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===0">
        <el-button type="primary" size="small" @click="handleUpdateStatus(1)">确认退货</el-button>
        <el-button type="danger" size="small" @click="handleUpdateStatus(3)">拒绝退货</el-button>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===1">
        <el-button type="primary" size="small" @click="handleUpdateStatus(2)">确认收货</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {getApplyDetail,updateApplyStatus} from '@/api/returnApply';
  import {fetchList} from '@/api/companyAddress';
  import {formatDate} from '@/utils/date';

  const defaultUpdateStatusParam = {
    companyAddressId: null,
    handleMan: 'admin',
    handleNote: null,
    receiveMan: 'admin',
    receiveNote: null,
    returnAmount: 0,
    status: 0
  };
  const defaultOrderReturnApply = {
    id: null,
    orderId: null,
    companyAddressId: null,
    productId: null,
    orderSn: null,
    createTime: null,
    memberUsername: null,
    returnAmount: null,
    returnName: null,
    returnPhone: null,
    status: null,
    handleTime: null,
    productPic: null,
    productName: null,
    productBrand: null,
    productAttr: null,
    productCount: null,
    productPrice: null,
    productRealPrice: null,
    reason: null,
    description: null,
    proofPics: null,
    handleNote: null,
    handleMan: null,
    receiveMan: null,
    receiveTime: null,
    receiveNote: null
  };
  export default {
    name: 'returnApplyDetail',
    data() {
      return {
        id: null,
        orderReturnApply: Object.assign({},defaultOrderReturnApply),
        productList: null,
        proofPics: null,
        updateStatusParam: Object.assign({}, defaultUpdateStatusParam),
        companyAddressList: null
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.getDetail();
    },
    computed: {
      totalAmount() {
        if (this.orderReturnApply != null) {
          return this.orderReturnApply.productRealPrice * this.orderReturnApply.productCount;
        } else {
          return 0;
        }
      },
      currentAddress() {
        console.log("currentAddress()");
        let id = this.updateStatusParam.companyAddressId;
        if(this.companyAddressList==null)return {};
        for (let i = 0; i < this.companyAddressList.length; i++) {
          let address = this.companyAddressList[i];
          if (address.id === id) {
            return address;
          }
        }
        return null;
      }
    },
    filters: {
      formatStatus(status) {
        if (status === 0) {
          return "待处理";
        } else if (status === 1) {
          return "退货中";
        } else if (status === 2) {
          return "已完成";
        } else {
          return "已拒绝";
        }
      },
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatRegion(address) {
        let str = address.province;
        if (address.city != null) {
          str += "  " + address.city;
        }
        str += "  " + address.region;
        return str;
      }
    },
    methods: {
      handleViewOrder(){
        this.$router.push({path:'/oms/orderDetail',query:{id:this.orderReturnApply.orderId}});
      },
      getDetail() {
        getApplyDetail(this.id).then(response => {
          console.log("getDetail")
          this.orderReturnApply = response.data;
          this.productList = [];
          this.productList.push(this.orderReturnApply);
          if (this.orderReturnApply.proofPics != null) {
            this.proofPics = this.orderReturnApply.proofPics.split(",")
          }
          //退货中和完成
          if(this.orderReturnApply.status===1||this.orderReturnApply.status===2){
            this.updateStatusParam.returnAmount=this.orderReturnApply.returnAmount;
            this.updateStatusParam.companyAddressId=this.orderReturnApply.companyAddressId;
          }
          this.getCompanyAddressList();
        });
      },
      getCompanyAddressList() {
        fetchList().then(response => {
          console.log("getCompanyAddressList()")
          this.companyAddressList = response.data;
          for (let i = 0; i < this.companyAddressList.length; i++) {
            if (this.companyAddressList[i].receiveStatus === 1&&this.orderReturnApply.status===0) {
              this.updateStatusParam.companyAddressId = this.companyAddressList[i].id;
            }
          }
        });
      },
      handleUpdateStatus(status){
        this.updateStatusParam.status=status;
        this.$confirm('是否要进行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateApplyStatus(this.id,this.updateStatusParam).then(response=>{
            this.$message({
              type: 'success',
              message: '操作成功!',
              duration:1000
            });
            this.$router.back();
          });
        });
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }

  .standard-margin {
    margin-top: 15px;
  }
  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
</style>


