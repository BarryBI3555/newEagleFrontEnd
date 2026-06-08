import request from '@/utils/http'

// 人员地图分布
export const personalmap = {
  /**
   * 获取人员最新位置
   * @param params 查询参数
   */
  axiosRequestLatestLocations(params) {
    return request.get({ url: '/zyxt/api/locations/latest', params })
  },
  /**
   * 获取片区列表
   * @param params 查询参数
   */
  axiosRequestGroupList(params) {
    return request.get({ url: '/zyxt/api/locations/groups', params })
  },
  /**
   * 获取单个人员轨迹
   * @param usercode 用户编码
   * @param params 查询参数
   */
  axiosRequestUserTrajectory(usercode, params) {
    return request.get({ url: `/zyxt/api/locations/user/${usercode}`, params })
  },
  /**
   * 获取人员位置地址解析进度
   * @param params 查询参数
   */
  axiosRequestLocationProgress(params) {
    return request.get({ url: '/zyxt/api/locations/latest/progress', params })
  }
}

// 热力图
export const hotmap = {
  /**
   * 获取统计卡片数据
   * @param params 查询参数
   */
  axiosRequestStatsCardsData(params) {
    return request.get({ url: '/zyxt/api/statsCardsData', params })
  },
  /**
   * 获取热力图数据
   * @param params 查询参数
   */
  axiosRequestHeatMapData(params) {
    return request.get({ url: '/zyxt/api/hotmap', params })
  },
  /**
   * 获取热力图数据解析进度
   * @param params 查询参数
   */
  axiosRequestHotmapProgress(params) {
    return request.get({ url: '/zyxt/api/hotmap/progress', params })
  }
}
