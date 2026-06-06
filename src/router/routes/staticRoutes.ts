import { AppRouteRecordRaw } from '@/utils/router'

export const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/403',
    name: 'Exception403',
    component: () => import('@views/exception/pages/403.vue'),
    meta: { title: '403', isHideTab: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Exception404',
    component: () => import('@views/exception/pages/404.vue'),
    meta: { title: '404', isHideTab: true }
  },
  {
    path: '/500',
    name: 'Exception500',
    component: () => import('@views/exception/pages/500.vue'),
    meta: { title: '500', isHideTab: true }
  },
  {
    path: '/outside',
    component: () => import('@views/index/pages/index.vue'),
    name: 'Outside',
    meta: { title: 'menus.outside.title' },
    children: [
      {
        path: '/outside/iframe/:path',
        name: 'Iframe',
        component: () => import('@/views/outside/pages/Iframe.vue'),
        meta: { title: 'iframe' }
      }
    ]
  }
]
