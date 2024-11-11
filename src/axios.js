import axios from 'axios';
import store from './store';  // 引入 Vuex store

// 创建一个 axios 实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:8000',
  timeout: 10000, // 请求超时时间
});


// 添加响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    // 如果响应成功，直接返回响应数据
    return response;
  },
  error => {
    // 如果响应错误，处理错误消息
    if (error.response) {
      // 服务器返回的错误响应
      const status = error.response.status;
      const message = error.response.data.error || 'Unknown error';
      console.error(`Error ${status}: ${message}`);
      alert(`Error ${status}: ${message}`);
    } else if (error.request) {
      // 请求已经发出，但是没有响应
      console.error('No response received:', error.request);
      alert('No response received from the server.');
    } else {
      // 其他错误
      console.error('Error', error.message);
      alert(`Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
