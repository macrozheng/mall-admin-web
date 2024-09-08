<template>
  <div class="menu-wrapper">
    <!-- 遍历所有路由 -->
    <template v-for="item in routes" v-if="!item.hidden && item.children">

      <!-- 如果想让只有一个子菜单的情况下,子菜单的级别会变成一级菜单,只需要将下述代码注释去除即可 -->
      
      <!-- <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name"> -->

        <!--  如果想让只有一个子菜单的情况下,子菜单的级别会变成一级菜单, 该句需注释 -->
      
      <!-- 渲染子菜单 -->
      <el-submenu :index="item.name || item.path" :key="item.name">
        <template slot="title">
          <!-- 如果当前项有图标，则显示图标 -->
          <svg-icon v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <!-- 显示菜单标题 -->
          <span v-if="item.meta && item.meta.title" slot="title">{{ item.meta.title }}</span>
        </template>

        <!-- 遍历子项 -->
        <template v-for="child in item.children" v-if="!child.hidden">
          <!-- 如果子项还有子项，则递归调用 SidebarItem 组件 -->
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children && child.children.length > 0" :routes="[child]" :key="child.path"></sidebar-item>
          <!-- 支持外链功能 -->
          <a v-else-if="child.path.startsWith('http')" v-bind:href="child.path" target="_blank" :key="child.name">
            <el-menu-item :index="item.path + '/' + child.path">
              <!-- 如果子项有图标，则显示图标 -->
              <svg-icon v-if="child.meta && child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <!-- 显示子菜单标题 -->
              <span v-if="child.meta && child.meta.title" slot="title">{{ child.meta.title }}</span>
            </el-menu-item>
          </a>
          <!-- 内部链接 -->
          <router-link v-else :to="item.path + '/' + child.path" :key="child.name">
            <el-menu-item :index="item.path + '/' + child.path">
              <!-- 如果子项有图标，则显示图标 -->
              <svg-icon v-if="child.meta && child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <!-- 显示子菜单标题 -->
              <span v-if="child.meta && child.meta.title" slot="title">{{ child.meta.title }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  // 判断子项中是否有唯一未隐藏的子项
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>
