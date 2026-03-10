<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { str2Date } from '@/utils/datetime'
import img_home_order from '@/assets/images/home_order.png'
import img_home_today_amount from '@/assets/images/home_today_amount.png'
import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import VChart from 'vue-echarts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'

// 通过use()方法按需注入ECharts的模块
use([
  CanvasRenderer, // 画布渲染器
  LineChart, // 折线图的绘制功能
  GridComponent, // 直角坐标系网格组件
  TooltipComponent, // 鼠标悬停时显示数据详情
  LegendComponent,  // 图例组件
  TitleComponent // 显示图表标题
])

// 折线图数据类型
type LineChartDataItem = {
  date: string, // 交易日期
  orderCount: number, // 订单数量
  orderAmount: number // 订单金额
}

// 默认图表数据
const defaultLineChartData: LineChartDataItem[] = [
  { date: '2026-01-01', orderCount: 10, orderAmount: 1093 },
  { date: '2026-01-02', orderCount: 20, orderAmount: 2230 },
  { date: '2026-01-03', orderCount: 33, orderAmount: 3623 },
  { date: '2026-01-04', orderCount: 50, orderAmount: 6423 },
  { date: '2026-01-05', orderCount: 80, orderAmount: 8492 },
  { date: '2026-01-06', orderCount: 60, orderAmount: 6293 },
  { date: '2026-01-07', orderCount: 20, orderAmount: 2293 },
  { date: '2026-01-08', orderCount: 60, orderAmount: 6293 },
  { date: '2026-01-09', orderCount: 50, orderAmount: 5293 },
  { date: '2026-01-10', orderCount: 30, orderAmount: 3293 },
  { date: '2026-01-11', orderCount: 20, orderAmount: 2293 },
  { date: '2026-01-12', orderCount: 80, orderAmount: 8293 },
  { date: '2026-01-13', orderCount: 100, orderAmount: 10293 },
  { date: '2026-01-14', orderCount: 10, orderAmount: 1293 },
  { date: '2026-01-15', orderCount: 40, orderAmount: 4293 }
]

// 默认起始日期
const defaultStartDate = new Date(2026, 0, 1)

// 日期选择器日期范围[start,end]
const datePickerRange = ref<Date[]>([])
// 初始化日期选择器数据
const initDatePickerRange = () => {
  const start = defaultStartDate
  const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 7)
  datePickerRange.value = [start, end] as Date[]
}
// 图表数据
const lineChartData = ref<LineChartDataItem[]>([])
// 图表数据加载状态
const loading = ref(false)
// 获取图表数据
const getLineChartData = () => {
  loading.value = true
  setTimeout(() => {
    const start = datePickerRange.value[0]
    const end = datePickerRange.value[1]
    // 获取在当前区间范围内的数据
    lineChartData.value = defaultLineChartData.filter(item => {
      const currDate = str2Date(item.date)
      return currDate!.getTime() >= start!.getTime() && currDate!.getTime() <= end!.getTime()
    })
    loading.value = false
  }, 1000)
}

// 组件挂载成功初始化数据
onMounted(() => {
  initDatePickerRange()
  getLineChartData()
})

// 日期选择器选项
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const start = defaultStartDate
      const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一月',
    value: () => {
      const start = defaultStartDate
      const end = new Date(start.getTime() + 1000 * 60 * 60 * 24 * 30)
      return [start, end]
    }
  }
]
// 处理日期范围变化
const handleDatePickerRangeChange = () => {
  getLineChartData()
}

// X 轴：日期（2026-01-01 到 2026-01-15）
// 左 Y 轴：订单数量（0-100）
// 右 Y 轴：订单金额（0-10000+）
// 蓝色曲线：订单数量趋势（带填充）
// 绿色曲线：订单金额趋势（带填充）
// 鼠标悬停：显示交叉线和详细数据
// vue-charts中的选项
const chartOption = computed(() => {
  const dates = lineChartData.value.map(item => item.date)
  const orderCounts = lineChartData.value.map(item => item.orderCount)
  const orderAmounts = lineChartData.value.map(item => item.orderAmount)
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        formatter: '{value}',
        rotate: 0
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数量',
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '订单金额',
        position: 'right',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '订单数量',
        type: 'line',
        areaStyle: {},
        data: orderCounts,
        smooth: true,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '订单金额',
        type: 'line',
        yAxisIndex: 1,
        areaStyle: {},
        data: orderAmounts,
        smooth: true,
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
})
</script>

<template>
  <div class="app-container">
    <div class="address-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">Spring Boot项目学习</div>
            <div class="color-main address-content">
              <a href="https://www.macrozheng.com" target="_blank">mall学习教程</a>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">Spring Cloud项目学习</div>
            <div class="color-main address-content">
              <a href="https://cloud.macrozheng.com" target="_blank">mall-swarm学习教程</a>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="out-border">
            <div class="layout-title">点Star支持项目</div>
            <div class="color-main address-content">
              <a href="https://github.com/macrozheng/mall" target="_blank">mall项目</a>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日订单总数</div>
            <div class="total-value">200</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日销售总额</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">昨日销售总额</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-card class="mine-layout">
      <div style="text-align: center">
        <img width="140px" height="140px"
          src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/banner/qrcode_for_macrozheng_258.jpg">
      </div>
      <div style="text-align: center">扫码关注作者<span class="color-main">公众号</span></div>
      <div style="text-align: center;margin-top: 5px">获取更多技术干货</div>
    </el-card>
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待确认收货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">新缺货登记</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退款申请</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已发货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退货订单</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">广告位即将到期</span>
              <span style="float: right" class="color-danger">(10)</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">400</el-col>
                <el-col :span="6" class="color-danger overview-item-value">50</el-col>
                <el-col :span="6" class="color-danger overview-item-value">500</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">库存紧张</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">200</el-col>
                <el-col :span="6" class="color-danger overview-item-value">1000</el-col>
                <el-col :span="6" class="color-danger overview-item-value">5000</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">10000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">1000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本月销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">100000</div>
              <div>
                <span class="color-success" style="font-size: 14px">+10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">50000</div>
              <div>
                <span class="color-danger" style="font-size: 14px">-10%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker style="float: right;z-index: 1" size="small" v-model="datePickerRange" type="daterange"
              align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              :shortcuts="shortcuts" @change="handleDatePickerRangeChange">
            </el-date-picker>
            <div style="height: 400px;">
              <v-chart v-if="!loading" :option="chartOption" autoresize />
              <div v-else
                style="display: flex; justify-content: center; align-items: center; height: 100%;width: 100%;">
                <el-skeleton :rows="5" animated />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #DCDFE6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  color: #409EFF;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #F2F6FC;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #EBEEF5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #DCDFE6;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}

.address-content {
  padding: 20px;
  font-size: 18px
}
</style>
