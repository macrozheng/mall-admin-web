import type { UmsMenu } from './menu'

/** 登录请求参数 */
export type LoginParam = {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/** 登录返回结果 */
export type LoginResult = {
  /** token的前缀 */
  tokenHead: string
  /** 登录的token */
  token: string
}

/** 用户信息结果封装 */
export type UserInfoResult = {
  /** 用户名 */
  username: string
  /** 头像 */
  icon: string
  /** 菜单 */
  menus: UmsMenu[]
  /** 角色 */
  roles: []
}

/** 用户信息（store中存储的） */
export type UserInfo = Pick<UserInfoResult, 'username' | 'menus' | 'roles'> & {
  /** 密码 */
  password: string
  /** 登录token */
  token: string
  /** 头像 */
  avatar
}

/** 管理员信息 */
export type UmsAdmin = {
  /** ID */
  id?: number
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 头像 */
  icon?: string
  /** 邮箱 */
  email?: string
  /** 昵称 */
  nickName?: string
  /** 备注信息 */
  note?: string
  /** 创建时间 */
  createTime?: string
  /** 最后登录时间 */
  loginTime?: string
  /** 帐号启用状态：0->禁用；1->启用 */
  status: number
}
