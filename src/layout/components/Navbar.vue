<template>
  <div class="navbar">
    <!-- 切换菜单开合 -->
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- 面包屑导航 -->
    <!--    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />-->
    <tags-view />
    <!-- 右侧设置信息 -->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
        <!-- <lang-select class="right-menu-item hover-effect" /> -->
        <el-dropdown class="helpCt right-menu-item hover-effect" @command="helpHandle" trigger="click">
            <span class="el-dropdown-link helpSpan">
              帮助中心
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="smartHelp">
                <SmartHelper class="smartHelper">
                  <span slot="content" class="referenceName">智能小助手</span>
                </SmartHelper>
              </el-dropdown-item>
              <el-dropdown-item command="optGuide">系统操作指引</el-dropdown-item>
              <el-dropdown-item command="vidio">系统操作视频</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
          <i class="iconfont icongerenzhongxin userIcon" />
          <span class="userName" v-if="userInfo&&userInfo.nickeyName">{{ userInfo.nickeyName }}</span>
        </div>
        <el-dropdown-menu
          slot="dropdown"
          class="user-dropdown"
        >
          <el-dropdown-item v-if="!userInfo.nickeyName">
            <span
              style="display:block;"
              @click="login"
            >登录</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="!userInfo.nickeyName">
            <span
              style="display:block;"
              @click="registerFn"
            >注册</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="userInfo.nickeyName">
            <span
              style="display:block;"
              @click="goUser"
            >个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="userInfo.nickeyName">
            <span
              style="display:block;"
              @click="changePassword"
            >修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item v-if="userInfo.nickeyName">
            <span
              style="display:block;"
              @click="logout"
            >退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog 
      title="进销存云系统操作手册" 
      lock-scroll
      :modal-append-to-body="false"
      fullscreen
      class="common_dialog preview_dialog"
      :visible.sync="pdfVisible">
      <PdfPreview :url="pdfUrl" />
    </el-dialog>
    <el-dialog 
      title="进销存云系统操作手册-视频指引" 
      lock-scroll
      :modal-append-to-body="false"
      fullscreen
      class="common_dialog preview_dialog"
      @close="vidioSloseHandel"
      :visible.sync="vidioVisible">
      <div class="vidioWrap">
        <el-tabs type="border-card" class="guideVideo-card" @tab-click="videoTab" v-model="activeTab">
          <el-tab-pane label="基础数据操作视频" name="baseData">
            <video controls controlsList="nodownload" :src="videoUrl.baseData" class="video" ref="baseData">您的浏览器不支持视频播放</video>
          </el-tab-pane>
          <el-tab-pane label="出入库单操作视频" name="forTheSingle">
            <video controls controlsList="nodownload" :src="videoUrl.forTheSingle" class="video" ref="forTheSingle">您的浏览器不支持视频播放</video>
          </el-tab-pane>
          <el-tab-pane label="库存管理操作视频" name="InventoryManagement">
            <video controls controlsList="nodownload" :src="videoUrl.InventoryManagement" class="video" ref="InventoryManagement">您的浏览器不支持视频播放</video>
          </el-tab-pane>
        </el-tabs>
        
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import config from '@/config/user.env'
import Hamburger from '@/components/Hamburger'
import LangSelect from '@/components/LangSelect'
import SmartHelper from "lib@/components/smartHelper";
import PdfPreview from 'lib@/components/PdfPreview'
import TagsView from './TagsView'
import {getUrlKey} from '@/utils'
import { Message,MessageBox } from 'element-ui'
import {exchangeToken} from '@/api/user'
import { setToken, getToken, logout, afterLogout } from '@/utils/auth'

// import Breadcrumb from '@/components/Breadcrumb'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
export default {
  components: {
    // Breadcrumb,
    TagsView,
    Hamburger,
    LangSelect,
    SmartHelper,
    PdfPreview
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  data(){
    return {
      pdfVisible:false,
      pdfUrl:'',
      vidioVisible:false,
      activeTab:'baseData',
      videoUrl:{
        baseData:'./optGuide/baseData.mp4',
        forTheSingle:'./optGuide/forTheSingle.mp4',
        InventoryManagement:'./optGuide/InventoryManagement.mp4',
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo',
      'username', // 用户名
      // 'avatar', // 用户头像
      'device'
    ]),
    token(){
      return getToken()
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    login () {
      let url = window.location.origin+window.location.pathname
      let LoginUrl = config.singlePointLogin + encodeURI(url) // window.location.href
      sessionStorage.setItem('Url',url)
      window.location.href = LoginUrl
    },
    registerFn() {
      let signupUrl = config.signUpUrl + encodeURI(window.location.href)
      window.location.href = signupUrl
    },
    logout () {
      logout();
    },
    // 跳转个人信息
    goUser () {
      this.$router.push("/system/profile");      
    },
    // 修改密码
    changePassword () {
      window.open(config.idmUrl + "/sis/");
    },
    // 帮助中心切换
    helpHandle(val){
      if(val==='optGuide'){
        this.pdfVisible = true
        this.pdfUrl = './optGuide/saleStockOptGuide.pdf'
      }else if( val==='vidio'){
        this.vidioVisible = true
      }
    },
    // 关闭视频弹框 停止视频播放
    vidioSloseHandel(){
      let audio1 = this.$refs.baseData;
      let audio2 = this.$refs.forTheSingle;
      let audio3 = this.$refs.InventoryManagement;
      audio1.pause()
      audio2.pause()
      audio3.pause()
    },
    // tab 切换
    videoTab(tab, event){
      if(tab.name==='baseData'){ // 基础数据
        let audio2 = this.$refs.forTheSingle;
        let audio3 = this.$refs.InventoryManagement;
         audio2.pause()
         audio3.pause()
      }else if(tab.name==='forTheSingle'){ // 出入库
        let audio1 = this.$refs.baseData;
        let audio3 = this.$refs.InventoryManagement;
         audio1.pause()
         audio3.pause()
      }else if(tab.name==='InventoryManagement'){ // 库存管理
        let audio1 = this.$refs.baseData;
        let audio2 = this.$refs.forTheSingle;
         audio1.pause()
         audio2.pause()
      }
    }
  },
  created() {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if(!(userInfo && this.token)){
      afterLogout()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  align-items: center;
  display: flex;width: 100%;
  height: 40px;
  /*overflow: hidden;*/
  position: relative;
  background: #fff;border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 40px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 40px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 16px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 40px;
      .avatar-wrapper {
        position: relative;
        height: 100%;
        .user-avatar {
          cursor: pointer;
          display: inline-block;
          vertical-align: middle;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: pink;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .userIcon{
      font-size: 16px;
      background-color: #eee;
      border-radius: 50%;
      color: #56a7f3;
      vertical-align: top;
    }
    .userName{
      padding-left: 8px;
      font-size: 14px;
      vertical-align: top;
    }
  }
}
.user-dropdown{
  margin-top: 10px;
}

.helpCt{
  font-size: 12px;
  margin-right: 20px;
  .helpSpan{
    font-size: 12px;
  }
}
.vidioWrap{
  video{
    width: 100%;
    height: 500px;
  }
}
</style>
