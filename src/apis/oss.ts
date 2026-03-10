import type { OssPolicyResult } from '@/types/oss'
import http from '@/utils/http'

/**
 * Oss上传签名生成
 */
export function ossPolicyAPI() {
  return http<OssPolicyResult>({
    url: '/aliyun/oss/policy',
    method: 'get',
  })
}
