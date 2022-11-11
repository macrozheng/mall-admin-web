<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">

          <!-- <router-view :key="key"></router-view> -->
          <router-view></router-view>


    </transition>
  </section>
</template>

<script>

export default {
  name: 'AppMain',

  data() {
    return {
      activeIndex: "",

      editableTabsValue: '2',
      editableTabs: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content'
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content'
      }],
      tabIndex: 2
    }
  },

  computed: {
    openTab() {
      return this.$store.state.openTab
    },
    activeIndexTab: {
      get() {
        return this.$store.state.activeIndexTab
      },
      set(val) {
        this.$store.commit('set_active_index', val)
      }
    },
  },
  watch: {
    '$route'(val) {
      let flag = false
      this.openTab.forEach(tab => {
        if (val.path == tab.name) {
          this.$store.commit('set_active_index', val.path)
          flag = true
          return
        }
      })
      if (!flag) {
        this.$store.commit('add_tabs', {name: val.path, title: val.meta.title})
        this.$store.commit('set_active_index', val.path)
      }
    }
  },
  mounted() {
    this.$store.commit('add_tabs', {name: this.$route.path, title: this.$route.meta.title})
    this.$store.commit('set_active_index', this.$route.path)
  },
  methods: {
    addTab(targetName)
    {
      let newTabName = ++this.tabIndex + '';
      this.openTab.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content'
      });
      this.editableTabsValue = newTabName;
    }
  ,
    clickTab(tab)
    {
      this.$router.push({path: this.activeIndexTab})
    }
  ,
    removeTab(target)
    { //target当前被点击的name属性
      if (this.openTab.length == 1) {
        return
      }
      this.$store.commit('delete_tabs', target)
      if (this.activeIndexTab === target) {
        // 设置当前激活的路由
        if (this.openTab && this.openTab.length >= 1) {
          this.$store.commit('set_active_index', this.openTab[this.openTab.length - 1].name)
          this.$router.push({path: this.activeIndexTab})
        }
      }
    }
  ,
    //设置高亮tab
    set_active_index(state, index)
    {
      state.activeIndexTab = index
    }
  ,
  }
}
</script>
