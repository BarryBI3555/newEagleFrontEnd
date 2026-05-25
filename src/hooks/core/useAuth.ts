/**
 * useAuth - 权限验证管理
 *
 * 无登录模式下，所有权限检查都返回 true
 */
import { useRoute } from 'vue-router'
import type { AppRouteRecord } from '@/types/router'

type AuthItem = NonNullable<AppRouteRecord['meta']['authList']>[number]

export const useAuth = () => {
  const route = useRoute()

  const backendAuthList: AuthItem[] = Array.isArray(route.meta.authList)
    ? (route.meta.authList as AuthItem[])
    : []

  const hasAuth = (auth: string): boolean => {
    return true
  }

  return {
    hasAuth
  }
}
