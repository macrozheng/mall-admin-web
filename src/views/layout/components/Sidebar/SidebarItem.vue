<template>
  <!--路由属性不是隐藏，并且有子元素存在-->
  <div v-if="!item.hidden&&item.children" class="menu-wrapper">
    <!--只有一个子元素或者没有子元素时候是一个item-->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon||item.meta.icon" :title="(onlyOneChild.meta.title)" />
        </el-menu-item>
      </app-link>
    </template>
    <!--有多个子元素的时候-->
    <el-submenu v-else ref="submenu" :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="(item.meta.title)" />
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children&&child.children.length>0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu" />

        <app-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)">
            <item v-if="child.meta" :icon="child.meta.icon" :title="(child.meta.title)" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>

  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasOneShowingChild(children, parent) {
      // 查看是否有children 
      // console.log('children',children)
      // 将所有的子元素遍历出来
      const showingChildren = children.filter(item => {
        // 如果 children hidden为true 说明子元素不显示，否则展示元素

        if (item.hidden) {
          // showingChildren=[]
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          // 如果有子元素，将子元素赋值给tmp onlyOneChild
          this.onlyOneChild = item
          return true
        }
      })
      console.log('showingChildren',showingChildren)

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        // console.log('parent',parent)
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      console.log('---',routePath)
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    }
  }
}
</script>
