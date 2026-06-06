import { AppRouteRecord } from '@/types/router'

export const resultRoutes: AppRouteRecord = {
  path: '/result',
  name: 'Result',
  component: '/index/pages/index',
  meta: {
    title: 'menus.result.title',
    icon: 'ri:checkbox-circle-line'
  },
  children: [
    {
      path: 'success',
      name: 'ResultSuccess',
      component: '/result/pages/success',
      meta: {
        title: 'menus.result.success',
        icon: 'ri:checkbox-circle-line',
        keepAlive: true
      }
    },
    {
      path: 'fail',
      name: 'ResultFail',
      component: '/result/pages/fail',
      meta: {
        title: 'menus.result.fail',
        icon: 'ri:close-circle-line',
        keepAlive: true
      }
    },
    {
      path: 'list',
      name: 'resultList',
      component: '/result/list',
      meta: {
        title: 'menus.result.list',
        icon: 'ri:list-check',
        keepAlive: true
      }
    }
  ]
}
