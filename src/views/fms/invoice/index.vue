<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 30px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="80px"
        >
          <el-form-item label="发票号码:">
            <el-input
              v-model="listQuery.invoiceNumber"
              class="input-width"
              placeholder="请输入发票号码"
              clearable
              @clear="handleInvoiceNumberClear"
            ></el-input>
          </el-form-item>

          <el-form-item label="车牌号:">
            <el-input
              v-model="listQuery.licensePlate"
              class="input-width"
              placeholder="请输入车牌号"
              clearable
              @clear="handleLicensePlateClear"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="开票日期:">
            <el-date-picker
              v-model="listQuery.invoiceDate"
              type="date"
              placeholder="请选择开票日期"
              value-format="yyyy-MM-dd"
              class="input-width"
              @input="handleDateChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="listQuery.status" placeholder="请选择" clearable @clear="handleStatusClear">
              <el-option
                v-for="item in statusOptions"
                :key="item.val"
                :label="item.des"
                :value="item.val">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      
      <el-button
        size="mini"
        class="btn-add"
        @click="handleAdd()"
        style="margin-left: 20px"
        >添加</el-button
      >
      <el-button
        size="mini"
        class="btn-add"
        @click="handleChangeStatus()"
        style="margin-left: 20px"
        type="danger"
        >一键更改发票状态</el-button
      >
      <el-button
        size="mini"
        class="btn-add"
        @click="handleSum()"
        style="margin-left: 40px"
        type="success"
        >统计</el-button
      >
    </el-card>
    <div class="table-container">
      <el-table
        ref="invoiceTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" align="center" width="70px">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="发票号码" align="center">
          <template slot-scope="scope">{{ scope.row.invoiceNumber }}</template>
        </el-table-column>
        <el-table-column label="开票日期" align="center">
          <template slot-scope="scope">{{
            scope.row.invoiceDate | formatDateTime
          }}</template>
        </el-table-column>
        <el-table-column label="车牌号" align="center">
          <template slot-scope="scope">{{ scope.row.licensePlate }}</template>
        </el-table-column>
        <el-table-column label="开始时间 ~ 结束时间" align="center" width="160px">
          <template slot-scope="scope">{{
            formatTime(scope.row.startTime)  + ' ~ ' + formatTime(scope.row.endTime) 
          }}</template>
        </el-table-column>
        <el-table-column label="里程数(km)" align="center">
          <template slot-scope="scope">{{ scope.row.mileage }}</template>
        </el-table-column>
        <el-table-column label="金额(元)" align="center">
          <template slot-scope="scope">{{ scope.row.amount }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{ scope.row.status == 1 ? '有效':'已删除' }}</template>
        </el-table-column> -->
        <el-table-column label="操作" width="140px" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10, 15, 20]"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit ? '编辑发票' : '添加发票'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        :model="invoice"
        :rules="rules"
        ref="invoiceForm"
        label-width="150px"
        size="small"
      >
        <el-form-item label="发票号码：" prop="invoiceNumber">
          <el-input
            v-model="invoice.invoiceNumber"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="开票日期：" prop="invoiceDate">
          <el-date-picker
            v-model="invoice.invoiceDate"
            type="date"
            placeholder="请选择开票日期"
            value-format="yyyy-MM-dd"
            style="width: 250px"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车牌号：" prop="licensePlate">
          <el-input
            v-model="invoice.licensePlate"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间：" prop="startTime">
          <el-date-picker
            v-model="invoice.startTime"
            type="datetime"
            placeholder="请选择开票日期"
            style="width: 250px"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker
            v-model="invoice.endTime"
            type="datetime"
            placeholder="请选择开票日期"
            style="width: 250px"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="里程数：" prop="mileage">
          <el-input v-model="invoice.mileage" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="金额：" prop="amount">
          <el-input v-model="invoice.amount" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="发票金额统计"
      :visible.sync="sumDialogVisible"
      width="60%"
    >
      <el-card class="invoice-card sum-card" :body-style="{padding: '0 20px'}">
        <div class="total-amount">
          <span>发票总金额:<span class="amount-value"> {{ totalAmount === '' ? 0 : totalAmount}}</span></span>
          <span>有效发票金额:<span class="amount-value amount-large"> {{ validAmount === '' ? 0 : validAmount}}</span></span>
          <span>无效发票金额:<span class="amount-value"> {{ invalidAmount === '' ? 0 : invalidAmount }}</span></span>
        </div>
        <div class="repeat-license-plate">
          <span>重复的车牌号:<span class="license-plate-value">{{ repeatLicensePlate }}</span></span>
        </div>
        <div>
          <el-table
            :data="dateAmountList"
            style="width: 100%"
            border
            highlight-current-row
            stripe
          >
            <el-table-column
              prop="date"
              label="日期"
              width="120px"
            ></el-table-column>
            <el-table-column
              prop="amount"
              label="金额"
              width="70px"
            ></el-table-column>
            <el-table-column
              prop="curInvoices"
              label="发票号集合"
            ></el-table-column>
            <el-table-column
              prop="curDetailTime"
              label="时间集合"
            ></el-table-column>
          </el-table>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sumDialogVisible = false" size="small" type="primary"
          >关 闭</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="发票无效失效操作"
      :visible.sync="statusDialogVisible"
      width="40%"
    >
      <el-form
          :model="statusDialog"
          label-width="150px"
          ref="statusDialogForm"
          size="small"
        >
          <el-form-item label="开始日期：" prop="startDate">
            <el-date-picker
              v-model="statusDialog.startDate"
              type="date"
              placeholder="请选择开始日期"
              value-format="yyyy-MM-dd"
              style="width: 250px"
              clearable
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期：" prop="endDate">
            <el-date-picker
              v-model="statusDialog.endDate"
              type="date"
              placeholder="请选择结束日期"
              value-format="yyyy-MM-dd"
              style="width: 250px"
              clearable
              @change="handleChangeTest"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发票状态：">
            <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="statusDialog.status">
              </el-switch>
          </el-form-item>
          
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleStatusDialogConfirm()" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

  </div>
</template>
<script>
import {
  createInvoice,
  deleteInvoice,
  updateInvoice,
  fetchList,
  fetchListAll,
  getSum,
  getStatusList,
  updateStatus,
  updateInvoicesStatus
} from "@/api/fms/invoice/invoice";

import { formatDate } from "@/utils/date";

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  invoiceNumber: null,
  licensePlate: null,
  invoiceDate: null,
  // 默认查询所有
  status: null,
};
const defaultInvoice = {
  id: null,
  invoiceNumber: null,
  invoiceDate: null,
  licensePlate: null,
  startTime: null,
  endTime: null,
  mileage: 0,
  amount: 0,
};
const defaultStatusDialog = {
    startDate: null,
    endDate: null,
    status: 0,
};
export default {
  name: "invoiceList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      invoice: Object.assign({}, defaultInvoice),
      isEdit: false,

      // 统计弹出框属性
      sumDialogVisible: false,
      dateAmountList: [],
      totalAmount: "0",
      validAmount: "0",
      invalidAmount: "0",
      statusOptions: [],

      // 更改发票状态弹出框属性
      statusDialogVisible: false,
      statusDialog: Object.assign({}, defaultStatusDialog),
      repeatLicensePlate: '',

      rules: {
        invoiceNumber: [
          { required: true, message: "请输入发票号码", trigger: "blur" },
        ],
        invoiceDate: [
          { required: true, message: "请输入开票日期", trigger: "blur" },
        ],
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请输入开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: "blur" },
        ],
        mileage: [{ required: true, message: "请输入里程数", trigger: "blur" }],
        amount: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getAllStatus();
  },
  computed: {
    data() {
      if (this.list === null) return [];
      return this.list.map((item) => {
        return {
          ...item,
          invoiceDate: formatDate(new Date(item.invoiceDate), "yyyy-MM-dd"),
          startTime: formatDate(new Date(item.startTime), "hh:mm:ss"),
          endTime: formatDate(new Date(item.endTime), "hh:mm:ss"),
        };
      });
    },
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    
  },
  methods: {
    handleChangeTest() {
      console.log(this.statusDialog.invoice)
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      // yyyy-MM-dd hh:mm:ss
      return formatDate(date, "hh:mm");
    },

    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.$refs.invoiceForm.resetFields();
      this.isEdit = false;
      this.invoice = Object.assign({}, defaultInvoice);
    },
    handleStatusChange(index, row) {
      this.$confirm("是否要修改该状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateStatus(row.id, { status: row.status }).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改",
          });
          this.getList();
        });
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该发票?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteInvoice(row.id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      // 清除校验信息
      this.$refs.invoiceForm.resetFields();
      this.isEdit = true;
      this.invoice = Object.assign({}, row);
    },
    handleDialogConfirm() {
      if (this.isEdit) {
        updateInvoice(this.invoice.id, this.invoice).then((response) => {
          this.$message({
            message: "修改成功！",
            type: "success",
          });
          this.dialogVisible = false;
          this.getList();
        });
      } else {
        createInvoice(this.invoice).then((response) => {
          this.$message({
            message: "添加成功！",
            type: "success",
          });
          this.dialogVisible = false;
          this.getList();
          this.$refs.invoiceForm.resetFields();
        });
      }
    },
    handleStatusDialogConfirm() {
      updateInvoicesStatus(this.statusDialog).then((response) => {
        this.$message({
          message: "修改成功！",
          type: "success",
        });
        this.statusDialogVisible = false;
        this.getList();
      });
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleChangeStatus() {
      this.statusDialogVisible = true;
      this.statusDialog = Object.assign({}, defaultStatusDialog);
    },
    handleSum() {
      this.sumDialogVisible = true;
      this.getSumRes();
    },
    getSumRes() {
      getSum().then((response) => {
        this.totalAmount = response.data.totalAmount;
        this.validAmount = response.data.validAmount;
        this.invalidAmount = response.data.invalidAmount;

        this.dateAmountList = response.data.dateAmountList;
        this.repeatLicensePlate = response.data.repeatLicensePlate;
      });
    },

    getAllStatus() {
      getStatusList().then((response) => {
        this.statusOptions = response.data;
        console.log('22222',this.statusOptions);
      });
    },

    // 搜索框清空数据时触发
    handleInvoiceNumberClear() {
      this.listQuery.invoiceNumber = null;
      this.getList();
    },

    handleLicensePlateClear() {
      this.listQuery.licensePlate = null;
      this.getList();
    },

    handleDateChange(value) {
      if (value === null) {
        this.handleInvoiceDateClear();
      }
    },

    handleInvoiceDateClear() {
      console.log('ddddd')
      this.listQuery.invoiceDate = null;
      this.getList();
    },

    handleStatusClear() {
      this.listQuery.status = null;
      this.getList();
    }
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
}
.sum-card {
  height: 300px;
  overflow: auto;

  .total-amount {
    padding: 10px 0;
    font-size: 16px;
    > span {
      margin-left: 8px;
    }
    .amount-value {
      margin-left: 10px;
      font-size: 18px;
      color: red;
      font-weight: bold;
      &.amount-large {
        font-size: 25px;
      }
    }
  }
  .repeat-license-plate {
    // margin-left: 6px;
    padding: 10px 0 10px 6px;
    font-size: 16px;
    .license-plate-value {
      padding-left: 5px;
      font-size: 18px;
      color: rgb(50, 205, 99)
    }
  }
}
</style>