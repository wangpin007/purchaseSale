export default {
  pages: [5, 10, 15, 30, 60],
  defaultPageSize: 15,
  getPageOptions (steps) {
    if (steps && steps.length > 0) {
      return steps
    } else {
      return this.pages
    }
  }
}
