
import EventService from './event-service'

export default {
  install (Vue, options) {
    Vue.prototype.$eventBus = new EventService(Vue)

    Vue.mixin({
      beforeDestroy () {
        // 自动销毁 EventBus 事件
        this.$eventBus.$offAuto(this._uid)
      }
    })
  }
}
