import type { PmsBrand } from '@/types/brand'
import type { CommonPage, PageParam } from '@/types/common'
import http from '@/utils/http'

/**
 * 根据品牌名称分页获取品牌列表
 */
export function getBrandListAPI(params: PageParam) {
  return http<CommonPage<PmsBrand>>({
    url: '/brand/list',
    method: 'get',
    params: params,
  })
}

/**
 * 添加品牌
 */
export function createBrandAPI(data: PmsBrand) {
  return http({
    url: '/brand/create',
    method: 'post',
    data: data,
  })
}

/**
 * 批量更新显示状态
 */
export function brandUpdateShowStatusAPI(params: { ids: string; showStatus: number }) {
  return http({
    url: '/brand/update/showStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 批量更新厂家制造商状态
 */
export function brandUpdateFactoryStatusAPI(params: { ids: string; factoryStatus: number }) {
  return http({
    url: '/brand/update/factoryStatus',
    method: 'post',
    params: params,
  })
}

/**
 * 根据品牌ID删除品牌
 */
export function brandDeleteByIdAPI(id: number) {
  return http({
    url: '/brand/delete/' + id,
    method: 'get',
  })
}

/**
 * 根据ID获取品牌详情
 */
export function getBrandAPI(id: number) {
  return http<PmsBrand>({
    url: '/brand/' + id,
    method: 'get',
  })
}

/**
 * 根据品牌ID修改品牌信息
 */
export function updateBrandAPI(id: number, data: PmsBrand) {
  return http({
    url: '/brand/update/' + id,
    method: 'post',
    data: data,
  })
}
