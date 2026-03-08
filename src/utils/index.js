export function parseTime(time, cFormat) {
  if (time == null) {
    return null;
  }
  
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  
  if (typeof time === 'object') {
    date = time;
  } else {
    // 处理时间戳字符串或数字
    if (typeof time === 'string' && /^\d+$/.test(time)) {
      time = parseInt(time, 10);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time *= 1000;
    }
    date = new Date(time);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn('Invalid time value:', time);
      return null;
    }
  }
  
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    const value = formatObj[key];
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value] || '';
    }
    if (result.length > 0 && value < 10) {
      return '0' + value;
    }
    return value.toString() || '0';
  });
  
  return timeStr;
}

export function formatTime(time, option) {
  if (time == null) {
    return '';
  }
  
  // 转换为数字
  const timeNum = Number(time);
  if (isNaN(timeNum)) {
    console.warn('Invalid time value for formatTime:', time);
    return '';
  }
  
  const d = new Date(timeNum * 1000);
  const now = Date.now();
  
  // 检查日期是否有效
  if (isNaN(d.getTime())) {
    return '';
  }
  
  const diff = (now - d.getTime()) / 1000;
  
  if (diff < 0) {
    // 未来时间
    return parseTime(d, option || '{y}-{m}-{d} {h}:{i}');
  } else if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  
  if (option) {
    return parseTime(d, option);
  } else {
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}时${d.getMinutes()}分`;
  }
}
