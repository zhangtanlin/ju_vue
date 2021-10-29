<template>
  <div
    :class="['select-box', showBorder ? 'border' : '']"
  >
    <slot name="title">
      <div class="select-text-box">
        <span v-if="!value" class="selected-text">请选择</span>
        <span v-else class="selected-text">
          <template
            v-for="(item, index) in list"
            :key="index"
          >
            <span v-if="item.id === value">
              {{ item.name }}
            </span>
          </template>
        </span>
        <i class="icon-triangle-down" />
      </div>
    </slot>
    <div class="options-box">
      <div v-if="list && list.length" class="options-inner-box">
        <slot name="options">
          <div
            v-for="(item, index) in list"
            :key="index"
            :data-value="item.id"
            :class="[
              'option',
              item.id === value ? 'options-active' : ''
            ]"
            @click="change(item)"
          >
            <i v-if="item.icon" :class="item.icon" />
            {{ item.name }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: {
    // 默认选中值
    value: {
      type: [String, Number],
      default: ''
    },
    // 是否显示边框
    showBorder: {
      type: Boolean,
      default: true
    },
    // 列表
    list: {
      type: Array,
      default: () => {
        return [
          {
            id: null,
            name: '请选择',
            icon: '',
            link: ''
          }
        ]
      }
    },
  },
  data() {
    return {
      selected: '请选择'
    }
  },
  mounted() {
    this.setChoose()
  },
  methods: {
    // 根据选中的id设置显示的文字(如果没传递id参数，使用父组件传递的参数)
    setChoose(id) {
      let temp = this.value
      if (id) {
        temp = id
      }
      this.list.forEach(element => {
        if (String(element.id) === String(temp)) {
          this.selected = element.name
        }
      });
    },
    // 选择
    change (data) {
      this.setChoose(data.id)
      this.$emit('update:value', data.id)
      if (data.link) {
        this.$router.push(data.link)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select-box {
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  position: relative;
  cursor: pointer;
  &:hover {
    .options-box {
      display: block;
    }
  }
  .select-text-box {
    height: 100%;
    padding: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .selected-text {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  i {
    font-size: 12px;
    margin-left: 5px;
  }
}
.border {
  border: 1px solid #cecece;
}
.options-box {
  width: 100%;
  padding-top: 5px;
  display: none;
  position: absolute;
  top: 24px;
  left: 0;
  z-index: 5;
  .options-inner-box {
    width: 100%;
    text-align: center;
    background: #f1f1f1;
    overflow: hidden;
    .option {
      height: 30px;
      line-height: 30px;
      text-align: center;
      padding: 0 5px;
      cursor: pointer;
      overflow:hidden; /* 超出的文本隐藏 */
      text-overflow:ellipsis; /* 溢出用省略号显示 */
      white-space:nowrap; /* 溢出不换行 */
      &:hover {
        color: #fff;
        background: #e6a23c;
      }
    }
    .options-active {
      color: #fff;
      background: #e6a23c;
    }
  }
}
</style>
