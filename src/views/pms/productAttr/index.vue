<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductAttributeCategoryListAPI, productAttributeCategoryCreateAPI, productAttributeCategoryDeleteById, productAttributeCategoryUpdateAPI } from '@/apis/productAttrCate'
import { Tickets } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { PageParam } from '@/types/common'
import type { PmsProductAttributeCategory } from '@/types/productAttr'

// 获取路由对象
const router = useRouter()

// 列表查询参数
const listQuery = ref<PageParam>({
  pageNum: 1,
  pageSize: 10
})
// 列表数据
const list = ref<PmsProductAttributeCategory[]>([])
// 总条数
const total = ref(0)
// 加载状态
const listLoading = ref(true)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getProductAttributeCategoryListAPI(listQuery.value)
    listLoading.value = false
    list.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    listLoading.value = false
    console.error(error)
  }
}

// 组件挂载后执行
onMounted(() => {
  getList()
})

// 当前操作的属性分类
const productAttrCate = ref<PmsProductAttributeCategory>({
  name: ''
})
// 编辑框是否可见
const dialogVisible = ref(false)
// 编辑框标题
const dialogTitle = ref('')
// 编辑框中的表单引用
const productAttrCatForm = ref<FormInstance>()
// 编辑框中的校验规则
const rules = ref({
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' }
  ]
})

// 添加产品属性分类
const addProductAttrCate = () => {
  dialogVisible.value = true
  dialogTitle.value = "添加类型"
}

// 处理每页条数变化
const handleSizeChange = (val: number) => {
  listQuery.value.pageNum = 1
  listQuery.value.pageSize = val
  getList()
}

// 处理当前页变化
const handleCurrentChange = (val: number) => {
  listQuery.value.pageNum = val
  getList()
}

// 处理删除操作
const handleDelete = async (index: number, row: PmsProductAttributeCategory) => {
  await ElMessageBox.confirm('是否要删除该品牌', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await productAttributeCategoryDeleteById(row.id!)
  ElMessage.success('删除成功')
  getList()
}

// 处理更新操作
const handleUpdate = (index: number, row: PmsProductAttributeCategory) => {
  dialogVisible.value = true
  dialogTitle.value = "编辑类型"
  productAttrCate.value.name = row.name
  productAttrCate.value.id = row.id
}

// 获取属性列表
const getAttrList = (index: number, row: PmsProductAttributeCategory) => {
  router.push({ path: '/pms/productAttrList', query: { cid: row.id, cname: row.name, type: 0 } })
}

// 获取参数列表
const getParamList = (index: number, row: PmsProductAttributeCategory) => {
  router.push({ path: '/pms/productAttrList', query: { cid: row.id, cname: row.name, type: 1 } })
}

// 确认对话框操作
const handleConfirm = async () => {
  if (!productAttrCatForm.value) return
  const valid = await productAttrCatForm.value.validate().catch(() => false)
  if (valid) {
    if (dialogTitle.value === "添加类型") {
      await productAttributeCategoryCreateAPI(productAttrCate.value.name)
      ElMessage.success('添加成功')
      dialogVisible.value = false
    } else {
      await productAttributeCategoryUpdateAPI(productAttrCate.value.id!, productAttrCate.value.name)
      ElMessage.success('修改成功')
      dialogVisible.value = false
    }
    getList()
  } else {
    ElMessage.error('请先填写类型名称！')
    return false
  }
}

// 关闭对话框处理
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="addProductAttrCate()">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrCateTable" style="width: 100%" :data="list" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="类型名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="属性数量" width="200" align="center">
          <template #default="scope">{{ scope.row.attributeCount == null ? 0 : scope.row.attributeCount }}</template>
        </el-table-column>
        <el-table-column label="参数数量" width="200" align="center">
          <template #default="scope">{{ scope.row.paramCount == null ? 0 : scope.row.paramCount }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template #default="scope">
            <el-button size="small" @click="getAttrList(scope.$index, scope.row)">属性列表
            </el-button>
            <el-button size="small" @click="getParamList(scope.$index, scope.row)">参数列表
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]"
        v-model:current-page="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" :before-close="handleClose" width="30%">
      <el-form ref="productAttrCatForm" :model="productAttrCate" :rules="rules" label-width="120px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="productAttrCate.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped></style>
