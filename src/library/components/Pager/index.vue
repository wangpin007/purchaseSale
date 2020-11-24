<template>
  <el-row class="the_footer_pager">
    <el-col>
      当前显示
      <el-select
        v-model="ps"
        size="mini"
        style="width:70px; display:inline-flex;"
        :disabled="loading"
        @change="change"
      >
        <el-option
          v-for="size in options"
          :key="size"
          :label="size"
          :value="size"
        />
      </el-select>
      条
    </el-col>
    <el-col class="application-col clear" style="text-align: center"  >
      当前显示&nbsp;{{ begin }}&nbsp;至&nbsp;{{ end }}&nbsp;
      共
      <a
        class="clear"
        href="javascript:void(0)"
        @click="pageCount"
      >{{ queryTotal | getAll }}</a>
      &nbsp;条
    </el-col>
    <el-col class="right application-col clear" style="font-size:18px">
      <i
        class="el-icon-caret-left"
        :class="[pageIndex === 1 ? 'forbid' : 'can']"
        @click="page('prev')"
      />
      <i
        class="el-icon-caret-right"
        :class="[dataCount < pageSize ? 'forbid' : 'can']"
        @click="page('next')"
      />
    </el-col>
  </el-row>
</template>
<script>
  import pages from './pages'
  export default {
    name: 'IscPager',
    filters: {
      getAll (all) {
        return all < 0 ? '?' : all
      }
    },
    props: {
      dataCount: { // 当前页查询出来几条数据
        type: Number,
        default: 0
      },
      queryTotal: { // 共几条 -1就是问号
        type: Number,
        default: -1
      },
      pageIndex: { // 当前第几页
        type: Number,
        default: 0
      },
      pageSize: { // 分页大小
        type: Number
      },
      pageCount: { // 查询共几条的方法
        type: Function,
        default: undefined
      },
      pageQuery: { // 查询数据的方法
        type: Function
      },
      loading: { // 是否正在加载数据
        type: Boolean,
        default: false
      },
      pageStep: { // 页数递增步数
        type: Array,
        default: function () {
          return []
        }
      }
    },
    componentName: 'isc-pager',
    data () {
      return {
        options: pages.getPageOptions(this.pageStep),
        ps: this.pageSize,
        ps2: this.pageSize
      }
    },
    computed: {
      begin: {
        get () {
          return this.pageIndex <= 0 ? 0 : ((this.pageIndex - 1) * this.pageSize + 1)
        }
      },
      end: {
        get () {
          return this.pageIndex <= 0 ? 0 : (this.pageIndex * this.pageSize)
        }
      }
    },
    watch: {
      pageSize (n, o) {
        this.ps2 = n
        this.ps = n
      }
    },
    beforeCreate () {
    },
    methods: {
      page (opr) {
        if (!this.loading) {
          if (opr === 'prev' && this.pageIndex <= 1) {
            return
          }

          if (opr === 'next' && this.dataCount < this.pageSize) {
            return
          }
          this.pageQuery(opr)
        }
      },
      change (val) {
        if (this.ps2 != val) {
          this.pageQuery('', val)
          this.ps2 = val
          this.ps = val
        }
      },
      changeLang (val) {

      }
    }
  }
</script>
<style scoped lang="scss">
  .the_footer_pager /deep/ {
    padding-top: 5px;
    color: #909399;
    font-size: 12px;
    >.el-col{
      width:33.33%;line-height:24px
    }
    .el-input__inner{
      border-radius: 4px !important;
      height: 24px !important;
      line-height: 24px !important;
      min-height: 24px !important;
    }
    .page {
      width: 120px;
    }

    .right {
      text-align: right;
    }

    .forbid {
      color: #909399;
    }

    .can {
      color: #409eff;
    }

    .can:hover {
      cursor: pointer;
    }

    .clear {
      margin-right: 0 !important;
    }

    a.clear {
      color: #409eff;
    }

    a.clear:hover {
      margin-right: 0 !important;
    }

  }
</style>
