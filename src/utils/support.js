import Cookies from "js-cookie";
const SupportKey='supportKey';
export function getSupport() {
  return Cookies.get(SupportKey)
}

export function setSupport(isSupport) {
  return Cookies.set(SupportKey, isSupport,{ expires: 3 })
}
