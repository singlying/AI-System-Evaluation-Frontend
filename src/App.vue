<script setup>
import { RouterLink, RouterView } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
</script>

<template>
  <el-container v-if="this.$store.state.ticket != ''">
    <el-aside width=200px>
      <nav-bar></nav-bar>
    </el-aside>
    <router-view></router-view>
  </el-container>
  <login-view v-if="this.$store.state.ticket == ''"></login-view>
</template>
<script>
import NavBar from '../src/components/NavBar.vue'
import axios from 'axios';
import store from "@/store";
import { ElMessage } from 'element-plus';
export default {
  created(){
    axios({
                    method: 'get',
                    baseURL: import.meta.env.VITE_APP_BASE_API,
                    url: '/api/getTicket',
                    
                }).then((res) => {
                    console.log("res", res);
                    if (res.data != "fail"){
                      store.state.ticket = res.data;
                    }
                });
  },
  components: {
    NavBar,
    LoginView,
    
  },
  provide () {
   return{
     reload: this.reload
   }
  },
  data() {
    return{
      

    }
  },
  methods:{
    
    
  },
  
};
</script>
