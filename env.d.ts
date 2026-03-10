/// <reference types="vite/client" />
/** 扩展import.meta.env对象类型，配置.env文件中的环境变量 */
interface ImportMetaEnv {
  /** 后端API基础路径 */
  readonly VITE_BASE_SERVER_URL: string
  /** 是否使用OSS对象存储 */
  readonly VITE_USE_OSS: string
  /** OSS上传路径 */
  readonly VITE_OSS_UPLOAD_URL: string
  /** Minio上传相对路径 */
  readonly VITE_MINIO_UPLOAD_URL: string
}
/** 扩展import.meta对象类型 */
interface ImportMeta {
  readonly env: ImportMetaEnv
}
