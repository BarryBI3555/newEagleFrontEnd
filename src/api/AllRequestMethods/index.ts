/**
 * 遗留文件（legacy）
 *
 * 整合后的 API 表面请见 `src/views/<feature>/api/index.ts`：
 * - efficiency 模块    → src/views/efficiency/api/index.ts
 * - dashboard 模块     → src/views/dashboard/api/index.ts
 * - operationLog 模块  → src/views/operationLog/api/index.ts
 * - management 模块    → src/views/management/api/index.ts
 *
 * 本文件仅保留地图行政区划相关的辅助 API（geocoder / searchDistrict / districtChildren），
 * 后续若有页面使用，按 feature 在对应模块的 api/index.ts 中新增对象。
 */
import request from '@/utils/http'

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
