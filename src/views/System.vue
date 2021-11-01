<template>
  <div class="home">
    <header class="header">
      <div class="header-logo">
        <img src="@/assets/logo.png" alt="加载失败">
      </div>
      <div class="header-user">
        <SelectBox :show-border="false">
          <template v-slot:title>{{ userName }}</template>
          <template v-slot:options>
            <div v-for="(item, index) in selectList" :key="index">
              <div class="header-option">
                <i :class="item.icon"></i>
                <div class="header-option-text" @click="selectChange(item)">{{ item.name }}</div>
              </div>
            </div>
          </template>
        </SelectBox>
      </div>
    </header>
    <div class="content">
      <aside v-if="menu && menu.length" class="aside">
        <LeftMenu :menu="menu" />
      </aside>
      <main class="main">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { apiLogout } from '@/api/user'
import { apiMenu } from '@/api/resource'
import SelectBox from '@/components/SelectBox'
import LeftMenu from '@/components/LeftMenu'
import { getStorage, clearStorage } from '@/utils/storage.js'
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
export default {
  name: 'Home',
  components: {
    SelectBox,
    LeftMenu,
  },
  setup() {
    // 下拉框,
    const selectList = [
      {
        id: '1',
        name: '用户',
        icon: 'icon-user',
        link: '/system/user'
      },
      {
        id: '2',
        name: '退出',
        icon: 'icon-exit'
      }
    ]
    let menu = ref([])
    let leftMenuWidth = ref('200px')
    let userName = ref(getStorage('userName'))
    const router = useRouter();
    /**
     * 方法
     * [getMenu]获取菜单
     * [selectChange]下拉菜单选择事件
     */
    const getMenu = async () => {
      const getApiMenu = await apiMenu()
      if (
        Array.isArray(getApiMenu.data) &&
        getApiMenu.data.length
      ) {
        menu.value = getApiMenu.data
      }
    }
    const selectChange = async (item) => {
      if (item.id === '1') {
        router.push(item.link)
      }
      if (item.id === '2') {
        const getApiLogout = await apiLogout()
        if (getApiLogout) {
          clearStorage('token')
          router.push('/')
        }
      }
    }
    onMounted(() => {
      getMenu()
    })
    return {
      selectList,
      menu,
      leftMenuWidth,
      userName,
      getMenu,
      selectChange
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.home {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  // 头部
  .header {
    height: 40px;
    border-bottom: 1px solid #cecece;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-logo {
      width: 9rem;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: auto;
        height: 100%;
        display: block;
      }
    }
    .header-user {
      width: 7.5rem;
      padding-right: 0.5rem;
      text-align: right;
      i {
        font-size: 25px;
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
      .header-option {
        padding: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          color: #fff;
          background: $default-color;
        }
        i {
          font-size: 12px;
          margin-right: 5px;
        }
        .header-option-tex {
          
        }
      }
      
    }
  }
  // 内容区
  .content {
    flex: 1;
    display: flex;
    overflow: hidden;
    // 菜单栏
    .aside {
      border-right: 1px solid #e6e6e6;
    }
    // 内容区
    .main {
      flex: 1;
      overflow-y: scroll;
    }
  }
}
</style>
