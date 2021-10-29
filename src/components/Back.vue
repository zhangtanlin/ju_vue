<template>
  <button class="back" @click="goBack">
    <i class="icon-back"></i>
    返回
  </button>
</template>

<script>
export default {
  name: 'Back',
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.back {
  padding: 2px 10px;
  font-size: 12px;
  color: #fff;
  background: #ff0000;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: crimson;
  }
  i {
    margin-right: 5px;
  }
}
</style>
