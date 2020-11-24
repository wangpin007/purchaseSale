<template>
  <section class="login">
    <!--<div>-->
      <!--<div class="l-left">-->
        <!--<p>用户登录界面</p>-->
        <!--<p>v 1.0.0</p>-->
      <!--</div>-->
      <!--<div class="l-right">-->
        <!--<h3>用户登录</h3>-->
        <!--<el-form :model="form" :rules="rules" ref="userForm" label-width="80px">-->
          <!--<el-form-item label="用户名" prop="username">-->
            <!--<el-input type="text" v-model="form.username" autocomplete="off"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="密码" prop="password">-->
            <!--<el-input type="password" v-model="form.password" @keyup.enter.native="submitForm" autocomplete="off"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item labelWidth="0px">-->
            <!--<el-button type="primary"style="width: 100%" @click="goIdmSystem">登录</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</div>-->
    <!--</div>-->
  </section>
</template>

<script>

  import { getToken, logout, exchangeToken, initSystem, goIdmSystem} from '@/utils/auth'
  import {getUrlKey} from '@/utils'
  import config from '@/config/user.env'

  export default {
    components: {},
    name: 'Login',
    data() {
      return {
        loading: {},
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('用户名不能为空'));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          password: [
            {
              validator:
                (rule, value, callback) => {
                  if (!value) {
                    return callback(new Error('密码不能为空'));
                  } else {
                    callback();
                  }
                },
              trigger: 'blur'
            }
          ],
        }
      }
    },
    methods: {
      screenLoading() {
        return this.$loading({
          lock: true,
          text: '页面跳转中......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      // 如果路径上面没有ticket 就通过请求去获取
      getTicket() {
        return new Promise(resolve => {
          let ticket = this.getTicketByUrl();
          if(ticket) {
            resolve(ticket)
          }else {
            this.getTicketByJsonp().then(ticket => {
              resolve(ticket)
            });
          }
        });
      },

      // 通过路径获取ticket
      getTicketByUrl() {
        return getUrlKey('ticket');
      },

      // 通过jsonp获取ticket
      getTicketByJsonp() {
        let _this = this;
        let service = window.location.origin + window.location.pathname;
        return new Promise(resolve => {
          let ssoUrl = config.idmUrl+'/p3/ssoValidate';
          _this.$jsonp(ssoUrl,{ service },1000).then( data => {
            if(data.sso){
              resolve(data.ticket)
            }else{
              resolve('');
            }
          }).catch( err => {
            resolve('');
            console.log(err)
          })
        });
      }
    },
    mounted() {
      let loading = this.screenLoading();
      let service = window.location.origin + window.location.pathname;
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      if(getToken() && userInfo) {// 如果存在
        this.$router.push('/');
      }else{// 未登录
        this.getTicket().then(ticket => {
          if(ticket) {
            exchangeToken({ticket, service}).then(() => {
              initSystem().then(() => {
                let router =  getUrlKey('pageRouter');
                let pageParams = getUrlKey('pageParams');
                let href = window.location.origin + window.location.pathname;
                if(router){
                  href += '#/' + router;
                  if(pageParams) {
                    href += '?' + 'params=' + pageParams;
                  }
                }
                loading.close();
                location.href = href;
              });
            }, (err) => {
              this.$alert(err.retMsg, '提示', {
                type: 'error'
              });
            });
          }else {
            goIdmSystem();
          }
        });
      }
    }
  }
</script>

<style lang="less" scope>
  @keyframes bounceInDown{
    from {height: 0;}
    to {height: 500px;}
  }
  .login {
    min-height: 540px;
    height: 100%;
    /*background-color: #035367;*/
    display: flex;
    align-items: center;
    justify-content: center;
    & > div {
      box-shadow: 0 0 10px rgba(0,0,0,.4);
      animation-name: bounceInDown;
      animation-duration: 1s;
      animation-fill-mode: both;
      overflow: hidden;
      width: 1000px;
      height: 500px;
      display: flex;
      .l-left, .l-right {
        flex: 1;
        display: flex;
      }
      .l-left {
        background-color: #70aeef;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        & > p:first-child {
          color: #fff;
          font-weight: 300;
          letter-spacing: 2px;
          font-size: 25px;
          margin-bottom: 10px;
        }
        & > p:last-child {
          margin: 0;
          padding: 0;
          color: #fff;
          font-size: 10px;
        }
      }
      .l-right {
        background-color: #fff;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        display: flex;
        flex-flow: column;
        align-items: center;
        h3 {
          margin-top: 30%;
        }
        form{
          width: 75%;
        }
      }
      .l-right/deep/ .el-form .el-form-item{
        margin-bottom: 24px;
        color: #666;
      }
    }
  }
</style>
