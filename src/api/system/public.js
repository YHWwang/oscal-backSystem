
// 格式化字符串数据
export function formatString(data) {
  return data.replace(/</g,'&lt;').replace(/>/g,'&gt;')
}