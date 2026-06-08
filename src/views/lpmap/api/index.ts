/**
 * lpmap 模块 API 整合
 *
 * 统一从 @/api 引入并以本模块的命名风格再导出，
 * 使 `lpmap/pages/**` 下的页面只需写 `import { ... } from '../../api'` 即可。
 *
 * 命名风格：扁平 `Xxx`（与 src/api/index.ts 保持一致）
 */
export {
  LatestLocations,
  GroupList,
  UserTrajectory,
  LocationProgress,
  StatsCardsData,
  HeatMapData,
  HotmapProgress,
  Geocoder,
  SearchDistrict,
  DistrictChildren
} from '@/api'
