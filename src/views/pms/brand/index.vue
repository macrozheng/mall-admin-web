<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type Action } from 'element-plus'
import { getBrandListAPI, brandUpdateShowStatusAPI, brandUpdateFactoryStatusAPI, brandDeleteByIdAPI } from '@/apis/brand'
import { Search, Tickets } from '@element-plus/icons-vue'
import type { PmsBrand } from '@/types/brand'
import type { PageParam } from '@/types/common'

// 获取路由对象
const router = useRouter()

// 品牌列表查询参数
const listQuery = ref<PageParam>({
  keyword: '',
  pageNum: 1,
  pageSize: 10
})
// 品牌列表数据
const list = ref<PmsBrand[]>([])
// 表格中被选中的行
const multipleSelection = ref<PmsBrand[]>([])
// 表格数据加载进度条
const listLoading = ref(true)
// 分页组件参数
const total = ref(0)
// 获取品牌列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const res = await getBrandListAPI(listQuery.value)
    listLoading.value = false
    list.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取品牌列表失败:', error)
  }
}

// 组件挂载后初始化列表信息
onMounted(() => {
  getList()
})

// 处理品牌搜索
const handleSearchBrand = () => {
  listQuery.value.pageNum = 1
  getList()
}

// 处理添加品牌
const handleAddBrand = () => {
  router.push({ path: '/pms/addBrand' })
}

// 处理编辑品牌操作
const handleUpdateBrand = (index: number, row: PmsBrand) => {
  router.push({ path: '/pms/updateBrand', query: { id: row.id } })
}

// 处理删除品牌操作
const handleDeleteBrand = async (index: number, row: PmsBrand) => {
  ElMessageBox.confirm('是否要删除该品牌', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    callback: async (action: Action) => {
      if (action === 'confirm') {
        await brandDeleteByIdAPI(row.id!)
        ElMessage.success('删除成功')
        getList()
      }
    },
  })
}

// 处理表格选中状态变化
const handleSelectionChange = (val: PmsBrand[]) => {
  multipleSelection.value = val
}

// 获取产品列表
const getProductList = (index: number, row: PmsBrand) => {
  console.log(index, row)
}

// 获取产品评论列表
const getProductCommentList = (index: number, row: PmsBrand) => {
  console.log(index, row)
}

// 处理厂商状态变化
const handleFactoryStatusChange = async (index: number, row: PmsBrand) => {

  try {
    await brandUpdateFactoryStatusAPI({
      ids: row.id!.toString(),
      factoryStatus: row.factoryStatus
    })
    ElMessage.success('修改成功')
  } catch (error) {
    // 如果更新失败，回滚状态
    row.factoryStatus = row.factoryStatus === 0 ? 1 : 0
    console.error('更新厂商状态失败:', error)
  }
}

// 处理显示状态变化
const handleShowStatusChange = async (index: number, row: PmsBrand) => {
  try {
    await brandUpdateShowStatusAPI({
      ids: row.id!.toString(),
      showStatus: row.showStatus
    })
    ElMessage.success('修改成功')
  } catch (error) {
    // 如果更新失败，回滚状态
    row.showStatus = row.showStatus === 0 ? 1 : 0
    console.error('更新显示状态失败:', error)
  }
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

// 批量操作类型
const operates = ref([
  {
    label: "显示品牌",
    value: "showBrand"
  },
  {
    label: "隐藏品牌",
    value: "hideBrand"
  }
])

// 底部多选批量操作类型
const operateType = ref<string | null>()

// 处理批量操作
const handleBatchOperate = async () => {
  if (!multipleSelection.value || multipleSelection.value.length < 1) {
    ElMessage.warning('请选择一条记录')
    return
  }
  let showStatus = 0
  if (operateType.value === 'showBrand') {
    showStatus = 1
  } else if (operateType.value === 'hideBrand') {
    showStatus = 0
  } else {
    ElMessage.warning('请选择批量操作类型')
    return
  }
  const idsArr = multipleSelection.value.map(item => item.id)
  try {
    await brandUpdateShowStatusAPI({
      ids: idsArr.join(','),
      showStatus: showStatus
    })
    getList()
    ElMessage.success('修改成功')
  } catch (error) {
    console.error('批量操作失败:', error)
  }
}
</script>

<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-icon class="el-icon-middle">
          <Search />
        </el-icon>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchBrand()" type="primary">
          查询结果
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="品牌名称/关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddBrand()">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="品牌首字母" width="100" align="center">
          <template #default="scope">{{ scope.row.firstLetter }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="品牌制造商" width="100" align="center">
          <template #default="scope">
            <el-switch @change="handleFactoryStatusChange(scope.$index, scope.row)" :active-value="1"
              :inactive-value="0" v-model="scope.row.factoryStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template #default="scope">
            <el-switch @change="handleShowStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="相关" width="220" align="center">
          <template #default="scope">
            <span>商品：</span>
            <el-button size="small" type="primary" link @click="getProductList(scope.$index, scope.row)">100
            </el-button>
            <span>评价：</span>
            <el-button size="small" type="primary" link @click="getProductCommentList(scope.$index, scope.row)">1000
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleUpdateBrand(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteBrand(scope.$index, scope.row)">删除
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
