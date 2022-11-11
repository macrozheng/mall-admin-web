<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>{{this.$t('basCode.codeList')}}</span>
      <el-button
        size="mini"
        @click="handleAdd"
        class="btn-add">{{this.$t('baseAction.add')}}
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="codeTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column :label="$t('basCode.no')" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCode.code')" align="center">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCode.codeGroup')" align="center">
          <template slot-scope="scope">{{scope.row.groupcode}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCode.codeEn')" align="center">
          <template slot-scope="scope">{{scope.row.ename}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCode.codeLocal')" align="center">
          <template slot-scope="scope">{{scope.row.localname}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCode.codeShortcut')" align="center">
          <template slot-scope="scope">{{scope.row.shortcode}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCode.codeCol00')" align="center">
          <template slot-scope="scope">{{scope.row.col00}}</template>
        </el-table-column>
        <el-table-column :label="$t('basCode.status')" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.$index,scope.row)"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('basCode.createTime')" width="180" align="center">
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
      :title="$t('basCode.addCode')"
      :visible.sync="dialogVisible" width="30%">
      <el-form :model="code"
               ref="codeForm" label-width="150px">
        <el-form-item :label="$t('basCode.code')">
          <el-input v-model="code.code" class="input-width"></el-input>
        </el-form-item>
        <el-form-item :label="$t('basCode.codeGroup')">
          <el-select v-model= "code.groupcode" :placeholder = "$t('basCode.selectCodeGroup')">
            <el-option
              v-for="item in selectCodeGroup"
                 :key="item.groupEname"
                 :label="item.groupEname"
                  :value="item.groupEname">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('basCode.codeEn')">
          <el-input v-model="code.ename" class="input-width"></el-input>
        </el-form-item>
        <el-form-item :label="$t('basCode.codeLocal')">
          <el-input v-model="code.localname" class="input-width"></el-input>
        </el-form-item>
        <el-form-item :label="$t('basCode.codeShortcut')">
          <el-input v-model="code.shortcode" class="input-width"></el-input>
        </el-form-item>
        <el-form-item :label="$t('basCode.codeCol00')">
          <el-input v-model="code.col00" class="input-width"></el-input>
        </el-form-item>
       <el-form-item :label="$t('basCode.status')">
          <el-switch v-model="code.status" :active-value="1" :inactive-value="0"></el-switch>
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
import {fetchList,deleteCode,updateStatus,addCode,getCodeDetail,updateCode,fetchCodeGroup} from '@/api/bas/code';
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5
};
const defaultCode = {
  code:null,
  groupcode:null,
  ename:null,
  localname:null,
  shortcode:null,
  col00:null,
  col01:null,
  col02:null,
  col03:null,
  col04:null,
  col05:null,
  col06:null,
  col07:null,
  col08:null,
  col09:null,
  col10:null,
  col11:null,
  col12:null,
  status:1,
  createTime:null
};

export default {
  name: 'codeList',
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
      code:Object.assign({},defaultCode),
      operateCodeId:null,
      selectCodeGroup: []
    }
  },
  created(){
    this.getList();
    this.getSelectCodeGroup();
  },
  filters:{
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    getSelectCodeGroup(){
      fetchCodeGroup({pageSize:100, pageNum: 1}).then(
           response =>{
             this.selectCodeGroup = response.data.list;
             this.selectCodeGroup.unshift({id: null, groupEname: '' });
           }
      );
    },
    handleAdd() {
      this.dialogVisible=true;
      this.operateCodeId=null;
      this.code=Object.assign({},defaultCode);
    },
    handleConfirm(){
      if(this.operateCodeId==null){
        //添加操作
        addCode(this.code).then(response=>{
          this.dialogVisible=false;
          this.operateCodeId=null;
          this.$message({
            message: this.$t('baseAction.insertSuccess'),
            type: 'success',
            duration:1000
          });
          this.getList();
        });
      }else{
        //编辑操作
        updateCode(this.operateCodeId,this.code).then(response=>{
          this.dialogVisible=false;
          this.operateCodeId=null;
          this.$message({
            message:  this.$t('baseAction.modifySuccess'),
            type: 'success',
            duration:1000
          });
          this.getList();
        });
      }
    },
    handleUpdate(index, row){
      this.getSelectCodeGroup();
      this.dialogVisible=true;
      this.operateCodeId=row.id;
      getCodeDetail(row.id).then(response=>{
        this.code=response.data;
      });
    },
    handleDelete(index, row){
      let ids=[];
      ids.push(row.id);
      this.deleteCode(ids);
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
        this.deleteCode(ids);
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
    deleteCode(ids){
      this.$confirm(this.$t('baseAction.confirmDel'), this.$t('baseAction.promptTitle'), {
        confirmButtonText: this.$t('baseAction.ok'),
        cancelButtonText: this.$t('baseAction.cancel'),
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids",ids);
        deleteCode(params).then(response=>{
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


