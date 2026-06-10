import { AppRouteRecord } from '@/types/router'

export const managementRoutes: AppRouteRecord = {
  name: 'Management',
  path: '/management',
  component: '/index/pages/index',
  meta: {
    title: 'menus.management.title',
    icon: 'ri:dashboard-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'car-cockpit',
      name: 'CarCockpit',
      component: '/management/pages/car-cockpit',
      meta: {
        title: 'menus.management.carCockpit',
        keepAlive: false,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'non-car-cockpit',
      name: 'NonCarCockpit',
      component: '/management/pages/non-car-cockpit',
      meta: {
        title: 'menus.management.nonCarCockpit',
        keepAlive: false,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'flood-season',
      name: 'FloodSeasonCockpit',
      component: '/management/pages/flood-season',
      meta: {
        title: 'menus.management.floodSeason',
        keepAlive: false,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    }
  ]
}
