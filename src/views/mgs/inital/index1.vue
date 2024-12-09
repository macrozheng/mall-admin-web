<template>
  <div class="ward-management">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="tab.value">
        <template v-if="tab.value === 'ward'">
          <el-button type="success" @click="addWard" class="mb-4">
            增建病房
          </el-button>
          
          <el-row :gutter="20">
            <el-col :span="8" v-for="ward in wards" :key="ward.id" class="mb-4">
              <el-card>
                <div slot="header" class="card-header">
                  <span>收容{{ ward.id }}</span>
                  <span class="bed-info">
                    (启用床位 {{ ward.activeBeds }} 张 / 最大床位 {{ ward.maxBeds }} 张)
                  </span>
                  <div>
                    <el-button type="text" icon="el-icon-edit"></el-button>
                    <el-button type="text" icon="el-icon-close"></el-button>
                  </div>
                </div>
                <el-table :data="ward.beds" :show-header="false" size="mini">
                  <el-table-column prop="id" width="120">
                    <template slot-scope="scope">
                      <span>{{ scope.row.id }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="80" align="right">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.occupied"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'ward',
      tabs: [
        { value: 'config', label: '配置信息' },
        { value: 'database', label: '数据库管理' },
        { value: 'org', label: '机构能力' },
        { value: 'ward', label: '病房/手术室' },
        { value: 'distribution', label: '配置分诊房' },
      ],
      wards: [
        {
          id: '1',
          activeBeds: 13,
          maxBeds: 16,
          beds: this.createBeds(1, 16)
        },
        {
          id: '2',
          activeBeds: 13,
          maxBeds: 16,
          beds: this.createBeds(2, 16)
        },
        {
          id: '3',
          activeBeds: 13,
          maxBeds: 14,
          beds: this.createBeds(3, 14)
        }
      ]
    }
  },
  methods: {
    createBeds(wardId, count) {
      return Array.from({ length: count }, (_, i) => ({
        id: `收容${wardId}-${String(i + 1).padStart(2, '0')}`,
        occupied: Math.random() > 0.3
      }))
    },
    addWard() {
      const newWardId = this.wards.length + 1
      this.wards.push({
        id: newWardId.toString(),
        activeBeds: 13,
        maxBeds: 16,
        beds: this.createBeds(newWardId, 16)
      })
      this.$message({
        message: '新病房已添加',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.ward-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bed-info {
  font-size: 12px;
  color: #909399;
}

.el-card {
  margin-bottom: 20px;
}

.el-table {
  margin-top: 10px;
}
</style>