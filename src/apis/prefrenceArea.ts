import type { CmsPrefrenceArea } from '@/types/prefrenceArea'
import http from '@/utils/http'

/**
 * 获取所有商品优选
 */
export function getPrefrenceAreaListAllAPI() {
  return http<CmsPrefrenceArea[]>({
    url: '/prefrenceArea/listAll',
    method: 'get',
  })
}
