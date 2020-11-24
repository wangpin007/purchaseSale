// 遍历文件对象
export const requireAll = (require) => {
  return (requireContext => {
    return requireContext.keys().map(key => requireContext(key).default)
  })(require)
}
