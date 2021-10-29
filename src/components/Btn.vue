<template>
  <div
    :class="[
      'btn',
      small ? 'btn-sm': '',
    ]"
    :style="{color: color, background: bgColor}"
    @click="onClick()"
  >
    <i v-if="icon" :class="icon" />
    <div v-if="text" class="text">{{text}}</div>
  </div>
</template>

<script>
export default {
  name: 'Btn',
  emits: ['on-click'],
  props: {
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    small: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const onClick = (id) => {
      context.emit('on-click', id);
    };
    return {
      onClick,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
// 按钮
.btn {
  height: 2.5rem;
  padding: 0 1rem;
  color: #fff;
  background: #F7992B;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #e6a23c;
  }
  i {
    margin: 0 0.25rem;
    font-size: 1rem;
  }
  .text {
    margin: 0 0.25rem;
  }
}
.btn-sm {
  height: 2rem;
  padding: 0 0.5rem;
}
</style>
