<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="porfileWap">
    <!-- 个人信息 -->
    <el-tab-pane label="个人信息" name="first">
      <el-form ref="userInfo" :rules="rules" :model="userInfo">
        <el-row :gutter="50">
          <el-col :span="8">
            <!-- 账号 -->
            <el-form-item label="账号" prop="username">
              <el-input disabled v-model="userInfo.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 姓名 -->
            <el-form-item label="姓名" prop="nickeyName">
              <el-input v-model="userInfo.nickeyName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 手机 -->
            <el-form-item label="手机" prop="phoneNo">
              <el-input v-model="userInfo.phoneNo" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfo.email" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 部门 -->
            <el-form-item label="部门" prop="department">
              <el-input v-model="userInfo.department" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 角色权限 -->
            <el-form-item label="角色权限" prop="rolePermissions">
              <el-input disabled v-model="userInfo.rolePermissions"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          style="padding: 0 24px;margin-bottom: 10px;"
          :gutter="50"
          v-if="userInfo.userType === 'BUYER'"
        >
          <el-collapse v-model="collapseActiveName">
            <!-- 组织权限 -->
            <el-collapse-item title="组织权限" name="organization">
              <div
                :key="item.organizationId"
                v-for="item in userInfo.organizationUsers"
              >
                {{ item.organizationName }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-row>
        <el-row>
          <el-col>
            <el-button
              v-if="!isDemoEnv"
              @click="modifyUserClick"
              :loading="loading"
              disabled
              type="primary"
              >{{$t('common.save')}}</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
    <!-- 账号安全 -->
    <el-tab-pane label="账号安全" name="second">
      <el-form :rules="passwordRules" ref="relModel" :model="password">
        <el-row :gutter="50">
          <el-col :span="8">
            <!-- 旧密码 -->
            <el-form-item label="旧密码" prop="oldItem">
              <el-input type="password" v-model="password.oldItem" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 新密码 -->
            <el-form-item label="新密码" prop="newItem">
              <el-input type="password" v-model="password.newItem" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 确认新密码 -->
            <el-form-item label="确认新密码" prop="copyNewItem">
              <el-input
                disabled
                type="password"
                v-model="password.copyNewItem"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button
              v-if="!isDemoEnv"
              type="primary"
              @click="modifyUserPassword"
              disabled
              :loading="loading"
              >{{$t('common.save')}}</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { mapState } from "vuex";
import path from "path";
/* import {
  modifyUser,
  checkOldPassword,
  modifyPassword
} from "mod@/userManage/api/userManage"; */

export default {
  name: "Profile",
  computed: {
    ...mapState({
      userInfo: state => {
        const info = state.user.userInfo;
        console.log('-info--',  info)
        return {
          ...info,
          rolePermissions: info.rolePermissions ? info.rolePermissions.map(i => i.roleName).join(",") :''
        };
      }
    })
  },
  data() {
    const validator = (rule, value, callback) => {
      const patrn = /[A-Za-z0-9][`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
      if (!value) {
        callback();
      } else if (!patrn.test(value) || value.length < 8 || value.length > 24) {
        callback(
          new Error(this.$t('vendorMod.errorPass'))//"密码至少包含数字、大小写字母、特殊字符，长度为8~24位"
        );
      } else if (value !== this.password.newItem) {
        callback(this.$t('vendorMod.confirmPassError'));//"新密码与确认新密码不一致！"
      } else {
        callback();
      }
    };
    const validator1 = (rule, value, callback) => {
      const patrn = /[A-Za-z0-9][`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
      if (!value) {
        callback();
      } else if (!patrn.test(value) || value.length < 8 || value.length > 24) {
        callback(
          new Error(this.$t('vendorMod.errorPass'))//"密码至少包含数字、大小写字母、特殊字符，长度为8~24位"
        );
      } else if (value !== this.password.copyNewItem) {
        callback(this.$t('vendorMod.confirmPassError'));//"新密码与确认新密码不一致！"
      } else {
        callback();
      }
    };
    return {
      isDemoEnv: false, // 是否在demo环境下面
      activeName: "first",
      collapseActiveName: "organization",
      loading: false,
      password: {
        oldItem: null,
        newItem: null,
        copyNewItem: null
      },
      rules: {
        nickname: [{ required: true, message: '请填写姓名'}],//"请填写姓名" 
        email: [{ required: true, message: '请填写邮箱'}]//"请填写邮箱" 
      },
      passwordRules: {
        oldItem: [{ required: true, message: '请填旧密码'}],//"请填旧密码" 
        newItem: [
          { required: true, message: '请填写新密码'},//"请填写新密码" 
          { validator: validator1, trigger: "blur" }
        ],
        copyNewItem: [
          { required: true, message: '请填写确认新密码'},//"请填写确认新密码" 
          { validator, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 私有云下面可去掉
    // 判断demo环境下面试用用户赋值 [[[
    let hostName = window.location.hostname
    if(hostName==='demo.srm.meicloud.com') {
      this.isDemoEnv = true
    }
    /// 判断demo环境下面试用用户赋值]]]
  },
  methods: {
    modifyUserClick() {
      const { userId, nickname, phone, email, department } = this.userInfo;
      /* this.$refs.userInfo.validate(status => {
        if (status) {
          this.loading = true;
          modifyUser({ userId, nickname, phone, email, department })
            .then(res => {
              this.$message({ type: "success", message: res.message });
              this.loading = false;
            })
            .catch(() => (this.loading = false));
        }
      }); */
    },
    modifyUserPassword() {
      const { userId } = this.userInfo;
      const { newItem, oldItem, copyNewItem } = this.password;
      /* this.$refs.relModel.validate(status => {
        if (status) {
          this.loading = true;
          checkOldPassword({
            password: oldItem,
            userId
          })
            .then(res => {
              modifyPassword({
                userId,
                password: copyNewItem
              }).then(res => {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: this.$t('vendorMod.successResetPass')//"密码重置成功，请重新登录！"
                });
                this.logout();
              });
            })
            .catch(res => {
              this.loading = false;
            });
        }
      }); */
    },
    logout() {
      this.$store.dispatch("user/getLogout").then(
        res => {
          console.log(res);
          if (res) {
            // self.$router.push(`/login?redirect=${self.$route.fullPath}`)
            this.$router.push({ path: path.resolve("/login") });
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
<style lang="scss" scoped>
.porfileWap {
  padding: 10px;
  .el-tab-pane {
    padding: 20px 40px;
  }
}
</style>
