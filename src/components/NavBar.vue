<template>

  <el-menu default-active="1" class="el-menu-vertical" router=true length=1000px @select="handleSelect">
    <el-menu-item index="eval">
      <el-icon>
        <Notebook />
      </el-icon>
      <span>模型评估</span>
    </el-menu-item>
    <el-menu-item index="model">
      <el-icon>
        <Notebook />
      </el-icon>
      <span>模型管理</span>
    </el-menu-item>
    <el-menu-item index="data">
      <el-icon>
        <Notebook />
      </el-icon>
      <span>数据集管理</span>
    </el-menu-item>
    <el-menu-item index="record">
      <el-icon>
        <Notebook />
      </el-icon>
      <span>测试记录</span>
    </el-menu-item>
    <el-menu-item index="user">
      <el-icon>
        <User />
      </el-icon>
      <span>账号管理</span>
    </el-menu-item><el-menu-item @click="logout">
      <el-icon>
        <Remove />
      </el-icon>
      <span>退出登录</span>
    </el-menu-item>
  </el-menu>

</template>

<script>
import router from "@/router";
import store from "@/store";
import axios from "axios";
import {
  House,
  ChatDotRound,
  Notebook,
  User,
  Remove,
  Reading,
  Postcard,
  Histogram
} from "@element-plus/icons-vue"
//import { ElMessage } from "element-plus";
export default {
  //   components: {
  //     ElMessage,
  //   },
  components: {
    House,
    ChatDotRound,
    Notebook,
    User,
    Remove,
  },
  data() {
    return {
    };
  },
  methods: {
    logout() {
      
      axios({
        method: 'get',
        baseURL: import.meta.env.VITE_APP_BASE_API,
        url: '/api/logout',
        params:{
          ticket: store.state.ticket,
        }
        
      })
      store.state.ticket = "";
    },
  },
};
</script>

<style scoped>
.el-menu-vertical {
  height: 100vh;
}
</style>
