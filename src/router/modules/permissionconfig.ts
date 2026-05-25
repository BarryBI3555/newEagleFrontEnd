import { AppRouteRecord } from '@/types/router'

export const permissionConfigRoutes: AppRouteRecord = {
    name:'PermissionConfig',
    path:'/permissionConfig',
    component:'/index/index',
    meta:{
        title:'menus.permissionconfig.title',
        // icon:'material-symbols-light:document-scanner-outline',
        roles: ['R_SUPER']
    },
    children:[
        {
            path:'index',
            name:'PermissionConfigIndex',
            component:'/permissionConfig/index',
            meta:{
                title:'menus.permissionconfig.subtitle',
                keepAlive: false,
                roles: ['R_SUPER']
            }
        }
    ]
}