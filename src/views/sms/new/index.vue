<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Tickets } from '@element-plus/icons-vue'
import { getHomeNewProductListAPI, homeNewProductUpdateRecommendStatusAPI, homeNewProductDeleteByIdsAPI, homeNewProductCreateAPI, homeNewProductUpdateSortByIdAPI } from '@/apis/newProduct';
import { getProductListAPI } from '@/apis/product';
import type { NewProductQueryParam, SmsHomeNewProduct } from '@/types/newProduct';
import type { PmsProduct } from '@/types/product';

// 列表查询参数
const listQuery = ref<NewProductQueryParam>({
  pageNum: 1,
  pageSize: 10
})
// 查询条件中的选中状态
const recommendOptions = ref([
  {
    label: '未推荐',
    value: 0
  },
  {
    label: '推荐中',
    value: 1
  }
])
// 新品列表数据
const list = ref<SmsHomeNewProduct[]>([])
// 总条数
const total = ref(0)
// 加载状态
const listLoading = ref(false)
// 获取列表数据
const getList = async () => {
  listLoading.value = true;
  const res = await getHomeNewProductListAPI(listQuery.value)
  listLoading.value = false;
  list.value = res.data.list;
  total.value = res.data.total;
};

// 组件挂载后执行
onMounted(() => {
  getList()
})

// 选择商品对话框中的数据
const dialogData = ref({
  list: [] as PmsProduct[],
  total: 0,
  multipleSelection: [] as PmsProduct[],
  listQuery: {
    keyword: '',
    pageNum: 1,
    pageSize: 5
  }
})
// 选择商品对话框可见性
const selectDialogVisible = ref(false)

// 批量操作多选记录
const multipleSelection = ref<SmsHomeNewProduct[]>([])
// 批量操作枚举
const operates = ref([
  {
    label: "设为推荐",
    value: 0
  },
  {
    label: "取消推荐",
    value: 1
  },
  {
    label: "删除",
    value: 2
  }
])
// 批量操作类型
const operateType = ref()

// 设置排序对话框可见性
const sortDialogVisible = ref(false)
// 设置排序对话框数据
const sortDialogData = ref({ sort: 0, id: 0 })

// 重置搜索
const handleResetSearch = () => {
  listQuery.value = { pageNum: 1, pageSize: 10 }
};

// 搜索列表
const handleSearchList = () => {
  listQuery.value.pageNum = 1
  getList()
}

// 处理表格选择变化
const handleSelectionChange = (val: SmsHomeNewProduct[]) => {
  multipleSelection.value = val
}

// 处理分页大小变化
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

// 处理推荐状态变化
const handleRecommendStatusStatusChange = (index: number, row: SmsHomeNewProduct) => {
  updateRecommendStatusStatus([row.id!], row.recommendStatus!)
}

// 处理删除
const handleDelete = async (index: number, row: SmsHomeNewProduct) => {
  deleteNewProduct([row.id!])
}

// 处理批量操作
const handleBatchOperate = async () => {
  if (multipleSelection.value.length < 1) {
    ElMessage.warning({
      message: '请选择一条记录',
      duration: 1000
    })
    return
  }
  const ids = multipleSelection.value.map(item => item.id!)
  if (operateType.value === 0) {
    //设为推荐
    await updateRecommendStatusStatus(ids, 1)
  } else if (operateType.value === 1) {
    //取消推荐
    await updateRecommendStatusStatus(ids, 0)
  } else if (operateType.value === 2) {
    //删除
    await deleteNewProduct(ids)
  } else {
    ElMessage.warning({
      message: '请选择批量操作类型',
      duration: 1000
    })
  }
}

// 处理选择商品
const handleSelectProduct = () => {
  selectDialogVisible.value = true;
  getDialogList()
}

// 处理选择搜索
const handleSelectSearch = () => {
  getDialogList();
};

// 处理对话框分页大小变化
const handleDialogSizeChange = (val: number) => {
  dialogData.value.listQuery.pageNum = 1
  dialogData.value.listQuery.pageSize = val
  getDialogList()
};

// 处理对话框当前页变化
const handleDialogCurrentChange = (val: number) => {
  dialogData.value.listQuery.pageNum = val
  getDialogList()
};

// 处理对话框选择变化
const handleDialogSelectionChange = (val: PmsProduct[]) => {
  dialogData.value.multipleSelection = val
}

// 处理选择对话框确认
const handleSelectDialogConfirm = async () => {
  if (dialogData.value.multipleSelection.length < 1) {
    ElMessage.warning({
      message: '请选择一条记录',
      duration: 1000
    })
    return
  }
  await ElMessageBox.confirm('使用要进行添加操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  const selectProducts = dialogData.value.multipleSelection.map(item => ({ productId: item.id!, productName: item.name }))
  await homeNewProductCreateAPI(selectProducts)
  selectDialogVisible.value = false
  dialogData.value.multipleSelection = []
  getList()
  ElMessage.success({
    type: 'success',
    message: '添加成功!'
  })
}

// 处理编辑排序
const handleEditSort = (index: number, row: SmsHomeNewProduct) => {
  sortDialogVisible.value = true
  sortDialogData.value.sort = row.sort!
  sortDialogData.value.id = row.id!
};

// 处理更新排序
const handleUpdateSort = async () => {
  try {
    await ElMessageBox.confirm('是否要修改排序?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await homeNewProductUpdateSortByIdAPI(sortDialogData.value);
    sortDialogVisible.value = false
    getList()
    ElMessage.success({
      type: 'success',
      message: '修改成功!'
    })
  } catch {
    ElMessage.info('已取消操作')
  }
}

// 更新推荐状态
const updateRecommendStatusStatus = async (ids: number[], status: number) => {
  try {
    await ElMessageBox.confirm('是否要修改推荐状态?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await homeNewProductUpdateRecommendStatusAPI({ ids: ids.join(','), recommendStatus: status })
    getList()
    ElMessage.success({
      type: 'success',
      message: '修改成功!'
    })
  } catch {
    getList()
  }
};

// 删除商品
const deleteNewProduct = async (ids: number[]) => {
  try {
    await ElMessageBox.confirm('是否要删除该推荐?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await homeNewProductDeleteByIdsAPI({ ids: ids.join(',') });
    getList()
    ElMessage.success({
      type: 'success',
      message: '删除成功!'
    })
  } catch {
    ElMessage.info('已取消操作')
  }
}

// 获取对话框列表
const getDialogList = async () => {
  const res = await getProductListAPI(dialogData.value.listQuery)
  dialogData.value.list = res.data.list;
  dialogData.value.total = res.data.total;
};

// 格式化推荐状态
const formatRecommendStatus = (status: number) => {
  if (status === 1) {
    return '推荐中';
  } else {
    return '未推荐';
  }
};
</script>

<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-icon class="el-icon-middle">
          <Search />
        </el-icon>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="140px">
          <el-form-item label="商品名称：">
            <el-input v-model="listQuery.productName" class="input-width" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="推荐状态：">
            <el-select v-model="listQuery.recommendStatus" placeholder="全部" clearable class="input-width"
              style="width: 140px;">
              <el-option v-for="item in recommendOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-icon class="el-icon-middle">
        <Tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleSelectProduct()">选择商品</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable" :data="list" style="width: 100%;" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="120" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template #default="scope">{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column label="是否推荐" width="200" align="center">
          <template #default="scope">
            <el-switch @change="handleRecommendStatusStatusChange(scope.$index, scope.row)" :active-value="1"
              :inactive-value="0" v-model="scope.row.recommendStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="160" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template #default="scope">{{ formatRecommendStatus(scope.row.recommendStatus) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleEditSort(scope.$index, scope.row)">设置排序
            </el-button>
            <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">删除
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
    <el-dialog v-model="selectDialogVisible" title="选择商品" width="50%">
      <el-input v-model="dialogData.listQuery.keyword" style="width: 250px;margin-bottom: 20px" placeholder="商品名称搜索">
        <template #append>
          <el-button :icon="Search" @click="handleSelectSearch()"></el-button>
        </template>
      </el-input>
      <el-table :data="dialogData.list" @selection-change="handleDialogSelectionChange" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="货号" width="160" align="center">
          <template #default="scope">NO.{{ scope.row.productSn }}</template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template #default="scope">￥{{ scope.row.price }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleDialogSizeChange" @current-change="handleDialogCurrentChange"
          layout="prev, pager, next" v-model:current-page="dialogData.listQuery.pageNum"
          :page-size="dialogData.listQuery.pageSize" :page-sizes="[5, 10, 15]" :total="dialogData.total">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <template #footer>
        <div>
          <el-button @click="selectDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="sortDialogVisible" title="设置排序" width="40%">
      <el-form :model="sortDialogData" label-width="150px">
        <el-form-item label="排序：">
          <el-input v-model="sortDialogData.sort" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="handleUpdateSort" size="small">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style></style>
