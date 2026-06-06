import { AppRouteRecord } from '@/types/router'

export const dashboardRoutes: AppRouteRecord = {
  name: 'Dashboard',
  path: '/dashboard',
  component: '/index/pages/index',
  meta: {
    title: 'menus.dashboard.title',
    icon: 'ri:pie-chart-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'personalmap',
      name: 'PersonalMap',
      component: '/dashboard/pages/user-map',
      meta: {
        title: 'menus.dashboard.personalmap',
        keepAlive: false,
        fixedTab: true,
        isFullContent: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'hotmap',
      name: 'HotMap',
      component: '/dashboard/pages/3d-static-hot-map',
      meta: {
        title: 'menus.dashboard.hotmap',
        keepAlive: false,
        fixedTab: true,
        isFullContent: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    }
  ]
}
