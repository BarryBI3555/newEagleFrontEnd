<template>
  <div class="flex flex-col gap-2 pb-3">
    <ArtSearchBar
      ref="searchBarRef"
      v-model="searchFormState"
      :items="searchItems"
      :rules="rules"
      :is-expand="false"
      :show-expand="true"
      :show-reset-button="true"
      :show-search-button="true"
      :disabled-search-button="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard class="flex-1 art-table-card" style="margin-top: 0;padding: 5px;">
      <template #header>
        <div class="flex-cb">
          <h4 class="m-0">周期-人员【统计时间：{{ currentMaxTjTime }}】</h4>
          <div class="flex gap-1">
            <ElTag v-if="tableError" type="danger">{{ tableError.message }}</ElTag>
            <ElTag v-else-if="loading" type="warning">加载中...</ElTag>
            <ElTag v-else type="success">{{ tableData.length }} 条数据</ElTag>
          </div>
        </div>
      </template>

      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        @refresh="handleRefresh"
        layout="refresh,size,fullscreen,columns,settings"
        fullClass="art-table-card"
      >
        <template #left>
          <ElSpace wrap>
            <ElDropdown split-button type="primary" @click="handleExportCurrent" v-ripple>
              <ElIcon><Download /></ElIcon>
              导出当前页
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem @click="handleExportCurrent">导出当前页</ElDropdownItem>
                  <ElDropdownItem @click="handleExportAll">导出全部</ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="tableRef"
        :loading="loading"
        :pagination="pagination"
        :data="tableData"
        :columns="columns"
        :height="computedTableHeight"
        :scrollbar-always-on="true"
        empty-height="660px"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @header-click="handleHeaderClick"
        @sort-change="handleSortChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #index="{ $index }">
          <span>{{ $index + 1 + (pagination.current - 1) * pagination.size }}</span>
        </template>
        <template #comname="{ row }"><span>{{ row.comname }}</span></template>
        <template #username="{ row }"><span>{{ row.username }}</span></template>
        <template #usercode="{ row }"><span>{{ row.usercode }}</span></template>
        <template #groups="{ row }"><span>{{ row.groups }}</span></template>
        <template #chakanZt="{ row }"><span>{{ row.chakanZt }}</span></template>
        <template #cuidingZt="{ row }"><span>{{ row.cuidingZt }}</span></template>
        <template #dingsunZt="{ row }"><span>{{ row.dingsunZt }}</span></template>
        <template #zhifuZt="{ row }"><span>{{ row.zhifuZt }}</span></template>
        <template #zhouqiZt="{ row }"><span>{{ row.zhouqiZt }}</span></template>
        <template #zhouqiWyn="{ row }"><span>{{ row.zhouqiWyn }}</span></template>
        <template #zhouqiWys="{ row }"><span>{{ row.zhouqiWys }}</span></template>
        <template #id="{ row }">
          <span>{{ row.id !== null && row.id !== undefined ? row.id : '' }}</span>
        </template>
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, nextTick, watch } from 'vue'
  import { Download } from '@element-plus/icons-vue'
  import { ElNotification } from 'element-plus'
  import { useTable } from '@/hooks/core/useTable'
  import * as XLSX from 'xlsx'
  import { axiosRequestZhouqiRy } from '@/api/AllRequestMethods/index'

  defineOptions({ name: 'ZhouqiRyTable' })

  // ==================== 1. 类型定义 ====================
  interface ZhouqiRyData {
    id: number | null | undefined
    tjDate: string | null
    comname: string
    comcode: string
    username: string
    usercode: string
    groups: string
    groupscode: string
    chakanZt: number
    cuidingZt: number
    dingsunZt: number
    zhifuZt: number
    zhouqiZt: number
    zhouqiWyn: number
    zhouqiWys: number
    maxTjTime: string | null
  }

  interface SelectOption { label: string; value: string }
  interface GroupOption extends SelectOption { groupsCode: string | number }
  interface DeptGroupMap { [deptName: string]: GroupOption[] }
  interface UseTableParams { current: number; size: number; [key: string]: any }
  interface UseTableResult<T> { records: T[]; total: number; current: number; size: number }

  // ==================== 2. 状态 ====================
  const searchBarRef = ref<any>(null)
  const allOriginData = ref<ZhouqiRyData[]>([])
  const fullComOptions = ref<SelectOption[]>([])
  const fullGroupOptions = ref<GroupOption[]>([])
  const deptGroupMap = ref<DeptGroupMap>({})
  const currentMaxTjTime = ref<string>('')
  const isInitialized = ref(false)
  const comOptions = ref<SelectOption[]>([])
  const groupOptions = ref<SelectOption[]>([])

  // ==================== 3. 搜索表单 ====================
  const rules = { tjDate: [{ required: false, message: '请选择统计时间', trigger: 'change' }] }
  const searchFormState = ref({ tjDate: '', comname: '', groups: '', username: '' })
  const tableApiParams = ref({ current: 1, size: 20, ...searchFormState.value })

  const searchItems = computed(() => [
    { key: 'tjDate', label: '统计时间', type: 'date', props: { placeholder: '选择统计时间', valueFormat: 'YYYY-MM-DD' } },
    { key: 'comname', label: '部门', type: 'select', props: { placeholder: '请选择部门', options: comOptions.value, clearable: true } },
    { key: 'groups', label: '小组', type: 'select', props: { placeholder: '请选择小组', options: groupOptions.value, clearable: true, disabled: !searchFormState.value.comname } },
    { key: 'username', label: '人员', type: 'input', props: { placeholder: '请输入人员名称' } }
  ])

  // ==================== 4. 表格样式 ====================
  const tableConfig = ref({ height: '100%', fixedHeight: false })
  const computedTableHeight = computed(() => (tableConfig.value.fixedHeight ? '660px' : 'calc(100vh - 330px)'))

  // ==================== 5. 构建下拉 ====================
  const sortGroupByCode = (groups: GroupOption[]) => {
    return groups.sort((a, b) => {
      const codeA = typeof a.groupsCode === 'string' ? parseInt(a.groupsCode) || 0 : a.groupsCode
      const codeB = typeof b.groupsCode === 'string' ? parseInt(b.groupsCode) || 0 : b.groupsCode
      return codeA - codeB
    })
  }

  const buildDeptGroupMap = (data: ZhouqiRyData[]) => {
    if (fullComOptions.value.length && Object.keys(deptGroupMap.value).length) return
    const comSet = new Set<string>()
    const tempDeptGroupMap: DeptGroupMap = {}
    data.forEach((item) => {
      if (!item.comname) return
      comSet.add(item.comname)
      if (item.groups && item.groupscode) {
        if (!tempDeptGroupMap[item.comname]) tempDeptGroupMap[item.comname] = []
        const exists = tempDeptGroupMap[item.comname].some((g) => g.value === item.groups)
        if (!exists) { tempDeptGroupMap[item.comname].push({ label: item.groups, value: item.groups, groupsCode: item.groupscode }) }
      }
    })
    fullComOptions.value = Array.from(comSet).map((name) => ({ label: name, value: name }))
    comOptions.value = [...fullComOptions.value]
    Object.keys(tempDeptGroupMap).forEach((dept) => { tempDeptGroupMap[dept] = sortGroupByCode(tempDeptGroupMap[dept]) })
    deptGroupMap.value = tempDeptGroupMap
    const allGroups: GroupOption[] = []
    Object.values(tempDeptGroupMap).forEach((gList) => { gList.forEach((g) => { if (!allGroups.some((item) => item.value === g.value)) allGroups.push(g) }) })
    fullGroupOptions.value = sortGroupByCode(allGroups)
    ElNotification({ title: '提示', message: `已加载：${fullComOptions.value.length} 个部门，共 ${fullGroupOptions.value.length} 个小组`, type: 'success' })
  }

  // ==================== 6. 级联监听 ====================
  watch(() => searchFormState.value.comname, (newDept) => {
    if (newDept) {
      const sortedGroups = deptGroupMap.value[newDept] || []
      groupOptions.value = sortedGroups.map((g) => ({ label: g.label, value: g.value }))
      searchFormState.value.groups = ''
    } else { groupOptions.value = []; searchFormState.value.groups = '' }
  }, { immediate: true })

  // ==================== 7. 表格 Hook ====================
  const { data: tableData, loading, error: tableError, pagination, refreshData, handleSizeChange, handleCurrentChange, columns, columnChecks } = useTable({
    core: {
      apiFn: async (params: UseTableParams): Promise<UseTableResult<ZhouqiRyData>> => {
        const queryParams = {
          current: params.current, size: params.size,
          tjDate: tableApiParams.value.tjDate || '',
          comname: tableApiParams.value.comname ?? '',
          groups: tableApiParams.value.groups ?? '',
          username: tableApiParams.value.username ?? ''
        }
        const response = await axiosRequestZhouqiRy(queryParams)
        let tableResultData: ZhouqiRyData[] = []
        if (Array.isArray(response)) {
          tableResultData = response
          if (!isInitialized.value && tableResultData.length) {
            allOriginData.value = [...tableResultData]
            buildDeptGroupMap(allOriginData.value)
            isInitialized.value = true
          }
          if (tableResultData.length) {
            currentMaxTjTime.value = tableResultData[0].maxTjTime || ''
            if (!searchFormState.value.tjDate && tableResultData[0].maxTjTime) {
              searchFormState.value.tjDate = tableResultData[0].maxTjTime.substring(0, 10)
            }
          } else { currentMaxTjTime.value = '' }
        }
        const start = (params.current - 1) * params.size
        return { records: tableResultData.slice(start, start + params.size), total: tableResultData.length, current: params.current, size: params.size }
      },
      apiParams: tableApiParams.value,
      immediate: true,
      columnsFactory: () => [
        { prop: 'comname', label: '部门', minWidth: 180, align: 'center', fixed: 'left', sortable: true },
        { prop: 'username', label: '人员', width: 100, align: 'center', fixed: 'left' },
        { prop: 'usercode', label: '人员编码', width: 120, align: 'center', sortable: true },
        { prop: 'groups', label: '小组', width: 120, align: 'center', sortable: true },
        { prop: 'chakanZt', label: '查勘整体', width: 110, align: 'center', sortable: true },
        { prop: 'cuidingZt', label: '催定整体', width: 110, align: 'center', sortable: true },
        { prop: 'dingsunZt', label: '定损整体', width: 110, align: 'center', sortable: true },
        { prop: 'zhifuZt', label: '支付整体', width: 110, align: 'center', sortable: true },
        { prop: 'zhouqiZt', label: '周期整体', width: 110, align: 'center', sortable: true },
        { prop: 'zhouqiWyn', label: '周期万元内', width: 120, align: 'center', sortable: true },
        { prop: 'zhouqiWys', label: '周期万元以上', width: 130, align: 'center', sortable: true }
      ]
    },
    performance: { enableCache: true, cacheTime: 5 * 60 * 1000, debounceTime: 300, maxCacheSize: 100 }
  })

  // ==================== 8. 事件 ====================
  const tableRef = ref<any>(null)
  const handleSelectionChange = () => {}
  const handleRowClick = () => {}
  const handleHeaderClick = () => {}
  const handleSortChange = () => {}

  // ==================== 9. 操作 ====================
  const handleRefresh = async () => {
    try {
      const res = await axiosRequestZhouqiRy({ current: 1, size: 9999 })
      if (Array.isArray(res) && res.length) {
        allOriginData.value = [...res]
        buildDeptGroupMap(allOriginData.value)
        currentMaxTjTime.value = res[0].maxTjTime || ''
      }
      refreshData()
    } catch { refreshData() }
  }

  const handleSearch = async () => {
    try {
      if (searchBarRef.value) await searchBarRef.value.validate()
      tableApiParams.value = { ...tableApiParams.value, ...searchFormState.value }
      refreshData()
      ElNotification({ title: '提示', message: '搜索成功', type: 'success' })
    } catch { ElNotification({ title: '错误', message: '搜索条件校验失败', type: 'error' }) }
  }

  const handleReset = () => {
    searchFormState.value = { tjDate: '', comname: '', groups: '', username: '' }
    tableApiParams.value = { current: 1, size: 20, ...searchFormState.value }
    refreshData()
  }

  // ==================== 10. 导出 ====================
  const handleExportCurrent = async () => {
    const data = tableData.value as ZhouqiRyData[]
    if (!data.length) { ElNotification({ title: '提示', message: '暂无数据可导出', type: 'warning' }); return }
    const exportData = data.map((item, index) => ({
      序号: index + 1, 部门: item.comname, 人员: item.username, 人员编码: item.usercode, 小组: item.groups,
      查勘整体: item.chakanZt, 催定整体: item.cuidingZt, 定损整体: item.dingsunZt,
      支付整体: item.zhifuZt, 周期整体: item.zhouqiZt, 周期万元内: item.zhouqiWyn, 周期万元以上: item.zhouqiWys
    }))
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '周期-人员')
    XLSX.writeFile(wb, `周期-人员_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`)
    ElNotification({ title: '成功', message: '导出成功', type: 'success' })
  }

  const handleExportAll = async () => {
    try {
      const res = await axiosRequestZhouqiRy(tableApiParams.value)
      const data = (Array.isArray(res) ? res : []) as ZhouqiRyData[]
      if (!data.length) { ElNotification({ title: '提示', message: '暂无数据可导出', type: 'warning' }); return }
      const exportData = data.map((item, index) => ({
        序号: index + 1, 部门: item.comname, 人员: item.username, 人员编码: item.usercode, 小组: item.groups,
        查勘整体: item.chakanZt, 催定整体: item.cuidingZt, 定损整体: item.dingsunZt,
        支付整体: item.zhifuZt, 周期整体: item.zhouqiZt, 周期万元内: item.zhouqiWyn, 周期万元以上: item.zhouqiWys
      }))
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '周期-人员')
      XLSX.writeFile(wb, `周期-人员_全部_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`)
      ElNotification({ title: '成功', message: `${data.length} 条数据导出成功`, type: 'success' })
    } catch { ElNotification({ title: '错误', message: '导出失败', type: 'error' }) }
  }

  onMounted(async () => { await nextTick(); if (searchBarRef.value) searchBarRef.value.$forceUpdate?.() })
</script>

<style scoped>
  .el-form-item { height: 0px; line-height: 0px; }
  .custom-header:hover { color: var(--el-color-primary-light-3); padding: 12px 12px 12px; }
  .demo-group .config-toggles .el-switch { --el-switch-on-color: var(--el-color-primary); }
  .demo-group .performance-info .el-alert { --el-alert-padding: 12px; }
</style>
