import { AppRouteRecord } from '@/types/router'

export const indicatorRoutes: AppRouteRecord = {
    name:'Indicator',
    path:'/indicator',
    component:'/index/pages/index',
    meta:{
        title:'menus.indicator.title',
        icon:'ri:align-item-bottom-line',
        roles: ['R_SUPER', 'R_ADMIN']
    },
    children:[
        {
            path:'index',
            name:'IndicatorIndex',
            component:'/indicator/pages/indicator',
            meta:{
                title:'menus.indicator.subtitle',
                keepAlive: false
            }
        }
    ]
}