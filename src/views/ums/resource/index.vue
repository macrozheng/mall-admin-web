<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Tickets } from '@element-plus/icons-vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { getResourceListAPI, resourceCreateAPI, resourceUpdateAPI, resourceDeleteByIdAPI } from '@/apis/resource'
import { resourceCategoryListAllAPI } from '@/apis/resourceCategory'
import type { ResourceQueryParam, UmsResource } from '@/types/resource'

// 获取路由信息
const router = useRouter()

// 列表查询参数
const listQuery = ref<ResourceQueryParam>({
  pageNum: 1,
  pageSize: 10,
})
// 资源列表数据
const list = ref<UmsResource[]>([])
// 分页总数
const total = ref<number>(0)
// 加载状态
const listLoading = ref(false)
// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const res = await getResourceListAPI(listQuery.value)
    listLoading.value = false
    list.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    listLoading.value = false
    console.error('获取资源列表失败:', error)
  }
}

// 分类筛选选项
const categoryOptions = ref<{ label: string; value: number }[]>([])
// 默认选择分类ID
const defaultCategoryId = ref<number>()
// 获取分类列表
const getCateList = async () => {
  try {
    const res = await resourceCategoryListAllAPI()
    const cateList = res.data
    cateList.forEach(item => {
      categoryOptions.value.push({ label: item.name, value: item.id! })
    })
    if (cateList && cateList.length > 0) {
      defaultCategoryId.value = cateList[0]!.id
    }
  } catch (error) {
    console.error('获取资源分类失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
  getCateList()
})

// 默认资源对象
const defaultResource: UmsResource = {
  name: '',
  url: '',
  description: '',
  categoryId: 0
}
// 当前操作资源
const resource = ref(Object.assign({}, defaultResource))
// 编辑弹框是否可见
const dialogVisible = ref(false)
// 是否为编辑状态
const isEdit = ref(false)

// 重置搜索条件
const handleResetSearch = () => {
  listQuery.value = {
    pageNum: 1,
    pageSize: 10,
  }
}

// 搜索列表
const handleSearchList = () => {
  listQuery.value.pageNum = 1
  getList()
}

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

// 添加资源
const handleAdd = () => {
  dialogVisible.value = true
  isEdit.value = false
  resource.value = Object.assign({}, defaultResource)
  if (defaultCategoryId.value) {
    resource.value.categoryId = defaultCategoryId.value
  }
}

// 删除资源
const handleDelete = async (index: number, row: UmsResource) => {
  await ElMessageBox.confirm('是否要删除该资源?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    await resourceDeleteByIdAPI(row.id!)
    ElMessage.success('删除成功!')
    getList()
  } catch (error) {
    console.error('删除资源失败:', error)
  }
}

// 更新资源
const handleUpdate = (index: number, row: UmsResource) => {
  dialogVisible.value = true
  isEdit.value = true
  resource.value = Object.assign({}, row)
}

// 处理对话框确认
const handleDialogConfirm = async () => {
  await ElMessageBox.confirm('是否要确认?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  try {
    if (isEdit.value) {
      await resourceUpdateAPI(resource.value.id!, resource.value)
      ElMessage.success('修改成功！')
      dialogVisible.value = false
      getList()
    } else {
      await resourceCreateAPI(resource.value)
      ElMessage.success('添加成功！')
      dialogVisible.value = false
      getList()
    }
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 显示资源分类
const handleShowCategory = () => {
  router.push({ path: '/ums/resourceCategory' })
}

// 日期格式化过滤器函数
const formatDateTime = (time: string) => {
  if (!time) {
    return 'N/A'
  }
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
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
        <el-button style="float:right" type="primary" @click="handleSearchList()">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" label-width="140px">
          <el-form-item label="资源名称：">
            <el-input v-model="listQuery.nameKeyword" class="input-width" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径：">
            <el-input v-model="listQuery.urlKeyword" class="input-width" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类：">
            <el-select v-model="listQuery.categoryId" placeholder="全部" clearable class="input-width"
              style="width: 150px;">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <el-icon class="el-icon-middle">
        <tickets />
      </el-icon>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
      <el-button class="btn-add" @click="handleShowCategory()">资源分类</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="resourceTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="资源名称" align="center">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="资源路径" align="center">
          <template #default="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template #default="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template #default="scope">{{ formatDateTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleUpdate(scope.$index, scope.row)">
              编辑
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
        :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit ? '编辑资源' : '添加资源'" v-model="dialogVisible" width="40%">
      <el-form :model="resource" ref="resourceForm" label-width="150px">
        <el-form-item label="资源名称：">
          <el-input v-model="resource.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="资源路径：">
          <el-input v-model="resource.url" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="资源分类：">
          <el-select v-model="resource.categoryId" placeholder="全部" clearable style="width: 250px">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="resource.description" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDialogConfirm()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style></style>
