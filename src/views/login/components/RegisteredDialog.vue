<template>
  <div class="formInput">
    <el-form
      ref="regForm"
      :model="regForm"
      :rules="rules"
      label-width="90px"
    >
      <el-form-item prop="username" label="账号">
        <el-input v-model="regForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          type="password"
          placeholder="密码"
          v-model="regForm.password"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPass" label="确认密码">
        <el-input
          type="password"
          placeholder="确认密码"
          v-model="regForm.checkPass"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" label="验证码">
        <el-input v-model="regForm.code" class="validCodeInpu">
          <template slot="append">
            <img :src="code.src" class="reg-code-img" @click="refreshCode" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" id="loginBtn" @click="submitRegForm('regForm')">提交注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { randomLenNum } from 'lib@/utils/util'
import http from '@/utils/http'

export default {
  name: 'RegisteredDialog',
  components: { Message },
  data () {
    // 账号校验
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账号!'))
      } else {
        callback()
      }
    }
    // 密码校验
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码!'))
      } else {
        callback()
      }
    }
    // 确认密码校验
    var validatecheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认密码!'))
      } else if (value !== this.regForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 验证码校验
    var validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      regForm: {
        username: '',
        password: '',
        checkPass: '',
        code: ''
      },
      rules: {
        username: [{ validator: checkUsername }],
        password: [{ validator: validatePass }],
        checkPass: [{ validator: validatecheckPass }],
        code: [{ validator: validateCode }]
      },
      code: {
        src: '/sourcing/captcha/generate',
        value: '',
        len: 4,
        type: 'image'
      }
    }
  },
  methods: {
    // 提交注册
    submitRegForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 发送注册请求
          return http({
            url: '/sourcing/front/register/register',
            method: 'post',
            params: {
              username: this.regForm.username,
              password: this.regForm.password,
              code: this.regForm.code
            }
          }).then(res => {
            if (res && res.success) {
              Message.success('注册成功,现在可以登录了！')
              this.$emit('show', false)
            } else if (res && !res.success) {
              Message.error(res.retMsg)
              return false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 刷新验证码
    refreshCode () {
      this.regForm.validCode = ''
      let randomStr = randomLenNum (this.code.len)
      this.code.src = `${window.location.origin}/sourcing/captcha/generate?randomStr=`+randomStr
    },
  }
}
</script>

<style lang="scss" scoped>
.formInput {
  width: 30.25rem;
  margin: 0 auto;
  h1 {
    font-size: 1.6rem;
    text-align: center;
    line-height: 1.8rem;
    margin: 0;
    padding: 2.5rem 0;
  }
  .enterTip {
    margin: 0;
    font-size: 1.125rem;
    line-height: 2rem;
    margin-bottom: 1rem;
  }
  .commonPading {
    padding: 0.5rem 0;
  }
  #loginBtn {
    width: 100%;
  }
  .forgetPswAndReg {
    height: 1.8rem;
    a {
      color: #488cff;
      font-size: 1.125rem;
      text-decoration: none;
      &.register {
        float: right;
      }
    }
  }
  .el-form-item {
    border-radius: 2px;
    margin-bottom: 28px;
    .el-form-item__error{
      padding-top: 6px;
    }
  }
}
</style>
<style>
 .formInput .el-input--small .el-input__inner {
   height: 40px;
   line-height: 40px;
   color: #666;
 }
 .formInput .el-button--small {
   padding: 12px 15px;
 }  
 .formInput .validCodeInpu .el-input-group__append {
  padding: 0 !important;
  width: 6rem;
}
.formInput .validCodeInpu .el-input-group__append .reg-code-img {
  display: block;
  width: 100%;
  height: 38px;
}
</style>
