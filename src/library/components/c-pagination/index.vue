/*
 * File: index.vue
 * File Created: 2019-05-01 9:13:59 pm
 * Author: shizb1 (zhibiao.shi@meicloud.com)
 * Copyright: 2017 - 2019 Copyright (c), 深圳美云智数科技有限公司
 * -----
 * Last Modified: 2019-06-06 10:48:39 am
 * Modified By: chenjk7 (junkai.chen@meicloud.com)
 */
<template>
  <div class="c-pagination">
    <span class="pagination-total">共有 {{ pageTotal }} 条记录</span>
    <el-pagination
      class="pagination"
      popper-class="c-pagination-dropdown"
      :layout="layout"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="pageTotal"
      background
      @size-change="changeCurrentSize"
      @current-change="changeCurrentIndex"
    />
  </div>
</template>

<script>
import _isNaN from 'lodash/isNaN'

const DEFAULT_PAGE_NUM = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_SIZES = [ 10, 15, 30, 60, 100 ]

export default {
  name: 'CPagination',
  props: {
    data: {
      type: Object
    },
    total: {
      type: [Number, String]
    },
    pageNum: {
      type: Number,
      default: DEFAULT_PAGE_NUM
    },
    pageSize: {
      type: Number,
      default: DEFAULT_PAGE_SIZE
    },
    pageSizes: {
      type: Array,
      default: () => {
        return DEFAULT_PAGE_SIZES
      }
    },
    layout: {
      type: String,
      default: 'prev, pager, next, sizes'
    },
    needUpdate: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    pageTotal () {
      if (typeof this.total !== 'undefined') {
        return Number(this.total)
      }
      return Number(this.data.total) || 0
    }
  },
  watch: {
    pageSize (newValue, oldValue) {
      // 改变分页的时候触发两次请求 暂时注释掉
      // if (newValue <= 0 || _isNaN(newValue)) {
      //   this.changeCurrentSize(DEFAULT_PAGE_SIZE)
      // } else if (newValue !== oldValue) {
      //   this.changeCurrentSize(newValue)
      // }
    }
  },
  methods: {
    // 改变 currentNum
    changeCurrentIndex (value) {
      if(this.needUpdate){
        this.$emit('update:pageNum', value)
      };
      this.$emit('current-change', value)
    },
    // 改变 currentSize
    changeCurrentSize (value) {
      if(this.needUpdate){
        this.$emit('update:pageSize', value);
        this.changeCurrentIndex(1)
      }
      this.$emit('size-change', value);
    }
  }
}
</script>

<style lang="scss">
// $primary-color: #409EFF;
.c-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 15px;
  .pagination-total {
    font-size: 12px;
    color: #3F4243;
  }

  .el-pagination {
    padding: 0;
    .btn-prev, .btn-next, .el-pager li {
      min-width: 24px;
      height: 24px;
      margin: 0 4px;
      border: 1px solid #DDDDDD;
      color: #666666;
      font-weight: normal;
      font-size: 12px;
      line-height: 22px;
      background: #FFFFFF;
      border-radius: 2px;
    }

    .btn-prev, .btn-next {
      .el-icon {
        font-weight: normal;
      }
    }

    .el-pager li:not(.disabled).active {
      background: $primary-color;
      border-color: $primary-color;
    }

    .el-pager .more::before {
      line-height: 24px;
    }

    .el-pagination__sizes {
      height: 24px;
      margin-right: 0;

      .el-select {
        display: block;
        line-height: 24px;

        .el-input {
          width: 90px;
          margin-right: 0;
          margin-left: 4px;

          .el-input__inner {
            height: 24px;
            padding-right: 20px;
            color: #666666;
            font-size: 12px;
          }

          .el-input__icon {
            line-height: 22px;
          }
        }
      }
    }
  }
}

.c-pagination-dropdown {
  .el-select-dropdown__item {
    font-size: 12px;
    font-weight: normal;
  }
}
</style>
<style>
.c-pagination .el-input__inner {
    border-radius: 2px !important;
    line-height: 24px !important;
    min-height: 24px !important;
}
.c-pagination .el-pagination .el-pagination__sizes .el-select .el-input .el-input__inner{
  line-height: 24px !important;
  min-height: 24px !important;
}
</style>
