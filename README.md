# mall-admin-web

<p>
  <a href="#公众号"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E5%85%AC%E4%BC%97%E5%8F%B7-macrozheng-blue.svg" alt="公众号"></a>
  <a href="#公众号"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E4%BA%A4%E6%B5%81-%E5%BE%AE%E4%BF%A1%E7%BE%A4-2BA245.svg" alt="交流"></a>
  <a href="https://github.com/macrozheng/mall"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E5%90%8E%E5%8F%B0%E9%A1%B9%E7%9B%AE-mall-blue.svg" alt="后台项目"></a>
  <a href="https://github.com/macrozheng/mall-swarm"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/Cloud%E7%89%88%E6%9C%AC-mall--swarm-brightgreen.svg" alt="SpringCloud版本"></a>
  <a href="https://gitee.com/macrozheng/mall-admin-web"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E7%A0%81%E4%BA%91-%E9%A1%B9%E7%9B%AE%E5%9C%B0%E5%9D%80-orange.svg" alt="码云"></a>
</p>

## 友情提示

> 1. **快速体验项目**：[在线访问地址](https://www.macrozheng.com/admin/index.html) 。
> 2. **全套学习教程**：[《mall学习教程》](https://www.macrozheng.com) 。
> 3. **分支说明**：`master`分支基于Vue3+Element-Plus，`dev-v2`分支基于Vue2+Element。

## 前言

该项目为前后端分离项目的前端部分，后端项目`mall`地址：[传送门](https://github.com/macrozheng/mall) 。

## 项目介绍

`mall-admin-web`是一个电商后台管理系统的前端项目，基于Vue3+Element-Plus实现。主要包括商品管理、订单管理、会员管理、促销管理、运营管理、内容管理、统计报表、财务管理、权限管理、设置等功能。

### 项目演示

项目在线演示地址：[https://www.macrozheng.com/admin/](https://www.macrozheng.com/admin/)

![后台管理系统功能演示](http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/project/mall_admin_show.png)

### 技术选型

| 技术                        | 说明                  | 官网                                                    |
| --------------------------- | --------------------- | ------------------------------------------------------- |
| Vue                         | 前端框架              | https://cn.vuejs.org/                                   |
| Element Plus                | 前端UI框架            | https://element-plus.org/                               |
| Vue Router                  | 路由框架              | https://router.vuejs.org/                               |
| Pinia                       | 全局状态管理框架      | https://pinia.vuejs.org/                                |
| Pinia Plugin Persistedstate | Pinia持久化插件       | https://prazdevs.github.io/pinia-plugin-persistedstate/ |
| Axios                       | 前端HTTP框架          | https://github.com/axios/axios                          |
| vue-charts                  | 基于Echarts的图表框架 | https://github.com/ecomfe/vue-echarts                   |
| TinyMCE Vue                 | 富文本编辑器          | https://github.com/tinymce/tinymce-vue                  |
| Js-cookie                   | cookie管理工具        | https://github.com/js-cookie/js-cookie                  |
| vue-element-admin           | 项目脚手架            | https://github.com/PanJiaChen/vue-element-admin         |

### 项目布局

```lua
src -- 源码目录
├── apis -- axios网络请求接口定义
├── assets -- 静态图片资源文件
├── components -- 通用组件封装
├── icons -- svg矢量图片文件
├── router -- vue-router路由配置
├── store -- pinia的状态管理
├── styles -- 全局css样式
├── types -- 类型定义
├── utils -- 工具类
└── views -- 前端页面
    ├── home -- 首页
    ├── layout -- 通用页面框架
    ├── normal -- 常用页面（login和404）
    ├── oms -- 订单模块页面
    ├── pms -- 商品模块页面
    ├── sms -- 商品模块页面
    └── ums -- 用户模块页面
```

## 搭建步骤

- 下载node并安装，支持v20以上版本（建议下载v20 LTS版本）：https://nodejs.org/zh-cn/download/archive/v20.20.0
- 该项目为前后端分离项目，访问本地访问接口需搭建后台环境，搭建请参考后端项目[传送门](https://github.com/macrozheng/mall);
- 访问在线接口无需搭建后台环境，只需将`.env.development`文件中的`VITE_BASE_SERVER_URL`改为[https://admin-api.macrozheng.com](https://admin-api.macrozheng.com)即可;
- 如果你对接的是[mall-swarm](https://github.com/macrozheng/mall-swarm) 微服务后台的话，所有接口都需要通过网关访问，需要将`.env.development`文件中的`VITE_BASE_SERVER_URL`改为[http://localhost:8201/mall-admin](http://localhost:8201/mall-admin) ；
- 克隆源代码到本地，使用VSCode打开，并完成编译;
- 在命令行中运行命令：`npm install`,下载相关依赖;
- 在命令行中运行命令：`npm run dev`,运行项目;
- 访问地址：[http://localhost:5173](http://localhost:5173)即可打开后台管理系统页面;
- 具体部署过程请参考：[mall前端项目的安装与部署](https://www.macrozheng.com/mall/deploy/mall_deploy_web.html)
- 前端自动化部署请参考：[使用Jenkins一键打包部署前端应用，就是这么6！](https://www.macrozheng.com/mall/reference/jenkins_vue.html)

## 公众号

加微信群交流，公众号后台回复「**加群**」即可。

![公众号图片](http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/banner/qrcode_for_macrozheng_258.jpg)

## 许可证

[Apache License 2.0](https://github.com/macrozheng/mall-admin-web/blob/master/LICENSE)

Copyright (c) 2018-2026 macrozheng
