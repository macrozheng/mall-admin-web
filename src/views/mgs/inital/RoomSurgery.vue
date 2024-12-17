<template>
  <div class="room-surgery">
    <div class="left">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab"
        @click="selectedTab(index)"
        :class="{ 'active': selectedIndex === index }"
      >
        {{ tab }}
      </div>
    </div>
    <div class="right">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>
<script>
import RoomManage from './room-surgery/RoomManage.vue';
import SurgeryManage from './room-surgery/SurgeryManage.vue';
// import WardManage from './room-ward/WardManage.vue';
export default {
  components: {
    RoomManage,
    SurgeryManage,
    // WardManage,
  },
  data() {
    return {
      tabs: ["收容", "重症", "传染病", "手术"],
      components: [
        'RoomManage',
        'SurgeryManage',
        // 'WardManage',
      ],
      selectedIndex: 0, // 默认选中的标签
    };
  },
  computed: {
    currentComponent() {
      return this.components[this.selectedIndex];
    }
  },
  methods: {
    selectedTab(index) {
      this.selectedIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.room-surgery {
  display: flex;

  margin-top: 4px;
  .left {
    padding-top: 2px;
    width: 40px;
    background-color: #43bcd2;
    .tab {
      margin-top: 6px;
      height: 80px;
      background: #d7d7d7;
      font-size: 16px;
      color: #000;
      //文本方向;
      writing-mode: vertical-lr;
      //文字居中
      text-align: center;
      line-height: 40px;
      // 字符间距
      letter-spacing: 3px;
      //左上和左下设置border-radius
      border-radius: 6px 0 0 6px;
      cursor: pointer; // 添加鼠标指针样式
      transition: all 0.3s ease;
      &:hover {
        color: #fff;
        font-weight: bold;
        background: #2e7256;
      }
      &.active {
        color: #fff;
        font-weight: bold;
        background: #2e7256;
      }
    }
  }
  .right {
    flex-grow: 1; // 使右侧内容占据剩余空间
    background-color: #59d54b;
  }
}
</style>