import { createRouter, createWebHistory } from 'vue-router'
import EvalView from '@/views/EvalView.vue'
import ModelView from '@/views/ModelView.vue'
import DataSetView from '@/views/DataSetView.vue'
import RecordView from '@/views/RecordView.vue'
import AccuracyView from '@/views/AccuracyView.vue'
import RecordDetailView from '@/views/RecordDetailView.vue'
import UserView from '@/views/UserView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/eval',
      name: 'eval',
      component: EvalView
    },
    {
      path: '/model',
      name: 'model',
      component: ModelView
    },
    {
      path: '/data',
      name: 'data',
      component: DataSetView
    },
    {
      path: '/record',
      name: 'record',
      component: RecordView
    },
    {
      path: '/recordDetail',
      name: 'recordDetail',
      component: RecordDetailView
    },
    {
      path: '/test1',
      name: 'test1',
      component: AccuracyView
    },
    {
      path: '/user',
      name: 'user',
      component: UserView
    },
  ]
})

export default router
