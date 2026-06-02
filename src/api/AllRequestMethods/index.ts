/**
 * 统一 API 接口模块
 * 整合 usermap、3dhotmap、table_cur_ 等组件的 API 请求
 */
import request from '@/utils/http'

// ==================== 人员位置相关 API ====================

/**
 * 获取人员最新位置
 * @param params 查询参数
 */
export const axiosRequestLatestLocations = (params: Record<string, any>) => {
  return request.get({ url: '/api/locations/latest', params })
}

/**
 * 获取片区列表
 * @param params 查询参数
 */
export const axiosRequestGroupList = (params: Record<string, any> = {}) => {
  return request.get({ url: '/api/locations/groups', params })
}

/**
 * 获取单个人员轨迹
 * @param usercode 用户编码
 * @param params 查询参数
 */
export const axiosRequestUserTrajectory = (usercode: string, params: Record<string, any> = {}) => {
  return request.get({ url: `/api/locations/user/${usercode}`, params })
}

/**
 * 获取人员位置地址解析进度
 * @param params 查询参数
 */
export const axiosRequestLocationProgress = (params: Record<string, any> = {}) => {
  return request.get({ url: '/api/locations/latest/progress', params })
}

// ==================== 热力图相关 API ====================

/**
 * 获取统计卡片数据
 * @param params 查询参数
 */
export const axiosRequestStatsCardsData = (params: Record<string, any> = {}) => {
  return request.get({ url: 'api/statsCardsData', params })
}

/**
 * 获取热力图数据
 * @param params 查询参数
 */
export const axiosRequestHeatMapData = (params: Record<string, any> = {}) => {
  return request.get({ url: 'api/hotmap', params })
}

/**
 * 获取热力图数据解析进度
 * @param params 查询参数
 */
export const axiosRequestHotmapProgress = (params: Record<string, any> = {}) => {
  return request.get({ url: 'api/hotmap/progress', params })
}

// ==================== 工作量统计相关 API ====================

/**
 * 获取部门当日工作量统计
 * @param params 查询参数
 */
export const axiosRequestDailyWorkloadBm = (params: Record<string, any>) => {
  return request.get({ url: 'api/cur_gzl_bm/list', params })
}

/**
 * 获取小组当日工作量统计
 * @param params 查询参数
 */
export const axiosRequestDailyWorkloadGroup = (params: Record<string, any>) => {
  return request.get({ url: 'api/cur_gzl_group/list', params })
}

/**
 * 获取人员当日工作量统计
 * @param params 查询参数
 */
export const axiosRequestDailyWorkloadRy = (params: Record<string, any>) => {
  return request.get({ url: 'api/cur_gzl/list', params })
}

/**
 * 获取人事当日工作量统计
 * @param params 查询参数
 */
export const axiosRequestDailyWorkloadRs = (params: Record<string, any>) => {
  return request.get({ url: 'api/cur_gzl_rs/list', params })
}

// ==================== 行政区划相关 API ====================

/**
 * 获取地理位置信息（通过后端代理）
 * @param location 位置坐标
 */
export const axiosRequestGeocoder = (location: string) => {
  const VITE_API_PROXY_PORT_URL = import.meta.env.VITE_API_PROXY_PORT_URL
  const url = `${VITE_API_PROXY_PORT_URL}api/map/geocoder?location=${location}`
  return request.get({ url })
}

/**
 * 搜索行政区划
 * @param keyword 搜索关键词
 */
export const axiosRequestSearchDistrict = (keyword: string) => {
  const VITE_API_PROXY_PORT_URL = import.meta.env.VITE_API_PROXY_PORT_URL
  const url = `${VITE_API_PROXY_PORT_URL}api/map/district/search?keyword=${encodeURIComponent(keyword)}`
  return request.get({ url })
}

/**
 * 获取行政区划子节点
 * @param id 行政区划ID
 */
export const axiosRequestDistrictChildren = (id: string) => {
  return request.get({ url: 'api/map/district/getchildren', params: { id } })
}

// ==================== 新增数据通报表格 API ====================

/**
 * 获取周期-市公司数据
 * @param params 查询参数
 */
export const axiosRequestZhouqiQs = (params: Record<string, any>) => {
  return request.get({ url: 'api/zhouqi_qs/list', params })
}

/**
 * 获取周期-人员数据
 * @param params 查询参数
 */
export const axiosRequestZhouqiRy = (params: Record<string, any>) => {
  return request.get({ url: 'api/zhouqi_ry/list', params })
}

/**
 * 获取周期-部门数据
 * @param params 查询参数
 */
export const axiosRequestZhouqiBm = (params: Record<string, any>) => {
  return request.get({ url: 'api/zhouqi_bm/list', params })
}

/**
 * 获取综合赔付率-客户群数据
 * @param params 查询参数
 */
export const axiosRequestZhpflKhq = (params: Record<string, any>) => {
  return request.get({ url: 'api/zhpfl_khq/list', params })
}

/**
 * 获取车险结案率-部门数据
 * @param params 查询参数
 */
export const axiosRequestPacllBm = (params: Record<string, any>) => {
  return request.get({ url: 'api/pacll_bm/list', params })
}

/**
 * 获取车险结案率-小组数据
 * @param params 查询参数
 */
export const axiosRequestPacllXz = (params: Record<string, any>) => {
  return request.get({ url: 'api/pacll_xz/list', params })
}

/**
 * 获取车险结案率-人员数据
 * @param params 查询参数
 */
export const axiosRequestPacllRy = (params: Record<string, any>) => {
  return request.get({ url: 'api/pacll_ry/list', params })
}

// ==================== 案均赔款相关 API ====================

/**
 * 获取案均赔款-支公司（车险）数据
 * @param params 查询参数
 */
export const axiosRequestAnjunCxZgs = (params: Record<string, any>) => {
  return request.get({ url: 'api/anjun_cx_zgs/list', params })
}

/** 获取案均赔款-客户群（车险）数据 */
export const axiosRequestAnjunCxKhq = (params: Record<string, any>) => {
  return request.get({ url: 'api/anjun_cx_khq/list', params })
}

/** 获取案均赔款-新能源（车险）数据 */
export const axiosRequestAnjunCxXny = (params: Record<string, any>) => {
  return request.get({ url: 'api/anjun_cx_xny/list', params })
}

// ==================== 事故年赔付率相关 API ====================

/**
 * 获取事故年赔付率-支公司数据
 * @param params 查询参数
 */
export const axiosRequestPflsgnZgs = (params: Record<string, any>) => {
  return request.get({ url: 'api/pflsgn_zgs/list', params })
}

/**
 * 获取事故年赔付率-客户群数据
 * @param params 查询参数
 */
export const axiosRequestPflsgnKhq = (params: Record<string, any>) => {
  return request.get({ url: 'api/pflsgn_khq/list', params })
}

/**
 * 获取事故年赔付率-新能源数据
 * @param params 查询参数
 */
export const axiosRequestPflsgnXny = (params: Record<string, any>) => {
  return request.get({ url: 'api/pflsgn_xny/list', params })
}

// ==================== 操作日志相关 API ====================

/**
 * 查询操作日志
 * @param params 查询参数
 */
export const axiosRequestQueryOperationLogs = (params: Record<string, any>) => {
  return request.get({ url: 'api/log/query', params })
}

/**
 * 写入操作日志
 * @param operation 操作描述
 */
export const axiosRequestWriteOperationLog = (operation: string) => {
  return request.post({ url: 'api/log/write', data: { operation } })
}

// ==================== 汛期驾驶舱相关 API ====================

const rain = (path: string) => () => request.get({ url: `api/rain/${path}` })

/** 每日等级预警（滚动播放） */
export const axiosRequestRainDayLevel = rain('dayLevel')

/** 固定停车点位（地图 marker） */
export const axiosRequestRainCarPlace = rain('carPlace')

/** 值班信息 */
export const axiosRequestRainZhiban = rain('zhiban')

/** 施救单位 */
export const axiosRequestRainRepair = rain('repair')

/** 中心对口联络机制 */
export const axiosRequestRainLianluo = rain('lianluo')

/** 物资 */
export const axiosRequestRainItems = rain('items')

/**
 * 预警对应措施（按日期）
 * @param params 查询参数 { date?: 'YYYY-MM-DD' }，缺省时后端取今天
 */
export const axiosRequestRainLevelProcess = (params: Record<string, any> = {}) => {
  return request.get({ url: 'api/rain/levelProcess', params })
}