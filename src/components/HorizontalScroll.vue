<template>
  <div class="horizontalScroll">
    <cube-scroll ref="scroll" :data="list" direction="horizontal">
      <div class="listWrapper">
        <div v-for="(item, index) in list" :key="index" class="listItem">
          <img src="~/assets/image/playEnd.png" alt="item" />
        </div>
      </div>
    </cube-scroll>
  </div>
</template>

<script>
import { Scroll } from 'cube-ui'
export default {
  name: 'HorizontalScroll',
  components: {
    cubeScroll: Scroll
  },
  props: {
    /**
     * 列表
     */
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
// 横向滚动
.horizontalScroll {
  .cube-scroll-content {
    display: inline-block;
    .listWrapper {
      display: flex;
      height: 20vw;
      .listItem {
        height: 20vw;
        margin-right: 1vw;
        &:last-child {
          margin-right: 0;
        }
        img {
          height: 100%;
        }
      }
    }
  }
}
</style>
