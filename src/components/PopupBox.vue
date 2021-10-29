<template>
  <div class="popup" v-show="show">
    <div class="popup-mask-layer" @click="change"></div>
    <div class="popup-box">
      <div class="popup-header">
        <div class="popup-title">{{ title }}</div>
        <div class="btn icon-close" @click="change"></div>
      </div>
      <div class="popup-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    // 弹出框头部文字
    title: {
      type: String,
      default: '提示'
    },
    // 弹出框是否显示
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on-change'],
  setup(props, context) {
    // 方法（切换弹出框状态【调用父组件方法】）
    const change = () => {
      context.emit('on-change');
    }
    return {
      change,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.popup {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  .popup-mask-layer {
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.75);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
  .popup-box {
    padding: 10px;
    background: #fff;
    border-radius: 5px;
    position: relative;
    z-index: 3;
    .popup-header {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #cecece;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .popup-title {
        font-size: 14px;
      }
      .btn {
        height: 24px;
        font-size: 12px;
        cursor: pointer;
        &:hover {
          color: #ccc;
        }
      }
    }
  }
  .popup-content {
    
  }
}
.popup-show {
  display: flex;
}
</style>
