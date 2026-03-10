import type { OmsCompanyAddress } from '@/types/companyAddress'
import http from '@/utils/http'

/**
 * 获取所有收货地址
 */
export function getCompanyAddressListAPI() {
  return http<OmsCompanyAddress[]>({
    url: '/companyAddress/list',
    method: 'get',
  })
}
