<template>
<!-- 智能小助手 -->
  <div :class="['toggleDiv', {hide: openBtn}]" slot="reference">
    <div :class="['helpContent', {'hide': openBtn} ]" @click="popHelpFn">
      <slot name="content">
        <div :class="['icon-helper',iconClass,{'optClass': openBtn}]">
          <img src="./img/smartHelper.svg" style="width:100%" />
          <span v-if="showClose" class="helpText">帮助中心</span>
        </div>
      </slot>
    </div>
    <div class="opration" v-if="showClose">
      <slot name="opration">
        <i class="closeBtn" @click="closeHande" v-show="!closeBtn">X</i>
        <span :class="['opentBtn', {'hide': openBtn}]" v-if="openBtn" @click="openHande">||</span>
      </slot>
    </div>
    <el-dialog
      title="智能小助手"
      :visible.sync="popVisible"
      :close-on-click-modal="false"
      width="416px"
      :modal="false"
      class="helpPopper"
      @close="closeHelpFn"
      :append-to-body="true"
      >
      <div class="help-content">
        <div ref="helpContent" class="help-content-inner">
          <div class="common-div">
            <div class="curTime">刚刚</div>
            <div class="helper-name">小助手</div>
            <div class="helper-des">
              <p>您好，系统报障或咨询，请用微信扫以下二维码</p>
              <p class="help-ewm"></p>
            </div>
            <div class="emergencyEntrance" @click="getOtherLink">其他联系方式</div>
          </div>
          <div class="common-div" v-if="emergency">
            <div class="curTime">刚刚</div>
            <div class="helper-name">小助手</div>
            <div class="helper-des">
              <p>问题反馈邮箱：</p>
              <p>helpdesk@meicloud.com</p>
              <p>紧急联系电话：</p>
              <p>0757-23234970</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:"SmartHelper",
  props:{
    placement:{
      type: String,
      default: 'left-end'
    },
    iconClass:{
      type: String,
      default: ()=>{
        return ''
      }
    },
    showClose:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      popVisible:false,
      emergency:false,
      openBtn:false,
      closeBtn:false
    }
  },
  methods: {
    popHelpFn(){
      this.popVisible = true
    },
    closeHelpFn() {
      this.popVisible = false
      this.emergency = false
    },
    getOtherLink(){
      this.emergency=true
      setTimeout(() => {
        // 延迟查询
        this.scrollDown()
      }, 200);
    },
    // 滚动置底
    scrollDown() {
      this.$refs.helpContent.scrollTop = 120
    },
    //点击关闭按钮
    closeHande(){
      this.openBtn = true
      this.closeBtn = true
    },
    // 点击展开
    openHande(){
      this.openBtn = false
      setTimeout(() => {
        // 延迟查询
        this.closeBtn = false
      }, 200);
    }
  },
}
</script>
<style lang="less" scoped>
.icon-helper {
  width: 66px;
  position: relative;
  padding-bottom: 11px;
  position: relative;
  right: 0;
  transition: right .2s linear;
  &.optClass{
    right: -100px;
  }
  img{
    display: inline-block;
  }
  .helperI{
    height: 64px;
    background: url("./img/smartHelper.png") center top no-repeat;
    background-size: 100%;
  }
  .helpText{
    position: absolute;
    width: 100%;
    background: #F5FBFF;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 15px;
    font-size: 12px;
    color: #488cff;
    bottom: 0px;
    left: 0;
  }
  
}
.toggleDiv{
  &.hide{
    transform: translate(100%, 0);
  }
  display: inline-block;
  cursor: pointer;
  position: relative;
  .helpContent{
    display:inline-block;
  }
  .helpContent.hide{
    transform: translate(100%,0);
  }
  .opration{
    display:inline-block;
    height: 79px;
    vertical-align: top;
    .closeBtn{
      width: 18px;
      height: 18px;
      opacity: 0.65;
      background: #505050;
      color: #fff;
      text-align: center;
      font-size: 12px;
      line-height: 18px;
      border-radius: 50%;
      position: absolute;
      top: -5px;
      right: 0px;
      font-style: normal;
      cursor: pointer;
      transition: display .2s linear;
    }
    .opentBtn{
      &.hide{
        right: 50px
      }
      width: 15px;
      height: 38px;
      line-height: 38px;
      opacity: 0.7;
      background: #505050;
      color: #fff;
      text-align: center;
      font-size: 12px;
      position: absolute;
      top: 20px;
      right: -17px;
      font-style: normal;
      cursor: pointer;
      letter-spacing: 1px;
      border-top-left-radius: 11px;
      border-bottom-left-radius: 11px;
      transition: display .2s linear;
    }
  }
}
.helpPopper{
  .help-content{
    .help-content-inner{
      padding: 25px 70px;
      height: 400px;
      overflow-y: auto;
      .common-div{
        margin-bottom: 30px;
        .curTime{
          text-align: center;
          font-size: 12px;
          color: #ADB5BB;
        }
        .helper-name{
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          color: #666666;
          position: relative;
          &::before{
            position: absolute;
            content: " ";
            width: 40px;
            height: 40px;
            background: url("./img/serveIcon.png") center no-repeat;
            background-size: cover;
            top: 3px;
            left: -50px;
          }
        }
        .helper-des{
          background-color: #fff;
          border-radius: 5px;
          overflow: hidden;
          padding: 15px;
          p{
            font-size: 14px;
            color: #3D3D3D;
            line-height: 22px;
            margin: 0;
            &.help-ewm{
              margin-top: 10px;
              width: 109px;
              height: 109px;
              background: url("./img/helpEWM.png") center no-repeat;
              background-size: cover;
            }
          }
        }
        .emergencyEntrance{
          font-size: 12px;
          color: #488CFF;
          text-align: right;
          margin-top: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<style>
.helpPopper .el-dialog__header{
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  padding: 0 20px;
  font-size: 14px;
  border-bottom: 1px solid #EAEDF3;
  text-align: left;
}
.helpPopper .el-dialog__header .el-dialog__headerbtn {
  top: 10px;
}
.helpPopper .el-dialog__close.el-icon.el-icon-close {
  font-size: 25px;
}
.helpPopper .el-dialog__body{
  padding: 0;
  background: #F7F9FA;
}
</style>