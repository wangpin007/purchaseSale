
export default class EventService {
  constructor (Vue) {
    this._instance = new Vue()
    this.Vue = Vue
    this.map = {}
  }

  setMap (uid, eventName, handler) {
    if (!this.map[uid]) {
      this.map[uid] = []
    }

    this.map[uid].push({ eventName, handler })
  }

  $on (eventName, handler, vm) {
    if (vm instanceof this.Vue) {
      this.setMap(vm._uid, eventName, handler)
    }
    this._instance.$on(eventName, handler)
  }

  $emit () {
    const args = [...arguments]
    this._instance.$emit.apply(this._instance, args)
  }

  $off (eventName, handler) {
    this._instance.$off(eventName, handler)
  }

  $offAuto (uid) {
    const events = this.map[uid] || []
    events.forEach((event) => {
      const { eventName, handler } = event
      this.$off(eventName, handler)
    })
  }
}
