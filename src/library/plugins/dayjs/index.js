import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'

export default {
  install (Vue, options) {
    dayjs.extend(weekday)
    Vue.prototype.$dayjs = dayjs
  }
}
