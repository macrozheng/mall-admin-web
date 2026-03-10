<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProductAttributeListAPI, productAttributeDeleteByIds } from '@/apis/productAttr'
import { Tickets } from '@element-plus/icons-vue'
import type { PmsProductAttribute } from '@/types/productAttr'

// 获取路由对象
const router = useRouter()

// 属性分类ID
const cid = Number(router.currentRoute.value.query.cid)
// 属性类型
const type = Number(router.currentRoute.value.query.type)
// 列表查询数据
const listQuery = ref({
  pageNum: 1,
  pageSize: 5,
  type: type
})
const list = ref<PmsProductAttribute[]>([])
// 列表数据
const total = ref(0)
// 加载状态
const listLoading = ref(true)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getProductAttributeListAPI(cid, listQuery.value)
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

// 当前批量操作类型
const operateType = ref<string>()
// 批量操作选中条目
const multipleSelection = ref<PmsProductAttribute[]>([])
// 批量操作类型集合
const operates = ref([
  {
    label: "删除",
    value: "deleteProductAttr"
  }
])

// 添加产品属性
const addProductAttr = () => {
  router.push({ path: '/pms/addProductAttr', query: { cid: router.currentRoute.value.query.cid, type: router.currentRoute.value.query.type } })
}

// 处理表格选中状态变化
const handleSelectionChange = (val: PmsProductAttribute[]) => {
  multipleSelection.value = val
}

// 处理批量操作
const handleBatchOperate = async () => {
  if (multipleSelection.value.length < 1) {
    ElMessage.warning('请选择一条记录')
    return
  }
  if (operateType.value !== 'deleteProductAttr') {
    ElMessage.warning('请选择批量操作类型')
    return
  }
  await handleDeleteProductAttr(multipleSelection.value.map(item => item.id!))
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

// 处理更新操作
const handleUpdate = (index: number, row: PmsProductAttribute) => {
  router.push({ path: '/pms/updateProductAttr', query: { id: row.id } })
}

// 处理删除产品属性
const handleDeleteProductAttr = async (ids: number[]) => {
  try {
    await ElMessageBox.confirm('是否要删除该属性', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await productAttributeDeleteByIds({ ids: ids.join(",") })
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error(error)
  }
}

// 处理删除操作
const handleDelete = async (index: number, row: PmsProductAttribute) => {
  await handleDeleteProductAttr([row.id!])
}

// 属性值的录入方式
const inputTypeFilter = (value: number) => {
  if (value === 1) {
    return '从列表中选取'
  } else {
    return '手工录入'
  }
}

// 属性是否可选
const selectTypeFilter = (value: number) => {
  if (value === 1) {
    return '单选'
  } else if (value === 2) {
    return '多选'
  } else {
    return '唯一'
  }
}
</script>

<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="addProductAttr()">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="属性名称" width="140" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="商品类型" width="140" align="center">
          <template>{{ $route.query.cname }}</template>
        </el-table-column>
        <el-table-column label="属性是否可选" width="120" align="center">
          <template #default="scope">{{ selectTypeFilter(scope.row.selectType) }}</template>
        </el-table-column>
        <el-table-column label="属性值的录入方式" width="150" align="center">
          <template #default="scope">{{ inputTypeFilter(scope.row.inputType) }}</template>
        </el-table-column>
        <el-table-column label="可选值列表" align="center">
          <template #default="scope">{{ scope.row.inputList }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
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
    <div class="batch-operate-container">
      <el-select v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]"
        v-model:current-page="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped></style>
