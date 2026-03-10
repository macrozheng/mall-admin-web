<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFlashProductRelationListAPI, flashProductRelationCreateAPI, flashProductRelationDeleteByIdAPI, flashProductRelationUpdateByIdAPI } from '@/apis/flashProductRelation'
import { getProductListAPI } from '@/apis/product'
import type { FlashProductQueryParam, SmsFlashPromotionProductRelation } from '@/types/flash'
import type { PmsProduct, ProductQueryParam } from '@/types/product'

// 获取路由
const route = useRoute()

// 秒杀商品关系列表数据
const listQuery = ref<FlashProductQueryParam>({
  pageNum: 1,
  pageSize: 10
})
// 秒杀商品列数据
const list = ref<SmsFlashPromotionProductRelation[]>([])
// 总条数
const total = ref<number>(0)
// 加载状态
const listLoading = ref(false)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const res = await getFlashProductRelationListAPI(listQuery.value)
    listLoading.value = false
    list.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取秒杀商品列表失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  listQuery.value.flashPromotionId = Number(route.query.flashPromotionId)
  listQuery.value.flashPromotionSessionId = Number(route.query.flashPromotionSessionId)
  getList()
})

// 秒杀商品关系编辑框可见性
const editDialogVisible = ref(false)
// 当前操作的秒杀商品关系
const flashProductRelation = ref<SmsFlashPromotionProductRelation>()

// 对话框数据
const dialogData = ref<{
  list: PmsProduct[]
  total: number
  multipleSelection: PmsProduct[]
  listQuery: ProductQueryParam
}>({
  list: [],
  total: 0,
  multipleSelection: [],
  listQuery: {
    keyword: '',
    pageNum: 1,
    pageSize: 5
  }
})
// 选择商品对话框可见性
const selectDialogVisible = ref(false)

// 每页大小改变
const handleSizeChange = (val: number) => {
  listQuery.value.pageNum = 1
  listQuery.value.pageSize = val
  getList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  listQuery.value.pageNum = val
  getList()
}

// 选择商品
const handleSelectProduct = () => {
  selectDialogVisible.value = true
  getDialogList()
}

// 更新秒杀商品
const handleUpdate = (index: number, row: SmsFlashPromotionProductRelation) => {
  editDialogVisible.value = true
  flashProductRelation.value = Object.assign({}, row)
}

// 删除秒杀商品
const handleDelete = async (index: number, row: SmsFlashPromotionProductRelation) => {
  try {
    await ElMessageBox.confirm('是否要删除该商品?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await flashProductRelationDeleteByIdAPI(row.id!)
    ElMessage.success('删除成功!')
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除秒杀商品失败:', error)
    }
  }
}

// 选择搜索
const handleSelectSearch = () => {
  getDialogList()
}

// 对话框每页大小改变
const handleDialogSizeChange = (val: number) => {
  dialogData.value.listQuery.pageNum = 1
  dialogData.value.listQuery.pageSize = val
  getDialogList()
}

// 对话框当前页改变
const handleDialogCurrentChange = (val: number) => {
  dialogData.value.listQuery.pageNum = val
  getDialogList()
}

// 对话框选中项改变
const handleDialogSelectionChange = (val: PmsProduct[]) => {
  dialogData.value.multipleSelection = val
}

// 选择对话框确认
const handleSelectDialogConfirm = async () => {
  if (dialogData.value.multipleSelection.length < 1) {
    ElMessage.warning('请选择一条记录')
    return
  }
  const selectProducts = dialogData.value.multipleSelection.map(item => {
    return {
      productId: item.id!,
      flashPromotionId: listQuery.value.flashPromotionId!,
      flashPromotionSessionId: listQuery.value.flashPromotionSessionId!
    }
  })
  try {
    await ElMessageBox.confirm('使用要进行添加操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await flashProductRelationCreateAPI(selectProducts)
    selectDialogVisible.value = false
    dialogData.value.multipleSelection = []
    getList()
    ElMessage.success('添加成功!')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('添加秒杀商品失败:', error)
    }
  }
}

// 编辑对话框确认
const handleEditDialogConfirm = async () => {
  try {
    await ElMessageBox.confirm('是否要确认?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await flashProductRelationUpdateByIdAPI(flashProductRelation.value!.id!, flashProductRelation.value!)
    ElMessage.success('修改成功！')
    editDialogVisible.value = false
    getList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('更新秒杀商品失败:', error)
    }
  }
}

// 获取对话框商品列表数据
const getDialogList = async () => {
  try {
    const res = await getProductListAPI(dialogData.value.listQuery)
    dialogData.value.list = res.data.list
    dialogData.value.total = res.data.total
  } catch (error) {
    console.error('获取商品列表失败:', error)
  }
}
</script>

<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleSelectProduct()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productRelationTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template #default="scope">{{ scope.row.product.name }}</template>
        </el-table-column>
        <el-table-column label="货号" width="140" align="center">
          <template #default="scope">NO.{{ scope.row.product.productSn }}</template>
        </el-table-column>
        <el-table-column label="商品价格" width="100" align="center">
          <template #default="scope">￥{{ scope.row.product.price }}</template>
        </el-table-column>
        <el-table-column label="剩余数量" width="100" align="center">
          <template #default="scope">{{ scope.row.product.stock }}</template>
        </el-table-column>
        <el-table-column label="秒杀价格" width="100" align="center">
          <template #default="scope">
            <p v-if="scope.row.flashPromotionPrice !== null">
              ￥{{ scope.row.flashPromotionPrice }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="秒杀数量" width="100" align="center">
          <template #default="scope">{{ scope.row.flashPromotionCount }}</template>
        </el-table-column>
        <el-table-column label="限购数量" width="100" align="center">
          <template #default="scope">{{ scope.row.flashPromotionLimit }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="small" type="primary" link @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" v-model:current-page="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="选择商品" v-model="selectDialogVisible" width="50%">
      <el-input v-model="dialogData.listQuery.keyword" style="width: 250px;margin-bottom: 20px" size="small"
        placeholder="商品名称搜索">
        <template #append>
          <el-button icon="el-icon-search" @click="handleSelectSearch()"></el-button>
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
          <el-button size="small" @click="selectDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="编辑秒杀商品信息" v-model="editDialogVisible" width="40%">
      <el-form :model="flashProductRelation" ref="flashProductRelationForm" label-width="150px"
        v-if="flashProductRelation?.product">
        <el-form-item label="商品名称：">
          <span>{{ flashProductRelation.product.name }}</span>
        </el-form-item>
        <el-form-item label="货号：">
          <span>NO.{{ flashProductRelation.product.productSn }}</span>
        </el-form-item>
        <el-form-item label="商品价格：">
          <span>￥{{ flashProductRelation.product.price }}</span>
        </el-form-item>
        <el-form-item label="秒杀价格：">
          <el-input v-model="flashProductRelation.flashPromotionPrice" class="input-width">
            <template #prepend>￥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="剩余数量：">
          <span>{{ flashProductRelation.product.stock }}</span>
        </el-form-item>
        <el-form-item label="秒杀数量：">
          <el-input v-model="flashProductRelation.flashPromotionCount" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="限购数量：">
          <el-input v-model="flashProductRelation.flashPromotionLimit" class="input-width"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="flashProductRelation.sort" class="input-width"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="handleEditDialogConfirm()" size="small">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.operate-container {
  margin-top: 0;
}

.input-width {
  width: 200px;
}
</style>
