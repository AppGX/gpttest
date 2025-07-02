import { createRouter, createWebHistory } from 'vue-router'
import ServiceSelection from '../views/ServiceSelection.vue'
import RouteSheet from '../views/RouteSheet.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ServiceSelection,
      meta: { title: 'Выбор услуги' }
    },
    {
      path: '/route-sheet',
      name: 'route-sheet',
      component: RouteSheet,
      meta: { title: 'Маршрутный лист' }
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('../views/DocumentUpload.vue'),
      meta: { title: 'Загрузка документов' }
    },
    {
      path: '/final-review',
      name: 'final-review',
      component: () => import('../views/FinalReview.vue'),
      meta: { title: 'Финальная проверка' }
    },
  ],
})

export default router
