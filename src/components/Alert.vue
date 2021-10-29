<template>
  <div
    :class="[
      'alert',
      prompt.show ? 'alert-show' : 'alert-hide'
    ]"
  >
    <div
      class="mask-layer"
      @click="prompt.show = false"
    />
    <div class="alert-box">
      <div class="title-box">
        <div class="text">{{ prompt.title }}</div>
        <Btn
          icon="icon-close"
          small
          @on-click="prompt.show = false"
        />
      </div>
      <p class="content-text">{{prompt.text}}</p>
      <div class="foot">
        <div class="foot-item">
          <Btn text="取消" small @on-click="onCancel" />
        </div>
        <div class="foot-item">
          <Btn text="确认" small @on-click="onSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import emitter from '@/utils/mitt.js'
import Btn from '@/components/Btn'
export default {
  name: 'Alert',
  setup() {
    const prompt = reactive({
      show: false,
      title: '提示',
      text: '',
      onSubmit: null,
    })
    emitter.on('alert', (data) => {
      prompt.show = data.show ?? false
      prompt.title = data.title ?? ''
      prompt.text = data.text ?? ''
      prompt.onSubmit = data.onSubmit
    });
    const onCancel = () => {
      prompt.show = false
    }
    
    const onSubmit = async() => {
      return new Promise((resolve) => {
        const tempSubmit = prompt.onSubmit()
        console.log('tempSubmit', tempSubmit)
        resolve(tempSubmit || true)
      }).then((res) => {
        console.log('res', res)
        prompt.show = false
      }).catch((err) => {
        emitter.emit('toast', {
          title: err || '提交失败',
          show: true,
        });
      });
    }
    return {
      Btn,
      prompt,
      onCancel,
      onSubmit,
    };
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.alert {
  width: 100%;
  height: 100%;
  background: rgba($color: (#000000), $alpha: 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: all 0.25s ease-in;
  .mask-layer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .alert-box {
    padding: 0.5rem;
    background: #fff;
    position: relative;
    z-index: 2;
    .title-box {
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .text {
        margin-left: 0.5rem;
      }
    }
    .content-text {
      margin: 2.5rem 5rem 3.5rem 5rem;
      font-size: 1.2rem;
      text-align: center;
    }
    .foot {
      margin: 1rem auto;
      display: flex;
      justify-content: center;
      .foot-item {
        margin: 0 0.75rem;
      }
    }
  };
}
.alert-show {
  opacity: 1;
}
.alert-hide {
  opacity: 0;
  pointer-events: none;
}
</style>
