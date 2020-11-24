<template>
  <!--<el-container class="flex-container-notab the_buyer_dashboard_wrapper"-->
                <!--direction="vertical">-->
    <!--<el-main>-->
      <!--<el-row class="the_body">-->
        <!--<el-col :span="12"><div class="grid-content">-->
          <!--<h3>待处理任务<a href="#" style="float: right;">更多>></a></h3>-->
          <!--<ul class="the_newsList">-->
            <!--<li v-for="(item,k) in newsList" :key="k">-->
              <!--<p>-->
                <!--{{item.title}}-->
                <!--<span>{{item.creationDate}}</span>-->
              <!--</p>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div></el-col>-->
        <!--<el-col :span="12"><div class="grid-content">-->
          <!--<h3>通知公告<a href="#" style="float: right;">更多>></a></h3>-->
          <!--<ul class="the_newsList">-->
            <!--<li v-for="(item,k) in newsList" :key="k">-->
              <!--<p>-->
                <!--{{item.title}}-->
                <!--<span>{{item.creationDate}}</span>-->
              <!--</p>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div></el-col>-->
      <!--</el-row>-->
      <!--<div class="the_header">-->
        <!--<h3>快捷方式</h3>-->
        <!--<ul>-->
          <!--<li v-for="(item,k) in itemList" :key="k">-->
            <!--<i :class="item.icon"/>-->
            <!--<p class="the_sub_route" @click="toRoute(item.path)">{{item.title}}</p>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <!--<el-row class="the_footer2">-->
        <!--<el-col :span="12"><div class="grid-content">-->
          <!--<h3>浏览器设置指引</h3>-->
          <!--<p>建议使用谷歌浏览器！首次打单请先按附件指引设置浏览器！</p>-->
          <!--<p><a href="#">浏览器设置指引.doc</a></p>-->
        <!--</div></el-col>-->
        <!--<el-col :span="12"><div class="grid-content">-->
          <!--<h3>常见问题处理办法</h3>-->
          <!--<p>如果使用系统过程中遇到问题或疑惑，点击下载附件查看解决办法：</p>-->
          <!--<p><a href="#">常见问题指引.doc</a></p>-->
        <!--</div></el-col>-->
      <!--</el-row>-->

    <!--</el-main>-->
  <!--</el-container>-->
  <section>
    <el-card class="card card1" shadow="never">
      <el-row type="flex">
        <el-col class="card1-left">
          <svg-icon icon-class="user-icon"></svg-icon>
          <div class="text">
            <p>{{$store.state.user.userInfo.company}}</p>
            <p>{{$store.state.user.userInfo.nickeyName}}，连续<strong> {{unusedDays}} </strong>天未使用系统</p>
          </div>
        </el-col>
        <el-col class="card1-right">
          <div class="right-summary">
            <small>待事务处理单量</small>
            <strong>{{toDoOrderAmount}}</strong>
          </div>
          <div class="right-summary">
            <small>今日入库量</small>
            <strong>{{warehousingAmount}}</strong>
          </div>
          <div class="right-summary">
            <small>今日出库量</small>
            <strong>{{exWarehousingAmount}}</strong>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-row>
      <el-col :span="12">
        <magical-table
          type="card"
          class="card card2"
          :bodyStyle="{padding: '0 0 10px'}"
          :table="toDoTable"
          :loading="toDoLoading"
          :pagination="toDoPagination"
          @pageSizeChange="pageSizeChange"
          @pageNumChange="pageNumChange"
          :needQuery="false"
          :needButtons="false"
          :needLine="false">
          <div slot="header" class="title">
            <span class="icon"></span>
            <span class="text">待处理任务</span>
            <!--<div class="more"><el-button type="text">更多>></el-button></div>-->
          </div>
        </magical-table>
      </el-col>
      <el-col :span="12">
        <el-card class="card card3" shadow="never">
          <div slot="header" class="title">
            <span class="icon"></span>
            <span class="text">公告</span>
            <!--<div class="more"><el-button type="text">更多>></el-button></div>-->
          </div>
          <div class="notice">
            <div v-for="(item, index) in noticeData" class="notice-box" v-if="index < 5">
              <el-tag type="success" v-if="index === 0">最新</el-tag>
              <el-tag type="warning" v-else>重要</el-tag>
              <div class="box-title">{{item.title}}</div>
              <div class="box-time">{{item.createTime}}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="card card4" shadow="never">
      <div slot="header" class="title">
        <span class="icon"></span>
        <span class="text">快捷菜单</span>
        <!--<div class="more"><el-button type="text">更多>></el-button></div>-->
      </div>
      <div class="quickMenu">
        <div v-for="(item, index) in quickMenus" :key="index" class="menu-box" @click="menuClick(item)">
          <svg-icon :icon-class="item.svg"></svg-icon>
          <div class="box-title">{{item.title}}</div>
        </div>
      </div>
    </el-card>
    <el-card class="card card5" shadow="never">
      <div slot="header" class="title">
        <span class="icon"></span>
        <span class="text">文档中心</span>
        <!--<div class="more"><el-button type="text">更多>></el-button></div>-->
      </div>
      <div class="docCenter">
        <div v-for="(item, index) in docCenterData" :key="index" class="docCenter-box"  @click="docClick(item)">
          <svg-icon :icon-class="item.svg"></svg-icon>
          <div class="box-text">
            <div class="text-title">{{item.title}}</div>
            <div class="text-desc">{{item.desc}}</div>
          </div>
          <!--<el-button type="text" class="box-button" >下载</el-button>-->
        </div>
      </div>
    </el-card>
    <!--<el-row>-->
      <!--<el-col :span="12">-->
        <!---->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
      <!--</el-col>-->
    <!--</el-row>-->

  </section>
</template>

<script>

  import MTable from "lib@/components/awesome/table/main";
  import MagicalTable from "lib@/components/awesome/magicalTable/main";
  import config from '@/config/user.env.js';
  import ElButton from "element-ui/packages/button/src/button";
  import {mapGetters} from "vuex";
  // import qrcordSrc from '@/assets/browserSetting.docx';
  export default {
    name: 'DashboardVendor',
    components: {
      ElButton,
      MagicalTable,
      MTable
    },
    computed: {
      ...mapGetters([
        'slideMenu'
      ]),
      quickMenus() {
        if(sessionStorage.slideMenu){
          let slideMenu = JSON.parse(sessionStorage.slideMenu);
          let _slideMenu = [];
          slideMenu.forEach(item => {
            _slideMenu.push(item);
            if(item.subNodes && item.subNodes.length){
              item.subNodes.forEach(innerItem => {
                _slideMenu.push(innerItem);
              })
            }
          });
          return this.quickMenuList.filter(item => {
            return _slideMenu.some(innerItem => innerItem.fdFrontLink === item.path || item.link)
          });
        }else {
          return []
        }
      }
    },
    data () {
      return {
        unusedDays: 0,
        exWarehousingAmount: 0,
        warehousingAmount: 0,
        toDoOrderAmount: 0,
        toDoLoading: false,
        toDoTable: {
          tableData: [],
          columns: [
            {
              label: '标题',
              prop: 'transactionType',
              formatter: (row, col) => {
                return this.$getLabelByValue(this.dict.transactionType, row.transactionType, 'label', 'value');
              }
            },
            {
              label: '单据号',
              prop: 'orderNum',
              render: ({row, col}) => {
                return {
                  component: 'button',
                  type: 'text',
                  text: row.orderNum,
                  click: () => {
                    this.$router.push({
                      path: row.menuUrl,
                      query: {type: row.transactionType}
                    })
                  }
                }
              }
            },
            {
              label: '创建时间',
              prop: 'creationDate'
            }
          ],
          settings: {
            border: false,
            height: 186
          }
        },
        toDoPagination: {
          pageSize: 5,
          pageNum: 1,
          total: 0,
          pageSizes: [5, 10, 20],
        },
        noticeData: [
          {title: '欢迎使用进销存系统！', createTime: '2020-09-02'},
        ],
        quickMenuList: [
          {svg: 'user-warehousing', title: '入库', path: '/stock/warehousing'},
          {svg: 'user-exwarehousing', title: '出库', path: '/stock/exwarehousing'},
          {svg: 'user-transaction', title: '事务处理', path: '/stockManage/transaction'},
          {svg: 'user-stockDifference', title: '盘点', path: '/stockManage/stockDifference'},
          {svg: 'user-allocation', title: '调拨', path: '/stockManage/allocation'},
          {svg: 'user-qualitCloud', title: '品质云', link: config.qualityCloudUrl},
        ],
        docCenterData: [
          {svg: 'user-word', title: '浏览器设置指引', desc: '建议使用谷歌浏览器！首次打单请先按附件指引设置浏览器', url: './optGuide/浏览器设置指引.docx'},
          {svg: 'user-word', title: '常见问题指引', desc: '如果使用系统过程中遇到问题或疑惑，点击下载附件查看解决方案', url: './optGuide/常见问题指引.docx'}
        ],
        dict: {
          transactionType: []
        }
      }
    },
    methods: {
      getDict(){
        return new Promise(resolve => {
          this.getDictByCode('PSS_TRANSACTION_TYPE', (res) => {
            this.dict.transactionType = res;
            resolve()
          });
        });
      },
      // 获取字典接口
      getDictByCode(code, callback) {
        let params = {
          dictCode: code
        };
        let url = '/pss/member/dict/item/byDictCode';
        this.$http.get(url, {params}).then(res => {
          if (res.success) {
            let data = res.data.map(({dictItemCode, dictItemName}) => {
              return {value: dictItemCode, label: dictItemName}
            });
            callback && callback(data);
          } else {
            this.$message.error(res.retMsg);
          }
        }).catch(err => {
          console.log(err);
        });
      },
      // 获取待办
      getTodoOrder() {
        let params = {
          pageNo: this.toDoPagination.pageNum,
          pageSize: this.toDoPagination.pageSize,
        };
        let url = '/pss/member/workbench/todoOrders';
        this.toDoLoading = true;
        this.$http(url, {params}).then(res => {
          this.toDoLoading = false;
          if(res.success){
            this.toDoTable.tableData = res.data.list;
            this.toDoPagination.total = res.data.total;
          }
        })
      },
      pageSizeChange(pageSize) {
        this.toDoPagination.pageNum = 1;
        this.toDoPagination.pageSize = pageSize;
        this.getTodoOrder();
      },
      pageNumChange(pageNum) {
        this.toDoPagination.pageNum = pageNum;
        this.getTodoOrder();
      },
      // 常用菜单点击
      menuClick(item){
        if(item.link){
          window.open(item.link);
        }
        this.$router.push({
          path: item.path
        });
      },
      // 文档下载
      docClick(item) {
        window.open(item.url);
      },
      // 获取未登录天数
      getUnusedDays(){
        let url = '/pss/member/workbench/unusedDays';
        this.$http(url).then(res => {
          if(res.success){
            this.unusedDays = res.data || 0;
          }
        })
      },
      // 出库数量
      getExWarehousingAmount(){
        let url = '/pss/member/workbench/exwarehousing/quantity';
        this.$http(url).then(res => {
          if(res.success){
            this.exWarehousingAmount = res.data || 0;
          }
        })
      },
      // 入库数量
      getWarehousingAmount() {
        let url = '/pss/member/workbench/warehousing/quantity';
        this.$http(url).then(res => {
          if(res.success){
            this.warehousingAmount = res.data || 0;
          }
        })
      },
      // 待事务处理数量
      getToDoOrderAmount(){
        let url = '/pss/member/workbench/newOrder/quantity';
        this.$http(url).then(res => {
          if(res.success){
            this.toDoOrderAmount = res.data || 0;
          }
        })
      }
    },
    mounted() {
      this.getDict().then(() => {
        this.getTodoOrder();
        // 获取未使用天数
        this.getUnusedDays();
        // 获取今日出库量
        this.getExWarehousingAmount();
        // 获取今日入库量
        this.getWarehousingAmount();
        // 获取待事务处理单量
        this.getToDoOrderAmount();
      });
    }
  }
</script>

<style lang="scss" scoped>
  .card{
    border-radius: 0;
    border: none;
    margin-bottom:10px;
    &/deep/ .el-card__header{
      padding: 0;
      border: none;
      .title{
        padding: 20px 10px;
        display: flex;
        align-items: center;
        .icon{
          width: 4px;
          height: 15px;
          background-color: #409EFF;
          margin-right: 10px;
        }
        .text{
          font-size: 16px;
        }
        .more{
          flex: 1;
          text-align: right;
          .el-button{
            padding: 0;
          }
        }
      }
    }
    &/deep/ .el-card__body{
      padding: 0;
    }
    &/deep/ .el-table th{
      background-color: #edf0f2 !important;
    }
  }
  .card1{
    /*margin: 10px;*/
    &/deep/ .el-card__body{
      padding: 0;
      & > .el-row {
        &> .el-col {
          display: flex;
          align-items: center;
          height: 90px;
        }
        .card1-left {
          .text{
            p:first-child{
              font-size: 18px;
              margin: 5px 0 0 0;
            }
            p:last-child{
              margin: 5px 0 0 0;
              font-size: 12px;
              color: #6C7880;
              strong{
                font-size: 18px;
                color: #C03639;
              }
            }
          }
          .svg-icon{
            margin: 0 20px;
            width: 55px;
            height: 55px;
            transform: rotateY(180deg)
          }
        }
        .card1-right {
          flex-flow: row-reverse;
          flex: 0 0 500px;
          .right-summary{
            display: flex;
            flex-flow: column;
            text-align: center;
            padding: 0 20px;
            border-right: 1px solid #DFE3E6;
            small{
              color: #6C7880;
              font-size: 14px;
            }
            strong{
              font-weight: bold;
              font-size: 24px;
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
  .card2{
    margin: 0 5px 10px 10px;
  }
  .card3{
    margin: 0 10px 10px 5px;
    .notice{
      padding: 0 10px 10px;
      min-height: 230px;
      .notice-box{
        padding-bottom: 10px;
        display: flex;
        align-items: center;
        .box-title{
          flex: 1;
          padding: 0 20px 0 10px;
          @include ellipsis(100%);
        }
        .box-time{
          color: #999;
        }
      }
    }
  }
  .card4{
    margin: 0 10px 10px;
    .quickMenu{
      display: flex;
      flex-flow: row wrap;
      text-align: center;
      padding: 0 10px 10px;
      .menu-box{
        cursor: pointer;
        margin-bottom: 10px;
        svg{
          width: 50px;
          height: 50px;
        }
        .box-title{
          padding-top: 10px;
          @include ellipsis(100px);
        }
      }
    }
  }
  .card5{
    margin: 0 10px 10px;
    .docCenter{
      padding: 0 10px 10px;
      .docCenter-box{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        cursor: pointer;
        svg{
          width: 40px;
          height: 40px;
        }
        .box-text{
          flex: 1;
          line-height: 2em;
          padding: 0 20px 0 10px;
          .text-title{

          }
          .text-desc{
            color: #999;
          }
        }
      }
    }
  }
  #app{
    .app-wrapper{
      .app-main{
        padding: 5px;
      }
    }
  }
  .the_buyer_dashboard_wrapper /deep/ {
    ul li{list-style: none}
    .the_header {
      border: 1px solid #ccc; border-radius: 4px;
      margin: 11px 3px;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12), 0 0 6px 0 rgba(0,0,0,0.04);
      padding: 0 11px;
      ul{
        display: flex; width: 100%;
        padding: 0;
        li{
          text-align: center; width: 111px;
          .the_sub_route{font-size: 14px}
          .the_sub_route:hover{color: #1890ff;cursor: pointer;}
          i{font-size: 38px;color: #1890ff;}
        }
      }
    }
    .the_body>.el-col{
      height: 211px; padding:0 3px;
    }
    .the_footer>.el-col{
      height: 155px; padding:0 3px;
      color: #666;
      .sub_title {font-size: 16px;}
      ul{
        display: flex; width: 100%;
        padding: 0;
        li{
          flex: 1;text-align: center;
          i{font-size: 30px;color: #1890ff;}
        }
      }
    }
    h3{
      font-size: 14px;margin-top: 5px;line-height: 28px;
      padding-left: 3px;border-bottom: 1px solid #ccc;
      a{font-size: 12px; color: #999;}
    }
    .grid-content {
      height: 100%; border: 1px solid #ccc; padding: 0 11px;border-radius: 4px;
    }
    .the_newsList {
      padding-left: 5px;
      height: 111px;
      overflow: hidden;
      li p{
        font-size: 12px;color: #666;
        span{float: right}
      }
    }
    .the_footer2>.el-col {
      height: 111px;
      padding:0 3px;
      p a{color: #1890ff;}
    }
    .the_newsList2 {
      padding-left: 5px;
      height: 51px;
      overflow: hidden;
      li p{
        font-size: 12px;color: #666;
        span{float: right}
      }
    }

  }
</style>
