import { AppRouteRecord } from '@/types/router'

export const managementRoutes: AppRouteRecord = {
  name: 'Management',
  path: '/management',
  component: '/index/index',
  meta: {
    title: 'menus.management.title',
    icon: 'ri:dashboard-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'flood-season',
      name: 'FloodSeason',
      component: '/management/flood-season',
      meta: {
        title: 'menus.management.floodSeason',
        keepAlive: false
      }
    },
    {
      path: 'car-cockpit',
      name: 'CarCockpit',
      component: '/management/car-cockpit',
      meta: {
        title: 'menus.management.carCockpit',
        keepAlive: false
      }
    },
    {
      path: 'non-car-cockpit',
      name: 'NonCarCockpit',
      component: '/management/non-car-cockpit',
      meta: {
        title: 'menus.management.nonCarCockpit',
        keepAlive: false
      }
    }
  ]
}
