/**
 * efficiency 模块 API 整合
 *
 * 直接定义 efficiency 业务相关的 17 个 API 函数（原 src/api/index.ts 中的工作量、
 * 周期、赔付率、结案率、案均赔款、事故年赔付率等），使
 * `efficiency/{operations,costcontrol}/pages/**` 下的页面只需写
 * `import { ... } from '../../api'` 即可。
 *
 * 命名风格：扁平 `Xxx`（与原 src/api/index.ts 保持一致）
 */
import request from '@/utils/http'

// ==================== 工作量统计相关 API ====================

/**
 * 获取部门当日工作量统计
 * @param params 查询参数
 */
export const DailyWorkloadBm = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/cur_gzl_bm/list', params })
}

/**
 * 获取小组当日工作量统计
 * @param params 查询参数
 */
export const DailyWorkloadGroup = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/cur_gzl_group/list', params })
}

/**
 * 获取人员当日工作量统计
 * @param params 查询参数
 */
export const DailyWorkloadRy = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/cur_gzl/list', params })
}

/**
 * 获取人伤当日工作量统计
 * @param params 查询参数
 */
export const DailyWorkloadRs = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/cur_gzl_rs/list', params })
}

// ==================== 数据通报表格 API ====================

/** 获取周期-市公司数据 */
export const ZhouqiQs = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/zhouqi_qs/list', params })
}

/** 获取周期-部门数据 */
export const ZhouqiBm = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/zhouqi_bm/list', params })
}

/** 获取综合赔付率-客户群数据 */
export const ZhpflKhq = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/zhpfl_khq/list', params })
}

/** 获取车险结案率-部门数据 */
export const PacllBm = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/pacll_bm/list', params })
}

/** 获取车险结案率-小组数据 */
export const PacllXz = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/pacll_xz/list', params })
}

/** 获取车险结案率-人员数据 */
export const PacllRy = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/pacll_ry/list', params })
}

// ==================== 案均赔款相关 API ====================

/** 获取案均赔款-支公司（车险）数据 */
export const AnjunCxZgs = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/anjun_cx_zgs/list', params })
}

/** 获取案均赔款-客户群（车险）数据 */
export const AnjunCxKhq = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/anjun_cx_khq/list', params })
}

/** 获取案均赔款-新能源（车险）数据 */
export const AnjunCxXny = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/anjun_cx_xny/list', params })
}

// ==================== 事故年赔付率相关 API ====================

/** 获取事故年赔付率-支公司数据 */
export const PflsgnZgs = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/pflsgn_zgs/list', params })
}

/** 获取事故年赔付率-客户群数据 */
export const PflsgnKhq = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/pflsgn_khq/list', params })
}

/** 获取事故年赔付率-新能源数据 */
export const PflsgnXny = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/pflsgn_xny/list', params })
}
