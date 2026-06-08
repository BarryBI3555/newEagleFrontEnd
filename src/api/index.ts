/**
 * 统一 API 接口模块
 * 整合人员位置、热力图、工作量、效率等页面所需的 API 请求
 * （按 `our/lpcenter` 格式整理；登录/日志相关接口已按前期要求剔除）
 */
import request from '@/utils/http'

// ==================== 人员位置相关 API ====================

/**
 * 获取人员最新位置
 * @param params 查询参数
 */
export const LatestLocations = (params: Record<string, any>) => {
  return request.get({ url: '/api/locations/latest', params })
}

/**
 * 获取片区列表
 * @param params 查询参数
 */
export const GroupList = (params: Record<string, any> = {}) => {
  return request.get({ url: '/api/locations/groups', params })
}

/**
 * 获取单个人员轨迹
 * @param usercode 用户编码
 * @param params 查询参数
 */
export const UserTrajectory = (usercode: string, params: Record<string, any> = {}) => {
  return request.get({ url: `/api/locations/user/${usercode}`, params })
}

/**
 * 获取人员位置地址解析进度
 * @param params 查询参数
 */
export const LocationProgress = (params: Record<string, any> = {}) => {
  return request.get({ url: '/api/locations/latest/progress', params })
}

// ==================== 热力图相关 API ====================

/**
 * 获取统计卡片数据
 * @param params 查询参数
 */
export const StatsCardsData = (params: Record<string, any> = {}) => {
  return request.get({ url: 'api/statsCardsData', params })
}

/**
 * 获取热力图数据
 * @param params 查询参数
 */
export const HeatMapData = (params: Record<string, any> = {}) => {
  return request.get({ url: 'api/hotmap', params })
}

/**
 * 获取热力图数据解析进度
 * @param params 查询参数
 */
export const HotmapProgress = (params: Record<string, any> = {}) => {
  return request.get({ url: 'api/hotmap/progress', params })
}

// ==================== 工作量统计相关 API ====================

/**
 * 获取部门当日工作量统计
 * @param params 查询参数
 */
export const DailyWorkloadBm = (params: Record<string, any>) => {
  return request.get({ url: 'api/cur_gzl_bm/list', params })
}

/**
 * 获取小组当日工作量统计
 * @param params 查询参数
 */
export const DailyWorkloadGroup = (params: Record<string, any>) => {
  return request.get({ url: 'api/cur_gzl_group/list', params })
}

/**
 * 获取人员当日工作量统计
 * @param params 查询参数
 */
export const DailyWorkloadRy = (params: Record<string, any>) => {
  return request.get({ url: 'api/cur_gzl/list', params })
}

/**
 * 获取人伤当日工作量统计
 * @param params 查询参数
 */
export const DailyWorkloadRs = (params: Record<string, any>) => {
  return request.get({ url: 'api/cur_gzl_rs/list', params })
}

// ==================== 行政区划相关 API ====================

/**
 * 获取地理位置信息（通过后端代理）
 * @param location 位置坐标
 */
export const Geocoder = (location: string) => {
  const VITE_API_PROXY_PORT_URL = import.meta.env.VITE_API_PROXY_PORT_URL
  const url = `${VITE_API_PROXY_PORT_URL}api/map/geocoder?location=${location}`
  return request.get({ url })
}

/**
 * 搜索行政区划
 * @param keyword 搜索关键词
 */
export const SearchDistrict = (keyword: string) => {
  const VITE_API_PROXY_PORT_URL = import.meta.env.VITE_API_PROXY_PORT_URL
  const url = `${VITE_API_PROXY_PORT_URL}api/map/district/search?keyword=${encodeURIComponent(keyword)}`
  return request.get({ url })
}

/**
 * 获取行政区划子节点
 * @param id 行政区划ID
 */
export const DistrictChildren = (id: string) => {
  return request.get({ url: 'api/map/district/getchildren', params: { id } })
}

// ==================== 数据通报表格 API ====================

/** 获取周期-市公司数据 */
export const ZhouqiQs = (params: Record<string, any>) => {
  return request.get({ url: 'api/zhouqi_qs/list', params })
}

/** 获取周期-人员数据 */
export const ZhouqiRy = (params: Record<string, any>) => {
  return request.get({ url: 'api/zhouqi_ry/list', params })
}

/** 获取周期-部门数据 */
export const ZhouqiBm = (params: Record<string, any>) => {
  return request.get({ url: 'api/zhouqi_bm/list', params })
}

/** 获取综合赔付率-客户群数据 */
export const ZhpflKhq = (params: Record<string, any>) => {
  return request.get({ url: 'api/zhpfl_khq/list', params })
}

/** 获取车险结案率-部门数据 */
export const PacllBm = (params: Record<string, any>) => {
  return request.get({ url: 'api/pacll_bm/list', params })
}

/** 获取车险结案率-小组数据 */
export const PacllXz = (params: Record<string, any>) => {
  return request.get({ url: 'api/pacll_xz/list', params })
}

/** 获取车险结案率-人员数据 */
export const PacllRy = (params: Record<string, any>) => {
  return request.get({ url: 'api/pacll_ry/list', params })
}

// ==================== 案均赔款相关 API ====================

/** 获取案均赔款-支公司（车险）数据 */
export const AnjunCxZgs = (params: Record<string, any>) => {
  return request.get({ url: 'api/anjun_cx_zgs/list', params })
}

/** 获取案均赔款-客户群（车险）数据 */
export const AnjunCxKhq = (params: Record<string, any>) => {
  return request.get({ url: 'api/anjun_cx_khq/list', params })
}

/** 获取案均赔款-新能源（车险）数据 */
export const AnjunCxXny = (params: Record<string, any>) => {
  return request.get({ url: 'api/anjun_cx_xny/list', params })
}

// ==================== 事故年赔付率相关 API ====================

/** 获取事故年赔付率-支公司数据 */
export const PflsgnZgs = (params: Record<string, any>) => {
  return request.get({ url: 'api/pflsgn_zgs/list', params })
}

/** 获取事故年赔付率-客户群数据 */
export const PflsgnKhq = (params: Record<string, any>) => {
  return request.get({ url: 'api/pflsgn_khq/list', params })
}

/** 获取事故年赔付率-新能源数据 */
export const PflsgnXny = (params: Record<string, any>) => {
  return request.get({ url: 'api/pflsgn_xny/list', params })
}

// ==================== 系统管理 ====================

/**
 * 获取菜单列表
 * 注：后端目前没有此端点（/api/menus），保留以兼容旧逻辑。
 */
export const MenuList = () => {
  return request.get<unknown[]>({ url: 'api/menus' })
}
