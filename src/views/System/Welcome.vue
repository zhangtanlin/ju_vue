<template>
  <div class="welcome">
    <p class="text">欢迎界面</p>
    <p class="subtext">
      <a class="link" href="/">跳转官网</a>
      <a class="link" href="">跳转其他</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.welcome {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .text {
    font-size: 30px;
    font-weight: bolder;
  }
  .subtext {
    margin-top: 15px;
    font-size: 12px;
  }
  .link {
    margin: 0 1rem;
    color: $default-color;
    &:hover {
      color: $default-color-hover;
    }
  }
}
</style>
