<template>
  <div class="left-menu">
    <div
      v-for="(item, index) in menu"
      :key="index"
      class="list"
    >
      <div
        v-if="item.children"
        :index="index.toString()"
      >
        <div
          :class="[
            'list-title',
            item.id === checked.id ? 'list-active' : ''
          ]"
          @click="showChild(item.id)"
        >
          <i :class="`icon ${item.icon}`" />
          <span>{{ item.name }}</span>
        </div>
        <div
          :class="[
            'list-box',
            item.id === checked.id ? 'list-box-active' : ''
          ]"
        >
          <left-menu :menu="item.children" />
        </div>
      </div>
      <div
        v-else
        :to="item.href"
        :class="[
          'list-link',
          item.id === checked.id ? 'list-active' : ''
        ]"
        @click="showChild(item.id, item.href)"
      >
        <i :class="`icon ${item.icon}`" />
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { useRouter } from 'vue-router'
export default {
  name: 'LeftMenu',
  props: {
    // 菜单数据
    menu: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  setup() {
    /**
     * 定义
     * [router]路由
     * [checked]选中项
     */
    const router = useRouter()
    let checked = reactive({
      id: '',
      href: '',
    })
    /**
     * 方法
     * [showChild()] 选择事件
     */
    const showChild = (id, link) => {
      if (link) {
        router.push(link)
      }
      if(id == checked.id) {
        checked.id = 0;
      } else {
        checked.id = id
      }
    }
    return {
      checked,
      showChild,
    }
  },
}
</script>

<style lang="scss" scoped>
.left-menu {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .list {
    line-height: 35px;
    .list-title,
    .list-link {
      padding: 0 10px;
      color: #000;
      text-decoration: none;
      display: block;
      cursor: pointer;
      &:hover {
        color: #fff;
        background: #F7992B;
      }
    }
    .list-active {
      color: #fff;
      background: #F7992B;
    }
    .list-box {
      height: 0;
      overflow: hidden;
      transition: height 3s;
      .list-title,
      .list-link {
        color: #000;
        background: none;
        padding-left: 20px;
        padding-right: 20px;
        &:hover {
          color: red;
        }
      }
      .list-active {
        color: red;
        background: none;
      }
    }
    .list-box-active {
      height: auto;
    }
    .icon {
      margin-right: 10px;
    }
  }
}
</style>
