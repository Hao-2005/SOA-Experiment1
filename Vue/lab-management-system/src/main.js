import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import './style.css'

// 导入页面组件
import PersonnelManagement from './views/PersonnelManagement.vue'
import MaterialsManagement from './views/MaterialsManagement.vue'
import RecordsManagement from './views/RecordsManagement.vue'

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/personnel'
  },
  {
    path: '/personnel',
    name: 'Personnel',
    component: PersonnelManagement
  },
  {
    path: '/materials',
    name: 'Materials',
    component: MaterialsManagement
  },
  {
    path: '/records',
    name: 'Records',
    component: RecordsManagement
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')


