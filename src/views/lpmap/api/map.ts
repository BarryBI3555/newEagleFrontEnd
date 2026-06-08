/**
 * dashboard 模块 — 地图相关 API
 *
 * 这些 API 之前零散在 `src/api/AllRequestMethods/index.ts`（遗留文件），
 * 现归入 dashboard 模块的 map 子对象。
 *
 * 用法：
 *   import { Map as MapApi } from '@/views/dashboard/api'
 *   MapApi.geocoder('lng,lat')
 */
import request from '@utils/http'

// 地图 / 行政区划辅助 API（与后端 /api/map/* 对应）
export const Map = {
  /**
   * 地理位置逆解析（lat,lng → 中文地址），走后端代理
   * @param location "lat,lng" 字符串
   */
  geocoder(location: string): Promise<any> {
    const VITE_API_PROXY_PORT_URL = import.meta.env.VITE_API_PROXY_PORT_URL
    const url = `${VITE_API_PROXY_PORT_URL}api/map/geocoder?location=${location}`
    return request.get({ url })
  },

  /**
   * 搜索行政区划
   * @param keyword 搜索关键词
   */
  searchDistrict(keyword: string): Promise<any> {
    const VITE_API_PROXY_PORT_URL = import.meta.env.VITE_API_PROXY_PORT_URL
    const url = `${VITE_API_PROXY_PORT_URL}api/map/district/search?keyword=${encodeURIComponent(keyword)}`
    return request.get({ url })
  },

  /**
   * 获取行政区划子节点
   * @param id 行政区划ID
   */
  districtChildren(id: string): Promise<any> {
    return request.get({ url: 'api/map/district/getchildren', params: { id } })
  }
}

export default Map
