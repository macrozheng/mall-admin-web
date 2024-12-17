<template>
  <div class="room-mgs">
    <div class="top">
      <div class="content">
        <span
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(index)"
          :class="{ 'active': selectedIndex === index }"
        >
          {{ item }}
        </span>
      </div>
    </div>
    <div class="main">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import ConfigInfo from './ConfigInfo.vue';
import DatabaseCapability from './DatabaseCapability.vue';
import InstitutionCapability from './InstitutionCapability.vue';
// import RoomSurgery from './RoomSurgery.vue';
import WardManage from './room-ward/WardManage.vue';
import PharmacyConfiguration from './PharmacyConfiguration.vue';
export default {
  components: {
    ConfigInfo,
    DatabaseCapability,
    InstitutionCapability,
    // RoomSurgery,
    WardManage,
    PharmacyConfiguration
  },
  data() {
    return {
      selectedIndex: 0,
      items: [
        '配置信息',
        '数据库能力',
        '机构能力',
        '病房/手术室',
        '配置分药房'
      ],
      components: [
        'ConfigInfo',
        'DatabaseCapability',
        'InstitutionCapability',
        // 'RoomSurgery',
        'WardManage',
        'PharmacyConfiguration'
      ]
    }
  },
  computed: {
    currentComponent() {
      // if (this.selectedIndex !== null) {
        return this.components[this.selectedIndex];
      // }
      // return 'ConfigInfo'; // 默认显示第一个组件
    }
  },
  methods: {
    selectItem(index) {
      this.selectedIndex = index;
    }
  },
  mounted() {
    this.selectItem(0); // 在组件挂载时默认选中第一个
  }
}
</script>

<style lang="scss" scoped>
.room-mgs {
  background-color: #dacece;
  .top {
    display: flex;
    align-items: center;
    height: 40px;
    background-color: #ffffff;
    color: #2e7256;
    .content {
      width: 45%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-radius: 30px;
      background-color: #d7d7d7;
      span {
        width: 20%;
        height: 33px;
        line-height: 33px;
        text-align: center;
        border-radius: 30px;
        transition: background-color 0.3s; /* 平滑过渡效果 */
        cursor: pointer;
        &.active {
          color: #fff;
          font-weight: bold;
          background-color: #2e7256; /* 点击后的背景颜色 */
        }
        &:hover {
          color: #fff;
          font-weight: bold;
          background-color: #2e7256; /* 鼠标悬浮时的背景颜色 */
        }
      }
    }
  }
}
</style>