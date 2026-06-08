/**
 * efficiency 模块 API 整合
 *
 * 统一从 @/api 引入并以本模块的命名风格再导出，
 * 使 `efficiency/{operations,costcontrol}/pages/**` 下的页面
 * 只需写 `import { ... } from '../../../api'` 即可。
 *
 * 命名风格：扁平 `Xxx`（与 src/api/index.ts 保持一致）
 */
export {
  // 通用：最大日期
  // (getMaxTjDate 当前由后端自动填充，前端无需调用)

  // 工作量统计
  DailyWorkloadBm,
  DailyWorkloadGroup,
  DailyWorkloadRy,
  DailyWorkloadRs,

  // 周期
  ZhouqiQs,
  ZhouqiBm,

  // 综合赔付率
  ZhpflKhq,

  // 车险结案率
  PacllBm,
  PacllXz,
  PacllRy,

  // 事故年赔付率
  PflsgnZgs,
  PflsgnKhq,
  PflsgnXny,

  // 案均赔款
  AnjunCxZgs,
  AnjunCxKhq,
  AnjunCxXny
} from '@/api'
