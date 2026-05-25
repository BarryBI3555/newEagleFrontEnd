/**
 * 权限配置状态管理模块
 *
 * 调用后端API管理角色的菜单权限配置
 * 接口：/api/sys/role 获取角色列表、创建、删除、更新
 * 接口：/api/sys/role/{id}/menus 获取角色菜单权限
 * 接口：/api/sys/role/{id}/assign 为角色分配菜单权限
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/http'

interface Role {
  roleId: number
  roleName: string
  roleCode: string
  description?: string
  enabled?: boolean
  createTime?: string
}

interface MenuItem {
  id?: number
  name: string
  path: string
  title: string
  children?: MenuItem[]
}

// 标准化角色数据，兼容不同后端返回的字段名
const normalizeRole = (item: any): Role => {
  return {
    roleId: item.roleId ?? item.id,
    roleName: item.roleName || item.name || '',
    roleCode: item.roleCode || item.code || '',
    description: item.description,
    enabled: item.enabled ?? true,
    createTime: item.createTime
  }
}

// 标准化菜单数据
const normalizeMenu = (item: any): MenuItem => {
  return {
    id: item.id,
    name: item.name || '',
    path: item.path || '',
    title: item.title || item.meta?.title || '',
    children: item.children?.map(normalizeMenu)
  }
}

export const usePermissionStore = defineStore('permissionConfig', () => {
  // 角色列表
  const roles = ref<Role[]>([])

  // 加载状态
  const loading = ref(false)

  // 获取所有角色列表
  const fetchRoles = async (): Promise<Role[]> => {
    loading.value = true
    try {
      const res = await request.get<any>({
        url: '/api/sys/role'
      })
      // 处理 axios 响应的 data 属性
      const responseData = res?.data ?? res ?? {}
      // 兼容分页和非分页响应格式
      let records: any[] = []
      if (Array.isArray(responseData)) {
        records = responseData
      } else if (Array.isArray(responseData.records)) {
        records = responseData.records
      } else if (Array.isArray(responseData.data)) {
        records = responseData.data
      }
      roles.value = records.map(normalizeRole)
      return roles.value
    } catch (error) {
      console.error('获取角色列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取单个角色详情
  const fetchRoleDetail = async (roleId: number): Promise<Role> => {
    if (!roleId) throw new Error('角色ID不能为空')
    const res = await request.get<any>({
      url: `/api/sys/role/${roleId}`
    })
    return normalizeRole(res)
  }

  // 获取角色的菜单权限
  const fetchRoleMenus = async (roleId: number): Promise<MenuItem[]> => {
    if (!roleId) throw new Error('角色ID不能为空')
    const res = await request.get<any>({
      url: `/api/sys/role/${roleId}/menus`
    })
    // 处理 { code, msg, data } 格式的响应
    const menuData = res?.data ?? res ?? []
    const menus = Array.isArray(menuData) ? menuData : []
    return menus.map(normalizeMenu)
  }

  // 创建新角色
  const createRole = async (role: Partial<Role>): Promise<Role> => {
    const res = await request.post<any>({
      url: '/api/sys/role',
      data: role
    })
    await fetchRoles()
    return normalizeRole(res)
  }

  // 更新角色信息
  const updateRole = async (roleId: number, role: Partial<Role>): Promise<void> => {
    if (!roleId) throw new Error('角色ID不能为空')
    await request.put({
      url: `/api/sys/role/${roleId}`,
      data: role
    })
    await fetchRoles()
  }

  // 删除角色
  const deleteRole = async (roleId: number): Promise<void> => {
    if (!roleId) throw new Error('角色ID不能为空')
    await request.del({
      url: `/api/sys/role/${roleId}`
    })
    roles.value = roles.value.filter(r => r.roleId !== roleId)
  }

  // 为角色分配菜单权限
  const assignMenus = async (roleId: number, menuIds: number[]): Promise<void> => {
    if (!roleId) throw new Error('角色ID不能为空')
    await request.post({
      url: `/api/sys/role/${roleId}/assign`,
      data: { menuIds }
    })
  }

  return {
    roles,
    loading,
    fetchRoles,
    fetchRoleDetail,
    fetchRoleMenus,
    createRole,
    updateRole,
    deleteRole,
    assignMenus
  }
})