<template>
  <div class="input-box">
    <input
      type="text"
      :value="value"
      :placeholder="placeholder"
      @input="change"
    />
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    // 默认选中值
    value: {
      type: [String, Number],
      default: ''
    },
    // 提示
    placeholder: {
      type: String,
      default: '请输入'
    },
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    change (e) {
      const value = e.target.value
      this.$emit('update:value', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-box {
  height: 28px;
  border: 1px solid #cecece;
  display: flex;
  align-items: center;
  justify-content: center;
  input {
    width: 100%;
    height: 100%;
    padding: 0 7px;
    font-size: 12px;
    border: none;
    outline: none;
  }
}
</style>
