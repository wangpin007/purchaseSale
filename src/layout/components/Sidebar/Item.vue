<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    iconfamily: {
      type: String,
      default: 'iconfont'
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render (h, context) {
    const { icon, title, iconfamily } = context.props
    // 使用 iconfont 自定义图标作为
    const iconClass = iconfamily + ' ' + icon
    const vnodes = []
    if (icon) {
      vnodes.push(<i class={iconClass} />)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
