<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getProductListAPI,
  productUpdateDeleteStatusAPI,
  productUpdateNewStatusAPI,
  productUpdateRecommendStatusAPI,
  productUpdatePublishStatusAPI
} from '@/apis/product'
import { getSkuListByPidAPI, skuUpdateByPidAPI } from '@/apis/skuStock'
import { getProductAttributeListAPI } from '@/apis/productAttr'
import { getBrandListAPI } from '@/apis/brand'
import { getProductCategoryListWithChildrenAPI } from '@/apis/productCate'
import { Search, Tickets, Edit } from '@element-plus/icons-vue'
import type { PmsProduct, ProductQueryParam } from '@/types/product'
import type { ElCascaderDataVo, ElSelectDataVo } from '@/types/common'
import type { PmsSkuStock } from '@/types/skuStock'
import type { PmsProductAttribute } from '@/types/productAttr'

// 获取路由
const router = useRouter()

// 列表查询参数
const listQuery = ref<ProductQueryParam>({
  pageNum: 1,
  pageSize: 10
})
// 列表数据
const list = ref<PmsProduct[]>([])
// 总条数
const total = ref(0)
// 加载状态
const listLoading = ref(true)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getProductListAPI(listQuery.value)
    listLoading.value = false
    list.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    listLoading.value = false
    console.error(error)
  }
}
// 筛选搜索中的品牌数据
const brandOptions = ref<ElSelectDataVo[]>([])
// 获取品牌列表数据
const getBrandList = async () => {
  const res = await getBrandListAPI({ pageNum: 1, pageSize: 100 })
  brandOptions.value = res.data.list.map(item => ({ label: item.name, value: item.id!.toString() }))
}
// 筛选搜索中的商品分类数据
const productCateOptions = ref<ElCascaderDataVo[]>([])
// 筛选搜索中当前选中的商品分类，结构为：[父分类ID,分类ID]
const selectProductCateValue = ref([])
// 获取商品分类列表数据
const getProductCateList = async () => {
  const res = await getProductCategoryListWithChildrenAPI()
  const list = res.data
  productCateOptions.value = list.map(item => ({
    label: item.name,
    value: item.id!,
    children: item.children?.map(it => ({ label: it.name, value: it.id! }))
  }))
}
// 筛选搜索中的上下架状态
const publishStatusOptions = ref([
  {
    value: 1,
    label: '上架'
  },
  {
    value: 0,
    label: '下架'
  }
])
// 筛选搜索中的审核状态
const verifyStatusOptions = ref([
  {
    value: 1,
    label: '审核通过'
  },
  {
    value: 0,
    label: '未审核'
  }
])

// 监听改变，通过修改列表查询中的productCategoryId数据
watch(selectProductCateValue, (newValue) => {
  if (newValue != null && newValue.length == 2) {
    listQuery.value.productCategoryId = newValue[1]
  } else {
    listQuery.value.productCategoryId = undefined
  }
}, { immediate: true })

// 组件挂载后执行
onMounted(() => {
  getList()
  getBrandList()
  getProductCateList()
})

// 批量操作类型
const operates = ref([
  {
    label: "商品上架",
    value: "publishOn"
  },
  {
    label: "商品下架",
    value: "publishOff"
  },
  {
    label: "设为推荐",
    value: "recommendOn"
  },
  {
    label: "取消推荐",
    value: "recommendOff"
  },
  {
    label: "设为新品",
    value: "newOn"
  },
  {
    label: "取消新品",
    value: "newOff"
  },
  {
    label: "移入回收站",
    value: "recycle"
  },
  {
    label: "转移到分类",
    value: "transferCategory"
  }
])
// 当前批量操作
const operateType = ref<string>()
// 当前选中的条目
const multipleSelection = ref<PmsProduct[]>([])

// SKU库存弹框数据
const editSkuInfo = reactive({
  dialogVisible: false,
  productId: 0,
  productSn: '',
  productAttributeCategoryId: 0,
  stockList: [] as PmsSkuStock[],
  productAttr: [] as PmsProductAttribute[],
  keyword: undefined
})

// 从PmsSkuStock的spData中获取规格对应的值
const getProductSkuSp = (row: PmsSkuStock, index: number) => {
  const spData = JSON.parse(row.spData!)
  if (spData && index < spData.length) {
    return spData[index].value
  } else {
    return ''
  }
}

const handleShowSkuEditDialog = async (index: number, row: PmsProduct) => {
  editSkuInfo.dialogVisible = true
  editSkuInfo.productId = row.id!
  editSkuInfo.productSn = row.productSn
  editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId!
  editSkuInfo.keyword = undefined
  const resp = await getSkuListByPidAPI(row.id!, { keyword: editSkuInfo.keyword })
  editSkuInfo.stockList = resp.data
  if (row.productAttributeCategoryId) {
    const res2 = await getProductAttributeListAPI(row.productAttributeCategoryId, { pageNum: 1, pageSize: 10, type: 0 })
    editSkuInfo.productAttr = res2.data.list
  }
}

const handleSearchEditSku = async () => {
  const response = await getSkuListByPidAPI(editSkuInfo.productId, { keyword: editSkuInfo.keyword })
  editSkuInfo.stockList = response.data
}

const handleEditSkuConfirm = async () => {
  if (!editSkuInfo.stockList || editSkuInfo.stockList.length <= 0) {
    ElMessage({
      message: '暂无sku信息',
      type: 'warning',
      duration: 1000
    })
    return
  }
  await ElMessageBox.confirm('是否要进行修改', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await skuUpdateByPidAPI(editSkuInfo.productId, editSkuInfo.stockList)
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  })
  editSkuInfo.dialogVisible = false
}

const handleSearchList = () => {
  listQuery.value.pageNum = 1
  getList()
}

const handleAddProduct = () => {
  router.push({ path: '/pms/addProduct' })
}

const handleBatchOperate = async () => {
  if (!operateType.value) {
    ElMessage({
      message: '请选择操作类型',
      type: 'warning',
      duration: 1000
    })
    return
  }
  if (!multipleSelection.value || multipleSelection.value.length < 1) {
    ElMessage({
      message: '请选择要操作的商品',
      type: 'warning',
      duration: 1000
    })
    return
  }
  await ElMessageBox.confirm('是否要进行该批量操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  const ids = multipleSelection.value.map(item => item.id!)
  switch (operateType.value) {
    case operates.value[0]!.value:
      updatePublishStatus(1, ids)
      break
    case operates.value[1]!.value:
      updatePublishStatus(0, ids)
      break
    case operates.value[2]!.value:
      updateRecommendStatus(1, ids)
      break
    case operates.value[3]!.value:
      updateRecommendStatus(0, ids)
      break
    case operates.value[4]!.value:
      updateNewStatus(1, ids)
      break
    case operates.value[5]!.value:
      updateNewStatus(0, ids)
      break
    case operates.value[6]!.value:
      updateDeleteStatus(1, ids)
      break
    case operates.value[7]!.value:
      break
    default:
      break
  }
  getList()
}

const handleSizeChange = (val: number) => {
  listQuery.value.pageNum = 1
  listQuery.value.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  listQuery.value.pageNum = val
  getList()
}

const handleSelectionChange = (val: PmsProduct[]) => {
  multipleSelection.value = val
}

const handlePublishStatusChange = async (index: number, row: PmsProduct) => {
  await updatePublishStatus(row.publishStatus!, [row.id!])
}

const handleNewStatusChange = async (index: number, row: PmsProduct) => {
  await updateNewStatus(row.newStatus!, [row.id!])
}

const handleRecommendStatusChange = async (index: number, row: PmsProduct) => {
  await updateRecommendStatus(row.recommandStatus!, [row.id!])
}

const handleResetSearch = () => {
  selectProductCateValue.value = []
  listQuery.value = { pageNum: 1, pageSize: 10 }
}

const handleDelete = async (index: number, row: PmsProduct) => {
  updateDeleteStatus(1, [row.id!])
}

const handleUpdateProduct = (index: number, row: PmsProduct) => {
  router.push({ path: '/pms/updateProduct', query: { id: row.id } })
}

const handleShowProduct = (index: number, row: PmsProduct) => {
  console.log("handleShowProduct", row)
}

const handleShowVerifyDetail = (index: number, row: PmsProduct) => {
  console.log("handleShowVerifyDetail", row)
}

const handleShowLog = (index: number, row: PmsProduct) => {
  console.log("handleShowLog", row)
}

const updatePublishStatus = async (publishStatus: number, ids: number[]) => {
  await productUpdatePublishStatusAPI({ ids: ids.join(','), publishStatus: publishStatus })
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  })
}

const updateNewStatus = async (newStatus: number, ids: number[]) => {
  await productUpdateNewStatusAPI({ ids: ids.join(','), newStatus: newStatus })
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  })
}

const updateRecommendStatus = async (recommendStatus: number, ids: number[]) => {
  await productUpdateRecommendStatusAPI({ ids: ids.join(','), recommendStatus: recommendStatus })
  ElMessage({
    message: '修改成功',
    type: 'success',
    duration: 1000
  })
}

const updateDeleteStatus = async (deleteStatus: number, ids: number[]) => {
  await productUpdateDeleteStatusAPI({ ids: ids.join(','), deleteStatus: deleteStatus })
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 1000
  })
  getList()
}

// 过滤器函数
const verifyStatusFilter = (value: number) => {
  if (value === 1) {
    return '审核通过'
  } else {
    return '未审核'
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
        <el-button style="float: right" @click="handleSearchList()" type="primary">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 20px">
        <el-form :inline="true" :model="listQuery" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable v-model="selectProductCateValue" :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable style="width: 203px;">
              <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable style="width: 203px;">
              <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable style="width: 203px;">
              <el-option v-for="item in verifyStatusOptions" :key="item.value" :label="item.label" :value="item.value">
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
      <el-button class="btn-add" @click="handleAddProduct()">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template #default="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template #default="scope">
            <p>{{ scope.row.name }}</p>
            <p>品牌：{{ scope.row.brandName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template #default="scope">
            <p>价格：￥{{ scope.row.price }}</p>
            <p>货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template #default="scope">
            <p style="margin: 6px 0px;">上架：
              <el-switch @change="handlePublishStatusChange(scope.$index, scope.row)" :active-value="1"
                :inactive-value="0" v-model="scope.row.publishStatus">
              </el-switch>
            </p>
            <p style="margin: 6px 0px;">新品：
              <el-switch @change="handleNewStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
                v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p style="margin: 6px 0px;">推荐：
              <el-switch @change="handleRecommendStatusChange(scope.$index, scope.row)" :active-value="1"
                :inactive-value="0" v-model="scope.row.recommandStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" size="large"
              @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template #default="scope">{{ scope.row.sale }}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template #default="scope">
            <p>{{ verifyStatusFilter(scope.row.verifyStatus) }}</p>
            <p>
              <el-button type="primary" link @click="handleShowVerifyDetail(scope.$index, scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <p>
              <el-button size="small" @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button size="small" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button size="small" @click="handleShowLog(scope.$index, scope.row)">日志
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
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
    <el-dialog title="编辑货品信息" v-model="editSkuInfo.dialogVisible" width="40%">
      <span>商品货号：</span>
      <span>{{ editSkuInfo.productSn }}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" style="width: 60%;margin-left: 20px">
        <template #append>
          <el-button :icon="Search" @click="handleSearchEditSku"></el-button>
        </template>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in editSkuInfo.productAttr" :label="item.name" :key="item.id"
          align="center">
          <template #default="scope">
            {{ getProductSkuSp(scope.row, index) }}
          </template>
        </el-table-column>
        <el-table-column label="销售价格" width="80" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" width="80" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存预警值" width="100" align="center">
          <template #default="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style></style>
