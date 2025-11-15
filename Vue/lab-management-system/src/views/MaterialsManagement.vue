<template>
  <div class="materials-management">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <h1 class="page-title">物资管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加物资
        </el-button>
        <el-button @click="loadData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 筛选区域 - 只保留类别和状态 -->
    <div class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="类别">
          <el-select
            v-model="filterForm.category"
            placeholder="请选择类别"
            clearable
            @change="handleFilter"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="设备" value="equipment" />
            <el-option label="消耗品" value="consumable" />
            <el-option label="图书" value="book" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            @change="handleFilter"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="可用" value="available" />
            <el-option label="不可用" value="unavailable" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ statistics.totalItems }}</div>
          <div class="stat-label">物资总数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ statistics.availableItems }}</div>
          <div class="stat-label">可用物资</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">¥{{ statistics.totalValue }}</div>
          <div class="stat-label">总资产价值</div>
        </div>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <div class="table-card">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="material_code" label="物资编号" width="130" />
        <el-table-column prop="name" label="物资名称" width="200" />
        <el-table-column prop="category" label="类别" width="100">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)">
              {{ getCategoryLabel(row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="total_quantity" label="总数量" width="80" align="center" />
        <el-table-column prop="available_quantity" label="可用数量" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.available_quantity > 0 ? 'success' : 'danger'">
              {{ row.available_quantity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="存放位置" width="150" />
        <el-table-column prop="unit_price" label="单价" width="100">
          <template #default="{ row }">
            ¥{{ Number(row.unit_price || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'available' ? 'success' : 'info'">
              {{ row.status === 'available' ? '可用' : '不可用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)" size="small">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button link type="primary" @click="handleEdit(row)" size="small">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button 
              link 
              type="warning" 
              @click="handleBorrow(row)" 
              size="small"
              :disabled="row.available_quantity === 0"
            >
              <el-icon><Download /></el-icon>
              借出
            </el-button>
            <el-button 
              link 
              type="success" 
              @click="handleReturn(row)" 
              size="small"
              :disabled="row.available_quantity >= row.total_quantity"
            >
              <el-icon><Upload /></el-icon>
              归还
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)" size="small">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="物资编号" prop="material_code">
          <el-input
            v-model="form.material_code"
            placeholder="请输入物资编号"
            :disabled="!!form.id"
          />
        </el-form-item>
        <el-form-item label="物资名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入物资名称" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select v-model="form.category" placeholder="请选择类别" style="width: 100%">
            <el-option label="设备" value="equipment" />
            <el-option label="消耗品" value="consumable" />
            <el-option label="图书" value="book" />
          </el-select>
        </el-form-item>
        <el-form-item label="总数量" prop="total_quantity">
          <el-input-number v-model="form.total_quantity" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="可用数量" prop="available_quantity">
          <el-input-number
            v-model="form.available_quantity"
            :min="0"
            :max="form.total_quantity"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="存放位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入存放位置" />
        </el-form-item>
        <el-form-item label="采购日期">
          <el-date-picker
            v-model="form.purchase_date"
            type="date"
            placeholder="请选择采购日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="form.unit_price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入物资描述"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 借出对话框 -->
    <el-dialog
      v-model="borrowDialogVisible"
      title="借出物资"
      width="500px"
      @close="handleOperationDialogClose"
    >
      <el-form
        ref="borrowFormRef"
        :model="borrowForm"
        :rules="operationFormRules"
        label-width="100px"
      >
        <el-form-item label="物资名称">
          <el-input v-model="borrowForm.name" disabled />
        </el-form-item>
        <el-form-item label="当前可用">
          <el-input v-model.number="borrowForm.current_available" disabled />
        </el-form-item>
        <el-form-item label="借出数量" prop="quantity">
          <el-input-number
            v-model="borrowForm.quantity"
            :min="1"
            :max="borrowForm.current_available"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="borrowDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBorrowSubmit">确定借出</el-button>
      </template>
    </el-dialog>

    <!-- 归还对话框 -->
    <el-dialog
      v-model="returnDialogVisible"
      title="归还物资"
      width="500px"
      @close="handleOperationDialogClose"
    >
      <el-form
        ref="returnFormRef"
        :model="returnForm"
        :rules="operationFormRules"
        label-width="100px"
      >
        <el-form-item label="物资名称">
          <el-input v-model="returnForm.name" disabled />
        </el-form-item>
        <el-form-item label="当前可用">
          <el-input v-model.number="returnForm.current_available" disabled />
        </el-form-item>
        <el-form-item label="总数量">
          <el-input v-model.number="returnForm.total_quantity" disabled />
        </el-form-item>
        <el-form-item label="归还数量" prop="quantity">
          <el-input-number
            v-model="returnForm.quantity"
            :min="1"
            :max="returnForm.total_quantity - returnForm.current_available"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="returnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReturnSubmit">确定归还</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="物资详情"
      width="700px"
    >
      <el-descriptions :column="2" border v-if="currentDetail">
        <el-descriptions-item label="ID">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="物资编号">{{ currentDetail.material_code }}</el-descriptions-item>
        <el-descriptions-item label="物资名称">{{ currentDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="类别">
          <el-tag :type="getCategoryType(currentDetail.category)">
            {{ getCategoryLabel(currentDetail.category) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="总数量">{{ currentDetail.total_quantity }}</el-descriptions-item>
        <el-descriptions-item label="可用数量">
          <el-tag :type="currentDetail.available_quantity > 0 ? 'success' : 'danger'">
            {{ currentDetail.available_quantity }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="存放位置" :span="2">{{ currentDetail.location }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentDetail.status === 'available' ? 'success' : 'info'">
            {{ currentDetail.status === 'available' ? '可用' : '不可用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="采购日期">{{ currentDetail.purchase_date || '-' }}</el-descriptions-item>
        <el-descriptions-item label="单价">¥{{ Number(currentDetail.unit_price || 0).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ currentDetail.description || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ formatDate(currentDetail.created_at) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ formatDate(currentDetail.updated_at) }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Search, Refresh, View, Edit, Delete, Download, Upload
} from '@element-plus/icons-vue'
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  updateMaterialQuantity,
  getAvailableMaterials
} from '../utils.js'

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

// 筛选表单
const filterForm = reactive({
  category: '',
  status: ''
})

// 统计数据
const statistics = reactive({
  totalItems: 0,
  availableItems: 0,
  totalValue: 0
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加物资')
const detailVisible = ref(false)
const currentDetail = ref(null)
const borrowDialogVisible = ref(false)
const returnDialogVisible = ref(false)

// 表单
const formRef = ref(null)
const form = reactive({
  id: null,
  material_code: '',
  name: '',
  category: '',
  total_quantity: 0,
  available_quantity: 0,
  location: '',
  purchase_date: '',
  unit_price: 0,
  description: ''
})

// 借出表单
const borrowFormRef = ref(null)
const borrowForm = reactive({
  id: null,
  name: '',
  current_available: 0,
  quantity: 1
})

// 归还表单
const returnFormRef = ref(null)
const returnForm = reactive({
  id: null,
  name: '',
  current_available: 0,
  total_quantity: 0,
  quantity: 1
})

// 表单验证规则
const formRules = {
  material_code: [{ required: true, message: '请输入物资编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
  total_quantity: [{ required: true, message: '请输入总数量', trigger: 'blur' }],
  available_quantity: [{ required: true, message: '请输入可用数量', trigger: 'blur' }],
  location: [{ required: true, message: '请输入存放位置', trigger: 'blur' }]
}

// 操作表单验证规则
const operationFormRules = {
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}

// 类别标签转换
const getCategoryLabel = (category) => {
  const map = {
    equipment: '设备',
    consumable: '消耗品',
    book: '图书'
  }
  return map[category] || category
}

// 类别标签类型
const getCategoryType = (category) => {
  const map = {
    equipment: 'success',
    consumable: 'warning',
    book: 'info'
  }
  return map[category] || 'info'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      category: filterForm.category || undefined,
      status: filterForm.status || undefined
    }

    const response = await getMaterials(params)
    // utils.js 的拦截器返回的是 { code, message, data }
    const data = response?.data || {}

    // 支持 data.items 或 data.materials
    let items = data.items || data.materials || []

    // 统一将 unit_price 转为 Number，避免模板中 toFixed 报错
    items = items.map(it => ({
      ...it,
      unit_price: it.unit_price !== undefined && it.unit_price !== null ? Number(it.unit_price) : 0
    }))

    tableData.value = items

    // 兼容分页字段命名：page,pageSize/ page_size, total, total_pages/totalPages
    const pg = data.pagination || {}
    pagination.page = pg.page ?? pg.page_number ?? pagination.page
    pagination.pageSize = pg.pageSize ?? pg.page_size ?? pagination.pageSize
    pagination.total = pg.total ?? pg.total_count ?? 0
    pagination.totalPages = pg.totalPages ?? pg.total_pages ?? pagination.totalPages

    calculateStatistics()
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 计算统计数据
const calculateStatistics = () => {
  statistics.totalItems = pagination.total
  statistics.availableItems = tableData.value.reduce((sum, item) => sum + (Number(item.available_quantity) || 0), 0)
  statistics.totalValue = tableData.value.reduce((sum, item) => {
    return sum + (Number(item.total_quantity || 0) * (Number(item.unit_price || 0)))
  }, 0).toFixed(2)
}

// 筛选
const handleFilter = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  filterForm.category = ''
  filterForm.status = ''
  pagination.page = 1
  loadData()
}

// 分页
const handlePageChange = (page) => {
  pagination.page = page
  loadData()
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.page = 1
  loadData()
}

// 添加
const handleAdd = () => {
  dialogTitle.value = '添加物资'
  resetForm()
  dialogVisible.value = true
}

// 查看
const handleView = async (row) => {
  try {
    const response = await getMaterialById(row.id)
    const d = response.data || {}
    // 归一化数值字段，避免模板调用 toFixed 时出错
    d.unit_price = d.unit_price != null ? Number(d.unit_price) : 0
    d.total_quantity = d.total_quantity != null ? Number(d.total_quantity) : 0
    d.available_quantity = d.available_quantity != null ? Number(d.available_quantity) : 0
    currentDetail.value = d
     detailVisible.value = true
   } catch (error) {
     console.error('获取详情失败:', error)
   }
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑物资'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除物资 "${row.name}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteMaterial(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 借出
const handleBorrow = (row) => {
  borrowForm.id = row.id
  borrowForm.name = row.name
  borrowForm.current_available = row.available_quantity
  borrowForm.quantity = 1
  borrowDialogVisible.value = true
}

// 借出提交
const handleBorrowSubmit = async () => {
  if (!borrowFormRef.value) return
  
  await borrowFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateMaterialQuantity(borrowForm.id, {
          operation: 'borrow',
          quantity: borrowForm.quantity
        })
        
        ElMessage.success('借出成功')
        borrowDialogVisible.value = false
        loadData()
      } catch (error) {
        console.error('借出失败:', error)
      }
    }
  })
}

// 归还
const handleReturn = (row) => {
  returnForm.id = row.id
  returnForm.name = row.name
  returnForm.current_available = row.available_quantity
  returnForm.total_quantity = row.total_quantity
  returnForm.quantity = 1
  returnDialogVisible.value = true
}

// 归还提交
const handleReturnSubmit = async () => {
  if (!returnFormRef.value) return
  
  await returnFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateMaterialQuantity(returnForm.id, {
          operation: 'return',
          quantity: returnForm.quantity
        })
        
        ElMessage.success('归还成功')
        returnDialogVisible.value = false
        loadData()
      } catch (error) {
        console.error('归还失败:', error)
      }
    }
  })
}

// 将前端表单转换为后端期望的驼峰字段
const buildMaterialPayload = (f) => {
  return {
    materialCode: f.material_code || null,
    name: f.name || null,
    category: f.category || null,
    totalQuantity: f.total_quantity != null ? Number(f.total_quantity) : null,
    availableQuantity: f.available_quantity != null ? Number(f.available_quantity) : null,
    location: f.location || null,
    status: f.status || null, // 若前端无 status，可留空或设置默认 'available'
    description: f.description || null,
    purchaseDate: f.purchase_date || null, // 保留字符串格式 YYYY-MM-DD
    unitPrice: f.unit_price != null ? Number(f.unit_price) : null
  }
}

// 提交表单（替换原 handleSubmit）
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const payload = buildMaterialPayload(form)

        if (form.id) {
          // 编辑 -> PUT /api/materials/{id}
          await updateMaterial(form.id, payload)
          ElMessage.success('更新成功')
        } else {
          // 添加 -> POST /api/materials
          await createMaterial(payload)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error(error.response?.data?.message || '操作失败')
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  resetForm()
}

const handleOperationDialogClose = () => {
  if (borrowFormRef.value) {
    borrowFormRef.value.clearValidate()
  }
  if (returnFormRef.value) {
    returnFormRef.value.clearValidate()
  }
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.material_code = ''
  form.name = ''
  form.category = ''
  form.total_quantity = 0
  form.available_quantity = 0
  form.location = ''
  form.purchase_date = ''
  form.unit_price = 0
  form.description = ''
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.materials-management {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.filter-form {
  margin-bottom: 0;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.table-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-table__header-wrapper) {
  border-radius: 4px 4px 0 0;
}

:deep(.stat-card .el-card__body) {
  padding: 20px;
}
</style>