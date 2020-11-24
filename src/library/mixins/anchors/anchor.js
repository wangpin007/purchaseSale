export default {
  inject: ['anchorCom'],
  props: {
    href: String,
    scrollOffset: {
      type: Number,
      default () {
        return this.anchorCom.scrollOffset
      }
    }
  },
  computed: {
    anchorLinkClasses () {
      return this.anchorCom.currentLink === this.href ? 'anchor-active' : ''
    }
  },
  methods: {
    goAnchor () {
      this.currentLink = this.href
      this.anchorCom.handleHashChange()
      this.anchorCom.handleScrollTo()
      this.anchorCom.$emit('on-select', this.href)
      const isRoute = this.$router
      if (isRoute) {
        const route = Object.assign({}, this.$route)
        route.hash = this.href
        this.$router.replace(route)
      } else {
        window.location.href = this.href
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.anchorCom.init()
    })
  }
}
