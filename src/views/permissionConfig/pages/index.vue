<!-- 权限配置页面 -->
<template>
  <div class="permission-config-container">
    <div class="permission-config-header">
      <h2>菜单权限配置</h2>
      <p class="subtitle">为不同角色配置可访问的菜单页面</p>
    </div>

    <div class="permission-config-content">
      <!-- 左侧角色列表 -->
      <div class="role-list-panel">
        <div class="panel-header">
          <span>角色列表</span>
          <el-button type="primary" size="small" link @click="openRoleDialog()">
            <el-icon><Plus /></el-icon> 新增角色
          </el-button>
        </div>
        <div class="role-search">
          <el-input v-model="roleSearchKeyword" placeholder="搜索角色" prefix-icon="Search" clearable />
        </div>
        <div class="role-list" v-loading="permissionStore.loading">
          <div
            v-for="role in filteredRoles"
            :key="role.roleId"
            class="role-item"
            :class="{ active: selectedRole?.roleId === role.roleId }"
            @click="selectRole(role)"
          >
            <div class="role-info">
              <span class="role-name">{{ role.roleName }}</span>
              <span class="role-code">{{ role.roleCode }}</span>
            </div>
            <div class="role-actions" @click.stop>
              <el-button
                type="primary"
                link
                size="small"
                @click="openRoleDialog(role)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click="handleDeleteRole(role)"
              >
                删除
              </el-button>
            </div>
          </div>
          <el-empty v-if="filteredRoles.length === 0 && !permissionStore.loading" description="暂无角色" />
        </div>
      </div>

      <!-- 右侧菜单权限配置 -->
      <div class="menu-permission-panel">
        <div class="panel-header">
          <span>菜单权限配置</span>
          <span class="selected-role" v-if="selectedRole">
            当前角色：{{ selectedRole.roleName }}
          </span>
        </div>

        <div v-if="selectedRole" class="menu-tree-container">
          <div class="tree-actions">
            <el-button size="small" @click="toggleExpandAll">
              {{ isExpandAll ? '全部收起' : '全部展开' }}
            </el-button>
            <el-button size="small" @click="toggleSelectAll">
              {{ isSelectAll ? '取消全选' : '全选' }}
            </el-button>
          </div>

          <el-scrollbar>
            <el-tree
              ref="menuTreeRef"
              :data="menuTreeData"
              show-checkbox
              node-key="id"
              :default-expand-all="isExpandAll"
              :props="treeProps"
              :default-checked-keys="selectedMenuIds"
              @check="handleTreeCheck"
            >
              <template #default="{ data }">
                <div class="menu-node">
                  <el-icon v-if="data.icon" class="menu-icon">
                    <component :is="data.icon" />
                  </el-icon>
                  <span class="menu-title">{{ data.title }}</span>
                  <span class="menu-path">{{ data.path }}</span>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>

        <div v-else class="no-selection">
          <el-empty description="请先选择左侧角色" />
        </div>

        <div v-if="selectedRole" class="permission-actions">
          <el-button type="primary" :loading="saving" @click="savePermission">保存配置</el-button>
          <el-button @click="resetPermission">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog
      v-model="showRoleDialog"
      :title="editingRole ? '编辑角色' : '新增角色'"
      width="400px"
      align-center
    >
      <el-form :model="roleForm" label-width="80px" :rules="roleRules" ref="roleFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="roleForm.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="启用状态" v-if="editingRole">
          <el-switch v-model="roleForm.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRoleDialog = false">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="confirmRole">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'
  import { usePermissionStore } from '../modules/permission-store'
  import { useMenuStore } from '@/store/modules/menu'
  import { formatMenuTitle } from '@/utils/router'
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
  import { fetchGetMenuList } from '@/api/system-manage'

  defineOptions({ name: 'PermissionConfig' })

  interface Role {
    roleId: number
    roleName: string
    roleCode: string
    description?: string
    enabled?: boolean
    createTime?: string
  }

  interface MenuNode {
    id?: number
    name: string
    path: string
    title: string
    icon?: string
    meta?: {
      title?: string
      icon?: string
    }
    children?: MenuNode[]
  }

  const permissionStore = usePermissionStore()
  const menuStore = useMenuStore()
  const menuTreeRef = ref()
  const roleFormRef = ref<FormInstance>()

  // 角色相关
  const roleSearchKeyword = ref('')
  const selectedRole = ref<Role | null>(null)
  const showRoleDialog = ref(false)
  const editingRole = ref<Role | null>(null)
  const dialogLoading = ref(false)
  const saving = ref(false)

  const roleForm = ref({
    roleName: '',
    roleCode: '',
    description: '',
    enabled: true
  })

  const roleRules: FormRules = {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
  }

  // 菜单树相关
  const isExpandAll = ref(true)
  const isSelectAll = ref(false)
  const selectedMenuIds = ref<(number | string)[]>([])
  const originalMenuIds = ref<(number | string)[]>([])

  const treeProps = {
    children: 'children',
    label: 'title'
  }

  // 菜单树数据（从后端获取）
  const menuTreeData = ref<MenuNode[]>([])

  // 角色列表
  const roles = computed(() => permissionStore.roles)

  // 过滤后的角色列表
  const filteredRoles = computed(() => {
    if (!roleSearchKeyword.value) return roles.value
    const keyword = roleSearchKeyword.value.toLowerCase()
    return roles.value.filter(
      (role) =>
        role.roleName.toLowerCase().includes(keyword) ||
        role.roleCode.toLowerCase().includes(keyword)
    )
  })

  // 初始化加载数据
  const loadInitialData = async () => {
    try {
      await permissionStore.fetchRoles()
      await loadMenuTree()
    } catch (error) {
      console.error('初始化数据失败:', error)
    }
  }

  // 加载菜单树
  const loadMenuTree = async () => {
    try {
      const res = await fetchGetMenuList()
      // 处理 axios 响应的 data 属性
      const menus = res?.data ?? res ?? []
      const menuData = Array.isArray(menus) ? menus : (menus.data || [])
      menuTreeData.value = convertMenuToTree(menuData as any[])
    } catch (error) {
      console.error('加载菜单树失败:', error)
    }
  }

  // 转换菜单为树结构（支持嵌套和扁平两种格式）
  const convertMenuToTree = (menus: any[]): MenuNode[] => {
    // 检查是否是扁平结构（有 parentId）
    const isFlatStructure = menus.some(menu => menu.parentId !== undefined)
    
    if (isFlatStructure) {
      // 扁平结构转树形
      const menuMap = new Map<number | string, MenuNode>()
      const rootMenus: MenuNode[] = []
      
      // 第一遍：创建所有节点，使用 name 作为唯一标识
      menus.forEach(menu => {
        const node: MenuNode = {
          id: menu.name, // 使用 name 作为 id，确保与角色权限数据匹配
          name: menu.name,
          path: menu.path,
          title: formatMenuTitle(menu.title || menu.meta?.title) || menu.name || menu.path,
          icon: menu.icon || menu.meta?.icon,
          children: []
        }
        menuMap.set(menu.name, node)
      })
      
      // 第二遍：建立父子关系
      menus.forEach(menu => {
        const node = menuMap.get(menu.name)!
        const parentId = menu.parentId
        
        if (parentId === 0 || parentId === undefined || parentId === null) {
          rootMenus.push(node)
        } else {
          // 找到父节点（通过 parentId 找到对应 name）
          const parent = menus.find(m => m.id === parentId)
          if (parent) {
            const parentNode = menuMap.get(parent.name)
            if (parentNode) {
              parentNode.children = parentNode.children || []
              parentNode.children.push(node)
            }
          } else {
            rootMenus.push(node)
          }
        }
      })
      
      return rootMenus
    }
    
    // 嵌套结构处理（使用 name 作为 id）
    return menus
      .filter((menu) => !menu.meta?.isHide)
      .map((menu) => ({
        id: menu.name, // 使用 name 作为 id
        name: menu.name,
        path: menu.path,
        title: formatMenuTitle(menu.meta?.title) || menu.name || menu.path,
        icon: menu.meta?.icon,
        children: menu.children ? convertMenuToTree(menu.children) : undefined
      }))
  }

  // 选择角色
  const selectRole = async (role: Role) => {
    selectedRole.value = role
    try {
      const menus = await permissionStore.fetchRoleMenus(role.roleId)
      // 使用 name 作为选中 ID，与菜单树的 id（name）匹配
      selectedMenuIds.value = menus.map(m => m.name)
      // console.log('[权限配置] 角色菜单原始数据:', menus)
      // console.log('[权限配置] 转换后的选中ID (name):', selectedMenuIds.value)
      // console.log('[权限配置] 菜单树节点ID:', getAllMenuIds(menuTreeData.value))
      originalMenuIds.value = [...selectedMenuIds.value]
      nextTick(() => {
        menuTreeRef.value?.setCheckedKeys(selectedMenuIds.value)
      })
    } catch (error) {
      console.error('获取角色菜单失败:', error)
    }
  }

  // 打开角色弹窗
  const openRoleDialog = (role?: Role) => {
    editingRole.value = role || null
    if (role) {
      roleForm.value = {
        roleName: role.roleName,
        roleCode: role.roleCode,
        description: role.description || '',
        enabled: role.enabled ?? true
      }
    } else {
      roleForm.value = {
        roleName: '',
        roleCode: '',
        description: '',
        enabled: true
      }
    }
    showRoleDialog.value = true
  }

  // 确认角色操作
  const confirmRole = async () => {
    if (!roleFormRef.value) return
    await roleFormRef.value.validate(async (valid) => {
      if (!valid) return
      dialogLoading.value = true
      try {
        if (editingRole.value) {
          await permissionStore.updateRole(editingRole.value.roleId, roleForm.value)
          ElMessage.success('角色更新成功')
        } else {
          await permissionStore.createRole(roleForm.value)
          ElMessage.success('角色创建成功')
        }
        showRoleDialog.value = false
      } catch (error) {
        console.error('角色操作失败:', error)
      } finally {
        dialogLoading.value = false
      }
    })
  }

  // 删除角色
  const handleDeleteRole = (role: Role) => {
    ElMessageBox.confirm(`确定要删除角色「${role.roleName}」吗？`, '提示', {
      type: 'warning'
    }).then(async () => {
      try {
        await permissionStore.deleteRole(role.roleId)
        if (selectedRole.value?.roleId === role.roleId) {
          selectedRole.value = null
          selectedMenuIds.value = []
        }
        ElMessage.success('删除成功')
      } catch (error) {
        console.error('删除角色失败:', error)
      }
    })
  }

  // 展开/收起全部
  const toggleExpandAll = () => {
    const tree = menuTreeRef.value
    if (!tree) return

    const nodes = (tree as any).store.nodesMap
    Object.values(nodes).forEach((node: any) => {
      node.expanded = !isExpandAll.value
    })
    isExpandAll.value = !isExpandAll.value
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    const tree = menuTreeRef.value
    if (!tree) return

    if (!isSelectAll.value) {
      const allIds = getAllMenuIds(menuTreeData.value)
      tree.setCheckedKeys(allIds)
    } else {
      tree.setCheckedKeys([])
    }
    isSelectAll.value = !isSelectAll.value
  }

  // 递归获取所有菜单ID
  const getAllMenuIds = (menus: MenuNode[]): (number | string)[] => {
    const ids: (number | string)[] = []
    menus.forEach((menu) => {
      if (menu.id) ids.push(menu.id)
      if (menu.children) {
        ids.push(...getAllMenuIds(menu.children))
      }
    })
    return ids
  }

  // 树节点选中变化
  const handleTreeCheck = () => {
    const tree = menuTreeRef.value
    if (!tree) return

    selectedMenuIds.value = tree.getCheckedKeys() as (number | string)[]
    const allIds = getAllMenuIds(menuTreeData.value)
    isSelectAll.value = selectedMenuIds.value.length === allIds.length && allIds.length > 0
  }

  // 保存权限配置
  const savePermission = async () => {
    if (!selectedRole.value) return

    saving.value = true
    try {
      const menuIds = selectedMenuIds.value.map(id => typeof id === 'number' ? id : parseInt(id as string)).filter(Boolean)
      await permissionStore.assignMenus(selectedRole.value.roleId, menuIds)
      originalMenuIds.value = [...selectedMenuIds.value]
      ElMessage.success('权限配置保存成功')
    } catch (error) {
      console.error('保存权限失败:', error)
    } finally {
      saving.value = false
    }
  }

  // 重置权限
  const resetPermission = () => {
    selectedMenuIds.value = [...originalMenuIds.value]
    menuTreeRef.value?.setCheckedKeys(selectedMenuIds.value)
  }

  onMounted(() => {
    loadInitialData()
  })
</script>

<style scoped lang="scss">
.permission-config-container {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.permission-config-header {
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .subtitle {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
}

.permission-config-content {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
}

.role-list-panel {
  width: 300px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--el-text-color-primary);

  .selected-role {
    font-weight: normal;
    color: var(--el-color-primary);
    font-size: 13px;
  }
}

.role-search {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.role-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.role-item {
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
  background: transparent;
  border: 1px solid transparent;

  &:hover {
    background: var(--el-fill-color-light);
  }

  &.active {
    background: var(--el-color-primary-light-9);
    border-left: 3px solid var(--el-color-primary);
  }

  .role-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .role-name {
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .role-code {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .role-actions {
    margin-top: 8px;
    display: flex;
    gap: 8px;
  }
}

.menu-permission-panel {
  flex: 1;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.menu-tree-container {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.tree-actions {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.menu-node {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);

  .menu-icon {
    color: var(--el-color-primary);
  }

  .menu-title {
    font-weight: 500;
  }

  .menu-path {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-left: auto;
  }
}

.no-selection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.permission-actions {
  padding: 16px;
  border-top: 1px solid var(--el-border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>