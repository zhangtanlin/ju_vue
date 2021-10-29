<template>
  <div class="login">
    <div class="login-box">
      <div class="login-list">
        <label for="account">用户名</label>
        <div class="input-box">
          <input
            v-model="account"
            id="account"
            type="text"
            placeholder="请输入用户名"
          >
        </div>
      </div>
      <div class="prompt">{{ promptAccount }}</div>
      <div class="login-list">
        <label for="password">密码</label>
        <div class="input-box">
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="请输入密码"
          >
        </div>
      </div>
      <div class="prompt">{{ promptPassword }}</div>
      <div class="login-button" @click="login">提交</div>
    </div>
  </div>
</template>

<script>
import { apiLogin } from '@/api/user'
import { setStorage } from '@/utils/storage'
export default {
  name: 'login',
  data() {
    return {
      /**
       * 登陆表单
       * @param {object} [form]          - 表单
       * @param {object} [form.account]  - 账号
       * @param {object} [form.password] - 密码
       */
      account: '',
      password: '',
      promptAccount: '',
      promptPassword: ''
    }
  },
  methods: {
    /**
     * 登陆
     * @api [postApiLogin] - 登陆接口调用
     * @function [setSession] - 把相关信息
     * @function [setToken]   - vuex设置user模块的token方法
     */
    async login() {
      const reg = /^\s*$/g // 为空
      if (reg.test(this.account)) {
        this.promptAccount = '用户名不能为空'
        return
      }
      if (reg.test(this.password)) {
        this.promptPassword = '密码不能为空'
        return
      }
      const obj = {
        account: this.account,
        password: this.password
      }
      const postApiLogin = await apiLogin(obj)
      if (
        postApiLogin &&
        postApiLogin.data &&
        postApiLogin.data.token
      ) {
        setStorage('token', postApiLogin.data.token)
        setStorage('userName', this.account)
        this.$router.push('/system')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: #202020;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {}
.login-list {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-list label {
  width: 4rem;
  margin-right: 1rem;
  font-size: 14px;
  text-align: right;
  color: #fff;
}
.input-box {
  padding: 7px 10px;
  background: #fff;
}
.prompt {
  height: 22px;
  line-height: 22px;
  padding-left: 4rem;
  font-size: 12px;
  color: #ff0000;
}
.login-button {
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-left: 5rem;
  color: #fff;
  background: #F7992B;
  cursor: pointer;
}
.login-button:hover {
  background: #e6a23c;
}
</style>
