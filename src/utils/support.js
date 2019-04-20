import Cookies from "js-cookie";
const SupportKey='supportKey';
export const SupportUrl='https://coding.net/?utm_source=macrozheng&utm_medium=banner&utm_campaign=march2019';
export function getSupport() {
  return Cookies.get(SupportKey)
}

export function setSupport(isSupport) {
  return Cookies.set(SupportKey, isSupport,{ expires: 3 })
}
