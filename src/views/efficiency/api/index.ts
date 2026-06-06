/**
 * efficiency 模块 API 整合
 * 按页面一一对应，每个对象一个 getList 方法（多方法的页面用具描述性的动词）
 */
import request from '@utils/http'

// 页面: pacll-bm, pacll-ry, pacll-xz
export const PacllBm = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/pacll_bm/list', params })
  }
}
export const PacllRy = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/pacll_ry/list', params })
  }
}
export const PacllXz = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/pacll_xz/list', params })
  }
}

// 页面: zhouqi-bm, zhouqi-qs
export const ZhouqiBm = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/zhouqi_bm/list', params })
  }
}
export const ZhouqiQs = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/zhouqi_qs/list', params })
  }
}

// 页面: gzl-bm, gzl-group, gzl-ry, gzl-rs
export const GzlBm = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/cur_gzl_bm/list', params })
  }
}
export const GzlGroup = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/cur_gzl_group/list', params })
  }
}
export const GzlRy = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/cur_gzl/list', params })
  }
}
export const GzlRs = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/cur_gzl_rs/list', params })
  }
}

// 页面: zhpfl-khq
export const ZhpflKhq = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/zhpfl_khq/list', params })
  }
}

// 页面: pflsgn-zgs, pflsgn-khq, pflsgn-xny
export const PflsgnZgs = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/pflsgn_zgs/list', params })
  }
}
export const PflsgnKhq = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/pflsgn_khq/list', params })
  }
}
export const PflsgnXny = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/pflsgn_xny/list', params })
  }
}

// 页面: anjun-cx-zgs, anjun-cx-khq, anjun-cx-xny
export const AnjunCxZgs = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/anjun_cx_zgs/list', params })
  }
}
export const AnjunCxKhq = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/anjun_cx_khq/list', params })
  }
}
export const AnjunCxXny = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/anjun_cx_xny/list', params })
  }
}

// 页面: table-cur-gzl-bm/group/ry/rs（与 operations/daily/ 共享 URL，独立对象）
export const TableCurGzlBm = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/cur_gzl_bm/list', params })
  }
}
export const TableCurGzlGroup = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/cur_gzl_group/list', params })
  }
}
export const TableCurGzlRy = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/cur_gzl/list', params })
  }
}
export const TableCurGzlRs = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/cur_gzl_rs/list', params })
  }
}
