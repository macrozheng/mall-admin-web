// date.js
export function formatDate(date, fmt) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date in formatDate:', date);
    return '';
  }
  
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, 
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).slice(-2);
}

export function str2Date(dateStr, separator = '-') {
  if (!dateStr || typeof dateStr !== 'string') {
    console.warn('Invalid dateStr in str2Date:', dateStr);
    return new Date(NaN);
  }
  
  const dateArr = dateStr.split(separator);
  if (dateArr.length < 3) {
    console.warn('Invalid date format in str2Date:', dateStr);
    return new Date(NaN);
  }
  
  const year = parseInt(dateArr[0], 10);
  const month = parseInt(dateArr[1], 10);
  const day = parseInt(dateArr[2], 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    console.warn('Invalid date numbers in str2Date:', dateStr);
    return new Date(NaN);
  }
  
  // 注意：月份从0开始，所以需要减1
  const date = new Date(year, month - 1, day);
  
  // 验证日期是否有效（例如，2023-02-30会变成2023-03-02）
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    console.warn('Invalid calendar date in str2Date:', dateStr);
    return new Date(NaN);
  }
  
  return date;
}
