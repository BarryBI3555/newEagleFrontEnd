/**
 * dashboard 模块 API 整合
 * 仅 hotmap 和 personalmap 页面有 API 调用；7 个 personnel 模块使用硬编码数据，无需 API
 */
import request from '@utils/http'

// 页面: 3d-static-hot-map.vue
export const Hotmap = {
  getStatsCardsData(params: Record<string, any> = {}): Promise<any> {
    return request.get({ url: 'api/statsCardsData', params })
  },
  getHeatmapData(params: Record<string, any> = {}): Promise<any> {
    return request.get({ url: 'api/hotmap', params })
  },
  getHotmapProgress(params: Record<string, any> = {}): Promise<any> {
    return request.get({ url: 'api/hotmap/progress', params })
  }
}

// 页面: user-map.vue
export const PersonalMap = {
  getLatestLocations(params: Record<string, any> = {}): Promise<any> {
    return request.get({ url: '/api/locations/latest', params })
  },
  getGroupList(params: Record<string, any> = {}): Promise<any> {
    return request.get({ url: '/api/locations/groups', params })
  },
  getUserTrajectory(usercode: string, params: Record<string, any> = {}): Promise<any> {
    return request.get({ url: `/api/locations/user/${usercode}`, params })
  },
  getLocationProgress(params: Record<string, any> = {}): Promise<any> {
    return request.get({ url: '/api/locations/latest/progress', params })
  }
}
