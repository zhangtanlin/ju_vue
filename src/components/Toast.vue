<template>
  <div :class="['toast', prompt.show ? 'toast-show' : 'toast-hide']">
    <div class="toast-box">
      <div class="title">{{ prompt.title }}</div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import emitter from '@/utils/mitt.js'
import { onUnmounted } from '@vue/runtime-core';
export default {
  name: 'Toast',
  setup() {
    /**
     * 定义
     * [prompt]提示
     * [prompt.show]提示-是否显示
     * [prompt.title]提示-文本
     * [timer]倒计时
     */
    let prompt = reactive({
      show: false,
      title: '提示',
    })
    let timer = null;
    emitter.on('toast', (data) => {
      prompt.title = data.title ?? ''
      prompt.show = data.show ?? false
      countdown()
    });
    /**
     * 事件
     * [countdown]倒计时
     */
    function countdown() {
      timer = setTimeout(function() {
        prompt.show = false;
      },3000)
    }
    onUnmounted(() => {
      clearTimeout(timer);
    })
    return {
      prompt,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.toast {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -50px;
  left: 0;
  z-index: 1000;
  animation: all 0.5s ease-out;
  pointer-events: auto;
  .toast-box {
    padding: 5px 10px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: flex;
    align-items: center;
    .title {
      font-size: 14px;
      margin-right: 10px;
    }
  };
}
// .toast-show {
//   animation: showToast 0.5s forwards;
//   pointer-events: auto;
// }
// .toast-hide {
//   animation: hideToast 0.5s forwards;
//   pointer-events: none;
// }
// @keyframes showToast {
//   from {
//     opacity: 0;
//     top: -50px;
//   }
//   to {
//     opacity: 1;
//     top: 10px;
//   }
// }
// @keyframes hideToast {
//   from {
//     opacity: 1;
//     top: 10px;
//   }
//   to {
//     opacity: 0;
//     top: -50px;
//   }
// }
.toast-show {
  opacity: 1;
  top: 10px;
}
.toast-hide {
  opacity: 0;
  top: -50px;
}
</style>
