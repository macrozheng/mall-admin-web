import Cookies from 'js-cookie'

// 设置cookie
export function setCookie(key: string, value: string, expires: number) {
  return Cookies.set(key, value, { expires: expires })
}

// 获取cookie
export function getCookie(key: string) {
  return Cookies.get(key)
}
