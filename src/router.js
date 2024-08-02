import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('./views/ClipVideo.vue') },
  { path: '/customFilter', component: () => import('./views/CustomFilter.vue') },
  {
    path: '/removeGreen', component: () => import('./views/RemoveVideoGreen.vue')
  },
  {
    path: '/thumbnail', component: () => import('./views/Thumbnail.vue')
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})