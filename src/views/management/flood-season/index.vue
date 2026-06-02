<template>
  <div class="flood-cockpit" :style="{ minHeight: containerMinHeight }">
    <!-- ==================== 顶部标题 ==================== -->
    <p class="cockpit-title">汛期驾驶舱</p>

    <!-- ==================== 气象信息滚动 ==================== -->
    <div class="scroll-bar">
      <ArtTextScroll
        v-if="scrollText"
        :text="scrollText"
        direction="left"
        :speed="50"
        type="warning"
      />
    </div>

    <!-- ==================== 左 + 右 主体 ==================== -->
    <div class="cockpit-body" ref="cockpitBodyRef">
      <!-- ============ 左侧 60% ============ -->
      <div class="left-col">
        <!-- 3 张占位统计卡片 -->
        <div class="stats-row">
          <div class="card-wrapper" v-for="c in statsCards" :key="c.id">
            <ArtStatsCard
              :title="c.title"
              :count="c.count"
              :description="c.description"
              :icon="c.icon"
              :icon-style="c.iconStyle"
              :style="{ height: '80px' }"
            />
          </div>
        </div>

        <!-- 地图容器 -->
        <div class="map-wrapper">
          <div id="rain-map-container" class="map-container">
            <div class="map-toolbar">
              <img
                src="@/assets/images/icon/网格.png"
                class="district-img-btn"
                @click="toggleDistricts"
                title="显示/隐藏行政区划"
              />
            </div>
            <!-- 当前预警措施浮窗（地图左下角） -->
            <div class="flood-place-panel" :class="{ collapsed: isPlacePanelCollapsed }">
              <div class="place-panel-header">
                <span class="place-panel-title">当前预警措施</span>
                <span
                  class="place-panel-toggle"
                  :title="isPlacePanelCollapsed ? '展开' : '收起'"
                  @click="isPlacePanelCollapsed = !isPlacePanelCollapsed"
                >
                  {{ isPlacePanelCollapsed ? '▶' : '◀' }}
                </span>
              </div>

              <div class="place-panel-body" v-show="!isPlacePanelCollapsed">
                <div v-if="processes.length === 0" class="place-empty">今日暂无预警措施</div>
                <div v-else class="process-list">
                  <div v-for="p in processes" :key="p.number" class="process-item">
                    <span class="process-number">{{ p.number }}</span>
                    <span class="process-text">{{ p.measure }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="mapLoading" class="map-loading">地图加载中...</div>
        </div>
      </div>

      <!-- ============ 右侧 40% ============ -->
      <div class="right-col">
        <!-- 值班信息 -->
        <div class="right-block zhiban-block">
          <div class="block-header">
            <span class="block-title">值班信息</span>
          </div>
          <ElTable
            :data="zhibans"
            stripe
            size="small"
            :height="zhibanTableHeight"
            class="zhiban-table"
          >
            <ElTableColumn prop="tjDate" label="值班日期" width="120" align="center" />
            <ElTableColumn prop="nameWorker" label="值班人员" align="center" />
            <ElTableColumn prop="nameLeader" label="值班领导" align="center" />
          </ElTable>
        </div>

        <!-- 标签页 -->
        <div class="right-block tabs-block">
          <ElTabs v-model="activeTab" class="rain-tabs">
            <ElTabPane label="施救单位" name="repair">
              <ElTable
                :data="repairs"
                stripe
                size="small"
                :height="tabsTableHeight"
                class="tabs-table"
              >
                <ElTableColumn
                  prop="name"
                  label="单位名称"
                  min-width="160"
                  align="center"
                  show-overflow-tooltip
                />
                <ElTableColumn prop="conPerson" label="联系人" width="80" align="center" />
                <ElTableColumn prop="tel" label="联系电话" width="120" align="center" />
                <ElTableColumn
                  prop="region"
                  label="服务区域"
                  min-width="180"
                  align="center"
                  show-overflow-tooltip
                />
              </ElTable>
            </ElTabPane>
            <ElTabPane label="中心对口联络机制" name="lianluo">
              <ElTable
                :data="lianluos"
                stripe
                size="small"
                :height="tabsTableHeight"
                class="tabs-table"
              >
                <ElTableColumn prop="workGroup" label="工作组" min-width="140" align="center" />
                <ElTableColumn prop="conPerson" label="联络人" min-width="120" align="center" />
                <ElTableColumn prop="nameWorker" label="工作人员" min-width="120" align="center" />
              </ElTable>
            </ElTabPane>
            <ElTabPane label="物资" name="items">
              <ElTable
                :data="items"
                stripe
                size="small"
                :height="tabsTableHeight"
                class="tabs-table"
              >
                <ElTableColumn prop="type" label="物资类型" min-width="120" align="center" />
                <ElTableColumn prop="item" label="物资名称" min-width="120" align="center" />
                <ElTableColumn prop="surplus" label="剩余" width="80" align="center" />
                <ElTableColumn prop="inv" label="库存" width="80" align="center" />
              </ElTable>
            </ElTabPane>
          </ElTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref, computed, nextTick } from 'vue'
  import { ElRow, ElCol, ElTabs, ElTabPane, ElTable, ElTableColumn } from 'element-plus'
  import { MapLoader } from '@/api/MapLoader/mapLoader'
  import { AdministrativeRegionManager } from '@/api/AdministrativeRegionmanager/AdministrativeRegionmanager'
  import { useAutoLayoutHeight } from '@/hooks/core/useLayoutHeight'
  import {
    axiosRequestRainDayLevel,
    axiosRequestRainCarPlace,
    axiosRequestRainZhiban,
    axiosRequestRainRepair,
    axiosRequestRainLianluo,
    axiosRequestRainItems,
    axiosRequestRainLevelProcess
  } from '@/api/AllRequestMethods/index'

  defineOptions({ name: 'FloodSeasonCockpit' })

  // 高度自适应：扣除顶栏 + 面包屑/页头后剩余可用高度
  const { containerMinHeight } = useAutoLayoutHeight()

  // 主体容器实际高度（不绑定响应式 ResizeObserver，避免 loop 告警）
  // 用 cockpit-body 作为高度源，两表瓜分该高度，避免相互撑高
  const cockpitBodyRef = ref<HTMLElement>()
  const cockpitBodyHeight = ref(0)
  const measureCockpitBody = () => {
    requestAnimationFrame(() => {
      cockpitBodyHeight.value = cockpitBodyRef.value?.clientHeight || 0
    })
  }
  // 右侧两表：各自独立上限，不再相互撑高
  const ZHIBAN_MAX = 280
  const TABS_MAX = 320
  const zhibanTableHeight = computed(() =>
    Math.min(ZHIBAN_MAX, Math.max(180, Math.floor(cockpitBodyHeight.value * 0.36)))
  )
  const tabsTableHeight = computed(() =>
    Math.min(TABS_MAX, Math.max(220, Math.floor(cockpitBodyHeight.value * 0.415)))
  )

  // ==================== 类型 ====================
  interface DayLevel {
    tjDate: string
    id: number
    rank: string
    warning: string
    meteor: string
  }
  interface CarPlace {
    id: number
    pName: string
    address: string
    region: string
    conPerson: string
    tel: string
    tel1: string
    remarks: string
    longitudeNew: number
    latitudeNew: number
  }
  interface Zhiban {
    tjDate: string
    nameWorker: string
    nameLeader: string
  }
  interface Repair {
    id: number
    name: string
    conPerson: string
    tel: string
    region: string
    scopeS: string
    remarks: string
  }
  interface Lianluo {
    workGroup: string
    conPerson: string
    nameWorker: string
  }
  interface Item {
    id: number
    type: string
    item: string
    surplus: number
    inv: number
  }

  // ==================== 列表（直接展示后端原数据） ====================
  const zhibans = ref<Zhiban[]>([])
  const repairs = ref<Repair[]>([])
  const lianluos = ref<Lianluo[]>([])
  const items = ref<Item[]>([])

  // ==================== 滚动文字 ====================
  const scrollText = ref('')
  const activeTab = ref<'repair' | 'lianluo' | 'items'>('repair')

  // ==================== 占位统计卡片 ====================
  const statsCards = [
    {
      id: 1,
      title: '占位卡片 1',
      count: 0,
      description: '待接入 KPI',
      icon: 'ri:cloud-rain-line',
      iconStyle: 'bg-primary'
    },
    {
      id: 2,
      title: '占位卡片 2',
      count: 0,
      description: '待接入 KPI',
      icon: 'ri:alert-line',
      iconStyle: 'bg-warning'
    },
    {
      id: 3,
      title: '占位卡片 3',
      count: 0,
      description: '待接入 KPI',
      icon: 'ri:shield-line',
      iconStyle: 'bg-success'
    }
  ]

  // ==================== 预警措施（今日） ====================
  interface LevelProcess {
    number: number
    measure: string
  }
  const processes = ref<LevelProcess[]>([])

  // ==================== 停车场数据（地图 marker） ====================
  const pendingPlaces = ref<CarPlace[]>([])

  // ==================== 浮窗状态 ====================
  const isPlacePanelCollapsed = ref(false)

  // ==================== 地图 ====================
  const mapLoading = ref(true)
  let map: any = null
  let markerLayer: any = null
  let regionManager: AdministrativeRegionManager | null = null
  let heat: any = null
  const mapLoader = MapLoader.getInstance()

  declare global {
    interface Window {
      TMap: any
    }
  }

  const toggleDistricts = () => regionManager?.toggleDistricts()

  // ==================== 拉取所有非地图数据 ====================
  const fetchAll = async () => {
    try {
      const [dayLevels, places, z, r, l, it, lp] = await Promise.all([
        axiosRequestRainDayLevel() as Promise<DayLevel[]>,
        axiosRequestRainCarPlace() as Promise<CarPlace[]>,
        axiosRequestRainZhiban() as Promise<Zhiban[]>,
        axiosRequestRainRepair() as Promise<Repair[]>,
        axiosRequestRainLianluo() as Promise<Lianluo[]>,
        axiosRequestRainItems() as Promise<Item[]>,
        axiosRequestRainLevelProcess() as Promise<LevelProcess[]>
      ])

      // 滚动文字
      scrollText.value = dayLevels?.length
        ? dayLevels
            .map((d) => `【${d.rank || '等级待定'}】 ${d.warning || ''} — ${d.meteor || ''}`)
            .join('    ●    ')
        : '今日暂无气象预警信息'

      zhibans.value = z || []
      repairs.value = r || []
      lianluos.value = l || []
      items.value = it || []
      processes.value = lp || []

      // 暂存停车点位，等地图就绪后渲染（修复竞态）
      pendingPlaces.value = places || []
      if (map) renderMarkers(pendingPlaces.value)
    } catch (err) {
      console.error('[汛期驾驶舱] 数据拉取失败：', err)
    }
  }

  // ==================== 地图初始化 ====================
  const initMap = async () => {
    try {
      await mapLoader.loadMapApi()
      await nextTick()

      const container = document.getElementById('rain-map-container')
      if (!container) return

      const center = new window.TMap.LatLng(30.6799, 104.0571)
      map = new window.TMap.Map(container, {
        zoom: 9.5,
        pitch: 0,
        center,
        mapStyleId: 'style1'
      })

      regionManager = new AdministrativeRegionManager(map)
      await regionManager.showDistricts()

      // 初始化热力图层（数据为占位，接口待定）
      initHeatMap()
      refreshHeatMap()

      // 地图就绪后再渲染 marker（若数据已回来）
      if (pendingPlaces.value.length) renderMarkers(pendingPlaces.value)

      mapLoading.value = false
    } catch (err: any) {
      console.error('地图加载失败：', err)
      mapLoading.value = false
    }
  }

  // ==================== 渲染停车点位 ====================
  const renderMarkers = (places: CarPlace[]) => {
    if (!map || !window.TMap) return
    const valid = places.filter((p) => p.longitudeNew && p.latitudeNew)
    if (!valid.length) return

    const geometries = valid.map((p) => ({
      id: String(p.id),
      styleId: 'parking',
      position: new window.TMap.LatLng(p.latitudeNew, p.longitudeNew),
      properties: { ref: p }
    }))

    if (markerLayer) markerLayer.setMap(null)
    markerLayer = new window.TMap.MultiMarker({
      map,
      styles: {
        parking: new window.TMap.MarkerStyle({
          width: 28,
          height: 32,
          anchor: { x: 14, y: 32 },
          src: '/src/assets/images/icon/Location.png'
        })
      },
      geometries
    })

    // 自适应视野
    const bounds = new window.TMap.LatLngBounds()
    valid.forEach((p) => bounds.extend(new window.TMap.LatLng(p.latitudeNew, p.longitudeNew)))
    map.fitBounds(bounds, { padding: 60 })
  }

  // ==================== 热力图 ====================
  const initHeatMap = () => {
    if (!map || !window.TMap?.visualization?.Heat) return
    heat = new window.TMap.visualization.Heat({
      max: 3,
      min: 0,
      height: 80,
      radius: 30,
      transitAnimation: { duration: 3000 }
    }).addTo(map)
  }

  const refreshHeatMap = () => {
    if (!heat) return
    // 清空当前热力图数据（占位行为）
    heat.setData([])
    console.log('[汛期驾驶舱] 刷新热力图（占位）')

    // TODO: 热力图数据 API 尚未确定 — 待后端提供后接入
    //   - 数据格式：Array<{ lng: number, lat: number, count: number }>
    //   - 接入后把 setData([]) 替换为真实数据
  }

  // ==================== 生命周期 ====================
  onMounted(() => {
    initMap()
    fetchAll()
    // 初次测量 + 监听窗口缩放，避免 ResizeObserver 循环
    measureCockpitBody()
    window.addEventListener('resize', measureCockpitBody)
  })

  onBeforeUnmount(() => {
    if (heat) {
      heat.setMap(null)
      heat = null
    }
    if (markerLayer) markerLayer.setMap(null)
    if (map) {
      map.destroy()
      map = null
    }
    window.removeEventListener('resize', measureCockpitBody)
  })
</script>

<style scoped>
  .flood-cockpit {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }

  /* ==================== 标题 ==================== */
  .cockpit-title {
    margin: 0;
    padding: 14px 0;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    color: #f3f4f6;
    background: linear-gradient(
      90deg,
      rgba(31, 41, 55, 0.95),
      rgba(17, 24, 39, 0.95),
      rgba(31, 41, 55, 0.95)
    );
    border-radius: 8px;
    letter-spacing: 4px;
  }

  /* ==================== 滚动条 ==================== */
  .scroll-bar {
    height: 36px;
  }

  /* ==================== 主体 ==================== */
  .cockpit-body {
    flex: 1;
    display: flex;
    gap: 10px;
    min-height: 0;
    overflow: hidden;
  }

  .left-col,
  .right-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    height: 100%;
    overflow: hidden;
  }

  .left-col {
    flex: 0 0 60%;
  }

  .right-col {
    flex: 0 0 calc(40% - 10px);
  }

  /* ==================== 卡片 ==================== */
  .stats-row {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
    margin-bottom: 10px;
  }
  .card-wrapper {
    flex: 1 1 0;
    min-width: 0;
    height: 75px;
  }
  /* 覆盖 ArtStatsCard 内部样式，让 60px 容器装下三行 */
  .card-wrapper :deep(.text-lg) {
    font-size: 13px !important;
    line-height: 1.1;
  }
  .card-wrapper :deep(.text-2xl) {
    font-size: 13px !important;
    line-height: 1.1;
  }
  .card-wrapper :deep(.text-sm) {
    font-size: 13px !important;
    line-height: 1.1;
  }
  .card-wrapper :deep(.size-11) {
    width: 28px !important;
    height: 28px !important;
  }
  .card-wrapper :deep(.text-xl) {
    font-size: 14px !important;
  }
  .card-wrapper :deep(.art-card) {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  /* ==================== 地图 ==================== */
  .map-wrapper {
    position: relative;
    flex: 1 1 auto;
    min-height: 320px;
    margin-bottom: 10px;
    overflow: hidden;
  }

  .map-container {
    width: 100%;
    height: 61vh;
    border-radius: 8px;
    position: relative;
  }

  .map-toolbar {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(17, 24, 39, 0.9);
    padding: 4px 6px;
    border-radius: 6px;
    border: 1px solid #374151;
  }

  .district-img-btn {
    width: 26px;
    height: 26px;
    cursor: pointer;
    opacity: 0.9;
    filter: brightness(0) invert(1);
    border: 1px solid #9ca3af;
    border-radius: 4px;
    padding: 3px;
  }

  .map-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    background: rgba(31, 41, 55, 0.9);
    padding: 12px 24px;
    border-radius: 8px;
  }

  /* ==================== 停车场详情面板 ==================== */
  .flood-place-panel {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 9999;
    width: 320px;
    background: #1f2937;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    color: #e5e7eb;
    font-size: 13px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #374151;
  }

  .flood-place-panel.collapsed {
    width: 130px;
  }

  .place-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(31, 41, 55, 0.9);
    border-bottom: 1px solid #374151;
    cursor: default;
  }

  .place-panel-title {
    font-size: 14px;
    font-weight: 600;
    color: #f3f4f6;
  }

  .place-panel-toggle {
    cursor: pointer;
    color: #9ca3af;
    font-size: 12px;
    user-select: none;
    padding: 2px 6px;
    border-radius: 4px;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }
  .place-panel-toggle:hover {
    background: #374151;
    color: #fff;
  }

  .place-panel-body {
    padding: 10px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .place-empty {
    text-align: center;
    color: #9ca3af;
    font-size: 12px;
    padding: 20px 0;
  }

  .process-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .process-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #2d3a4a;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 10px 12px;
    line-height: 1.6;
  }

  .process-number {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 22px;
    padding: 0 8px;
    background: #3b82f6;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    border-radius: 10px;
  }

  .process-text {
    flex: 1;
    color: #e5e7eb;
    font-size: 12px;
    word-break: break-all;
  }

  .place-panel-body::-webkit-scrollbar {
    width: 4px;
  }
  .place-panel-body::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 10px;
  }
  .place-panel-body::-webkit-scrollbar-track {
    background: #1f2937;
  }

  /* ==================== 右侧 ==================== */
  .right-block {
    background: rgba(17, 17, 17, 0.7);
    border: 0.5px solid rgba(156, 163, 175, 0.3);
    border-radius: 8px;
    padding: 10px;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .right-block > * {
    min-height: 0;
  }

  /* 第二个 right-block（tabs 区）固定高度，不撑满 */
  .tabs-block {
    flex: 0 0 auto;
    min-height: 0;
  }

  .rain-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .rain-tabs :deep(.el-tabs__header) {
    margin: 0 0 8px 0;
    flex-shrink: 0;
  }
  .rain-tabs :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }
  .rain-tabs :deep(.el-tab-pane) {
    height: 100%;
  }

  .tab-content {
    height: 100%;
    overflow: auto;
  }

  /* ==================== 表格区 ==================== */
  .block-header {
    flex-shrink: 0;
    padding: 0 4px 8px;
  }
  .block-title {
    font-size: 16px;
    font-weight: 600;
    color: #f3f4f6;
  }

  /* 值班表：固定高度（由 :height 动态计算），列头吸顶 + 内部滚动由 el-table 自身管理 */
  .zhiban-block {
    flex: 0 0 auto;
    min-height: 0;
  }

  /* Tab 表：固定高度，由 :height 控制 */
  .tabs-block {
    flex: 0 0 auto;
    min-height: 0;
  }
</style>
