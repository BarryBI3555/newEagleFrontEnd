/**
 * v-roles 角色权限指令
 *
 * 无登录模式下，所有角色检查都直接通过
 */
import { App, Directive, DirectiveBinding } from 'vue'

interface RolesBinding extends DirectiveBinding {
  value: string | string[]
}

function checkRolePermission(el: HTMLElement, binding: RolesBinding): void {
  // 无登录模式下，所有角色检查都通过，不移除元素
}

const rolesDirective: Directive = {
  mounted: checkRolePermission,
  updated: checkRolePermission
}

export function setupRolesDirective(app: App): void {
  app.directive('roles', rolesDirective)
}
