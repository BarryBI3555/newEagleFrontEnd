/**
 * operationLog 模块 API 整合
 */
import request from '@utils/http'

export const OperationLog = {
  getList(params: Record<string, any>): Promise<any> {
    return request.get({ url: 'api/log/query', params })
  }
}
