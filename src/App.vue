<template>
  <router-view />
  
  <!-- toast全局部件 -->
  <Toast/>
  <!-- alert全局部件 -->
  <Alert/>
</template>

<script>
import Toast from '@/components/Toast'
import Alert from '@/components/Alert'
// 初始化 axios 配置参数
import axios from 'axios'
import config from './config'
axios.defaults.timeout = 3000;
axios.defaults.baseURL = config[process.env.NODE_ENV].ENV_API;

export default{
  name: 'app',
  components: {
    Toast,
    Alert,
  },
}
</script>

