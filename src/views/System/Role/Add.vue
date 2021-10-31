<template>
  <div class="add">
    <div class="add-box">
      <div class="list">
        <label for="account">角色名</label>
        <div class="input-box">
          <input
            v-model="formData.account"
            id="account"
            type="text"
            name="name"
            autocomplete="on"
            placeholder="请输入角色名"
          >
        </div>
      </div>
      <div class="prompt">{{ formData.promptAccount }}</div>
      <div class="list">
        <label for="pwd">资源</label>
        <div class="input-box">
          <input
            v-model="formData.password"
            id="pwd"
            type="password"
            name="password"
            autocomplete="on"
            placeholder="请输入资源"
          >
        </div>
      </div>
      <div class="prompt">{{ formData.promptPassword }}</div>
      <div class="list">
        <label for="verify-pwd">类型</label>
        <div class="input-box">
          <input
            v-model="formData.verifyPassword"
            id="verify-pwd"
            type="password"
            name="verifyPassword"
            autocomplete="on"
            placeholder="请输入用户名"
          >
        </div>
      </div>
      <div class="prompt">{{ formData.promptVerifyPassword }}</div>
      <div class="submit-button" @click="onSubmit">提交</div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
export default {
  name: 'RoleAdd',
  emits: ['on-submit'],
  setup(props, context) {
    // 定义
    let formData = reactive({
      name: '',
      resources: '',
      type: '',
    });
    // 提交
    const onSubmit = async () => {
      const reg = /^\s*$/g; // 为空
      let status = true;
      if (reg.test(formData.account)) {
        formData.promptAccount = '用户名不能为空'
        status = false
      }
      if (reg.test(formData.password)) {
        formData.promptPassword = '密码不能为空'
        status = false
      }
      if (formData.password !== formData.verifyPassword) {
        formData.promptVerifyPassword = '两次密码输入不一致'
        status = false
      }
      if (status) {
        context.emit('on-submit', formData)
      }
    }
    return {
      formData,
      onSubmit,
    };
  },
}
</script>

<style lang="scss" scoped>
.add {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .add-box {
    padding: 20px 0 10px 0;
  }
  .list {
    display: flex;
    align-items: center;
    justify-content: center;
    label {
      width: 6rem;
      margin-right: 1rem;
      font-size: 14px;
      text-align: right;
      color: #000;

    }
    .input-box {
      padding: 7px 10px;
      background: #fff;
      border: 1px solid #ccc;
    }
  }
  .prompt {
    height: 22px;
    line-height: 22px;
    padding-left: 7rem;
    font-size: 12px;
    color: #ff0000;
  }
  .submit-button {
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background: #F7992B;
    cursor: pointer;
    &:hover {
      background: #e6a23c;
    }
  }
}
</style>