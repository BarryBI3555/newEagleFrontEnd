/**
 * lpmap 模块 API 整合
 *
 * 直接定义 lpmap 业务相关的 9 个 API 函数（原 src/api/index.ts 中的人员位置、
 * 热力图、行政区划相关），使 `lpmap/pages/**` 下的页面只需写
 * `import { ... } from '../../api'` 即可。
 *
 * 命名风格：扁平 `Xxx`（与原 src/api/index.ts 保持一致）
 */
import request from '@/utils/http'

// 去除 VITE_API_PROXY_PORT_URL 末尾的斜杠（确保拼接 /zyxt/ 时不会双斜杠）
const VITE_API_PROXY_PORT_URL = (import.meta.env.VITE_API_PROXY_PORT_URL || '').replace(/\/$/, '')

// ==================== 人员位置相关 API ====================

/**
 * 获取人员最新位置
 * @param params 查询参数
 */
export const LatestLocations = (params: Record<string, any>) => {
  return request.get({ url: '/zyxt/api/locations/latest', params })
}

/**
 * 获取片区列表
 * @param params 查询参数
 */
export const GroupList = (params: Record<string, any> = {}) => {
  return request.get({ url: '/zyxt/api/locations/groups', params })
}

/**
 * 获取单个人员轨迹
 * @param usercode 用户编码
 * @param params 查询参数
 */
export const UserTrajectory = (usercode: string, params: Record<string, any> = {}) => {
  return request.get({ url: `/zyxt/api/locations/user/${usercode}`, params })
}

/**
 * 获取人员位置地址解析进度
 * @param params 查询参数
 */
export const LocationProgress = (params: Record<string, any> = {}) => {
  return request.get({ url: '/zyxt/api/locations/latest/progress', params })
}

// ==================== 热力图相关 API ====================

/**
 * 获取统计卡片数据
 * @param params 查询参数
 */
export const StatsCardsData = (params: Record<string, any> = {}) => {
  return request.get({ url: '/zyxt/api/statsCardsData', params })
}

/**
 * 获取热力图数据
 * @param params 查询参数
 */
export const HeatMapData = (params: Record<string, any> = {}) => {
  return request.get({ url: '/zyxt/api/hotmap', params })
}

/**
 * 获取热力图数据解析进度
 * @param params 查询参数
 */
export const HotmapProgress = (params: Record<string, any> = {}) => {
  return request.get({ url: '/zyxt/api/hotmap/progress', params })
}

// ==================== 行政区划相关 API ====================

/**
 * 获取地理位置信息（通过后端代理）
 * @param location 位置坐标
 */
export const Geocoder = (location: string) => {
  const url = `${VITE_API_PROXY_PORT_URL}/zyxt/api/map/geocoder?location=${location}`
  return request.get({ url })
}

/**
 * 搜索行政区划
 * @param keyword 搜索关键词
 */
export const SearchDistrict = (keyword: string) => {
  const url = `${VITE_API_PROXY_PORT_URL}/zyxt/api/map/district/search?keyword=${encodeURIComponent(keyword)}`
  return request.get({ url })
}

/**
 * 获取行政区划子节点
 * @param id 行政区划ID
 */
export const DistrictChildren = (id: string) => {
  return request.get({ url: '/zyxt/api/map/district/getchildren', params: { id } })
}
