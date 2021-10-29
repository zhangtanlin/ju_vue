<template>
  <div class="edit">
    <div class="form">
      <div class="item-box">
        <label>账号</label>
        <div class="value-box">
          <InputBox v-model:value="formData.account" placeholder="请输入账号" />
        </div>
      </div>
      <div class="item-box">
        <label>用户名</label>
        <div class="value-box">
          <InputBox v-model:value="formData.name" placeholder="请输入用户名" />
        </div>
      </div>
      <div class="item-box">
        <label>电话号码</label>
        <div class="value-box">
          <InputBox v-model:value="formData.phone" placeholder="请输入电话号码" />
        </div>
      </div>
      <div class="item-box">
        <label>年龄</label>
        <div class="value-box">
          <InputBox v-model:value="formData.age" placeholder="请输入年龄" />
        </div>
      </div>
      <div class="item-box">
        <label>区域id</label>
        <div class="value-box">
          <InputBox v-model:value="formData.area" placeholder="请输入区域id" />
        </div>
      </div>
      <div class="item-box">
        <label>部门</label>
        <div class="value-box">
          <InputBox v-model:value="formData.department" placeholder="请输入部门" />
        </div>
      </div>
      <div class="item-box">
        <label>公司</label>
        <div class="value-box">
          <InputBox v-model:value="formData.firm" placeholder="请输入公司" />
        </div>
      </div>
      <div class="item-box">
        <label>角色</label>
        <div class="value-box">
          <InputBox v-model:value="formData.roles" placeholder="请输入角色" />
        </div>
      </div>
      <div class="item-box">
        <label>是否激活</label>
        <div class="value-box">
          <SelectBox v-model:value="formData.status" :list="selectStatus" />
        </div>
      </div>
      <div class="item-box">
        <label>是否锁定</label>
        <div class="value-box">
          <SelectBox v-model:value="formData.is_locked" :list="selectStatus" />
        </div>
      </div>
      <div class="item-box">
        <label>是否禁用</label>
        <div class="value-box">
          <SelectBox v-model:value="formData.is_disabled" :list="selectStatus" />
        </div>
      </div>
      <div class="item-box">
        <Btn text="提交" @on-click="onSubmit" />
      </div>
    </div>
  </div>
</template>

<script>
import Btn from '@/components/Btn.vue'
import InputBox from '@/components/InputBox.vue'
import SelectBox from '@/components/SelectBox.vue'
import { reactive } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
export default {
  name: 'Edit',
  components: {
    InputBox,
    SelectBox,
  },
  emits: ['on-submit'],
  props: {
    userData: {
      type: Object,
      default: null
    }
  },
  setup(props, context) {
    // 是否激活
    const selectStatus = [
      {
        id: '1',
        name: '是',
      },
      {
        id: '2',
        name: '否',
      },
    ];
    // 详情对象
    var formData = reactive(props.userData)
    watch(props, (n) => {
      for (let item in formData) {
        formData[item] = n.userData[item];
      }
    });
    // 修改提交
    const onSubmit = async () => {
      context.emit('on-submit', formData)
    }
    return {
      Btn,
      selectStatus,
      formData,
      onSubmit,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.edit {
  max-width: 40rem;
  padding: 1rem 0;
}
</style>