import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import VueAxios from 'vue-axios'
import axios from 'axios'
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded'
axios.defaults.withCredentials = true;

const app = createApp(App).use(store)
.use(router).use(ElementPlus).use(VueAxios, axios).mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}