<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>{{this.$t('basCodeGroup.codeGroupList')}}</span>
      <el-button
        size="mini"
        @click="handleAdd"
        class="btn-add">{{this.$t('baseAction.add')}}
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="codeGroupTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column :label="$t('basCodeGroup.no')" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCodeGroup.codeGroupName')" align="center">
          <template slot-scope="scope">{{scope.row.groupEname}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCodeGroup.codeGroupLName')" align="center">
          <template slot-scope="scope">{{scope.row.groupLocalName}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCodeGroup.isOften')" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOften"
              @change="handleOftenChange(scope.$index,scope.row)"
              active-value="y"
              inactive-value="n">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('basCodeGroup.status')" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.$index,scope.row)"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('basCodeGroup.createTime')" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column :label="$t('baseAction.op')" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">{{$t('baseAction.edit')}}</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)">{{$t('baseAction.del')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" :placeholder="$t('baseAction.batOp')">
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate"
        type="primary"
        size="small">
        {{this.$t('baseAction.ok')}}
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="$t('basCodeGroup.addCode')"
      :visible.sync="dialogVisible" width="30%">
      <el-form :model="codeGroup"
               ref="codeGroupForm" label-width="150px">
        <el-form-item :label="$t('basCodeGroup.codeGroupName')">
          <el-input v-model="codeGroup.groupEname" class="input-width"></el-input>
        </el-form-item>
        <el-form-item :label="$t('basCodeGroup.codeGroupLName')">
          <el-input v-model="codeGroup.groupLocalName" class="input-width"></el-input>
        </el-form-item>
        <el-form-item :label="$t('basCodeGroup.isOften')">
          <el-switch v-model="codeGroup.isOften" active-value="y" inactive-value="n"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('basCodeGroup.status')">
          <el-switch v-model="codeGroup.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{this.$t('baseAction.cancel')}}</el-button>
        <el-button type="primary" @click="handleConfirm">{{this.$t('baseAction.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {formatDate} from '@/utils/date';
import {fetchList,deleteCodeGroup,updateStatus,updateIsOften,addCodeGroup,getCodeGroupDetail,updateCodeGroup} from '@/api/bas/codegroup';
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5
};
const defaultCodeGroup = {
  groupEname:null,
  groupLocalName:null,
  isOften:'n',
  groupOrder:0,
  status:1
};

export default {
  name: 'codeGroupList',
  data() {
    return {
      list: null,
      total: null,
      multipleSelection: [],
      listLoading:true,
      listQuery:Object.assign({}, defaultListQuery),
      operateType:null,
      operateOptions: [
        {
          label: this.$t('baseAction.del'),
          value: 1
        }
      ],
      dialogVisible:false,
      codeGroup:Object.assign({},defaultCodeGroup),
      operateCodeGroupId:null
    }
  },
  created(){
    this.getList();
  },
  filters:{
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    handleAdd() {
      this.dialogVisible=true;
      this.operateCodeGroupId=null;
      this.codeGroup=Object.assign({},defaultCodeGroup);
    },
    handleConfirm(){
      if(this.operateCodeGroupId==null){
        //添加操作
        addCodeGroup(this.codeGroup).then(response=>{
          this.dialogVisible=false;
          this.operateCodeGroupId=null;
          this.$message({
            message: this.$t('baseAction.insertSuccess'),
            type: 'success',
            duration:1000
          });
          this.getList();
        });
      }else{
        //编辑操作
        updateCodeGroup(this.operateCodeGroupId,this.codeGroup).then(response=>{
          this.dialogVisible=false;
          this.operateCodeGroupId=null;
          this.$message({
            message: this.$t('baseAction.modifySuccess'),
            type: 'success',
            duration:1000
          });
          this.getList();
        });
      }
    },
    handleUpdate(index, row){
      this.dialogVisible=true;
      this.operateCodeGroupId=row.id;
      getCodeGroupDetail(row.id).then(response=>{
        this.codeGroup=response.data;
      });
    },
    handleDelete(index, row){
      let ids=[];
      ids.push(row.id);
      this.deleteCodeGroup(ids);
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    handleStatusChange(index,row){
      let ids=[];
      ids.push(row.id);
      let param = new URLSearchParams();
      param.append("status",row.status);
      param.append("ids",ids);
      updateStatus(param).then(response=>{
        this.$message({
          message: this.$t('baseAction.statusSuccess'),
          type: 'success'
        });
      });
    },
    handleOftenChange(index,row){
      let ids=[];
      ids.push(row.id);
      let param = new URLSearchParams();
      param.append("isOften",row.isOften);
      param.append("ids",ids);
      updateIsOften(param).then(response=>{
        this.$message({
          message: this.$t('baseAction.statusSuccess'),
          type: 'success'
        });
      });
    },
    handleBatchOperate(){
      if(this.multipleSelection==null||this.multipleSelection.length<1){
        this.$message({
          message: this.$t('baseAction.plsSelect'),
          type: 'warning',
          duration: 1000
        });
        return;
      }
      if(this.operateType===1){
        let ids=[];
        for(let i=0;i<this.multipleSelection.length;i++){
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteCodeGroup(ids);
      }
    },
    handleSizeChange(val){
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val){
      this.listQuery.pageNum = val;
      this.getList();
    },
    getList(){
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    deleteCodeGroup(ids){
      this.$confirm(this.$t('baseAction.confirmDel'), this.$t('baseAction.promptTitle'), {
        confirmButtonText:  this.$t('baseAction.ok'),
        cancelButtonText: this.$t('baseAction.cancel'),
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids",ids);
        deleteCodeGroup(params).then(response=>{
          this.$message({
            message: this.$t('baseAction.delSuccess'),
            type: 'success',
            duration: 1000
          });
          this.listQuery.pageNum=1;
          this.getList();
        });
      })
    },
  }
}
</script>
<style scoped>
.input-width {
  width: 80%;
}
</style>


