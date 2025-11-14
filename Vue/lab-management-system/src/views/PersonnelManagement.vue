<template>
  <div class="personnel-management">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <h1 class="page-title">人员管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加人员
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="关键词搜索">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索姓名、工号、联系方式"
            clearable
            @clear="handleSearch"
            style="width: 240px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="部门">
          <el-select
            v-model="filterForm.department"
            placeholder="请选择部门"
            clearable
            @change="handleFilter"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="物理系" value="物理系" />
            <el-option label="计算机系" value="计算机系" />
            <el-option label="化学系" value="化学系" />
            <el-option label="生物系" value="生物系" />
            <el-option label="电子系" value="电子系" />
            <el-option label="数学系" value="数学系" />
            <el-option label="历史系" value="历史系" />
          </el-select>
        </el-form-item>

        <el-form-item label="角色">
          <el-select
            v-model="filterForm.role"
            placeholder="请选择角色"
            clearable
            @change="handleFilter"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="管理员" value="admin" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            @change="handleFilter"
            style="width: 140px"
          >
            <el-option label="全部" value="" />
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
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
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="employeeId" label="工号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="role" label="角色" width="120" />
        <el-table-column prop="contact" label="联系方式" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button link type="primary" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
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
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="工号" prop="employeeId">
          <el-input v-model="form.employeeId" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择部门" style="width: 100%">
            <el-option label="技术部" value="技术部" />
            <el-option label="行政部" value="行政部" />
            <el-option label="研发部" value="研发部" />
            <el-option label="市场部" value="市场部" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="管理员" />
            <el-option label="教师" value="教师" />
            <el-option label="学生" value="学生" />
            <el-option label="实验员" value="实验员" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="在职">在职</el-radio>
            <el-radio label="离职">离职</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="人员详情"
      width="600px"
    >
      <el-descriptions :column="2" border v-if="currentDetail">
        <el-descriptions-item label="ID">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="工号">{{ currentDetail.employeeId }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentDetail.name }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentDetail.department }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ currentDetail.role }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentDetail.status === '在职' ? 'success' : 'info'">
            {{ currentDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系方式" :span="2">{{ currentDetail.contact }}</el-descriptions-item>
        <el-descriptions-item label="邮箱" :span="2">{{ currentDetail.email }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ formatDate(currentDetail.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ formatDate(currentDetail.updatedAt) }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Search, Refresh, View, Edit, Delete
} from '@element-plus/icons-vue'
import {
  getPersonnels,
  getPersonnelById,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
  searchPersonnels
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
  keyword: '',
  department: '',
  role: '',
  status: ''
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加人员')
const detailVisible = ref(false)
const currentDetail = ref(null)

// 表单
const formRef = ref(null)
const form = reactive({
  id: null,
  employeeId: '',
  name: '',
  department: '',
  role: '',
  contact: '',
  email: '',
  status: '在职'
})

// 表单验证规则
const formRules = {
  employeeId: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      department: filterForm.department || undefined,
      role: filterForm.role || undefined,
      status: filterForm.status || undefined
    }
    
    const response = await getPersonnels(params)
    tableData.value = response.data.items || []
    pagination.total = response.data.pagination.total
    pagination.totalPages = response.data.pagination.total_pages
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = async () => {
  if (filterForm.keyword.trim()) {
    loading.value = true
    try {
      const params = {
        keyword: filterForm.keyword,
        page: pagination.page,
        pageSize: pagination.pageSize
      }
      const response = await searchPersonnels(params)
      tableData.value = response.data.items || []
      pagination.total = response.data.pagination.total
      pagination.totalPages = response.data.pagination.total_pages
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      loading.value = false
    }
  } else {
    loadData()
  }
}

// 筛选
const handleFilter = () => {
  pagination.page = 1
  loadData()
}

// 重置
const handleReset = () => {
  filterForm.keyword = ''
  filterForm.department = ''
  filterForm.role = ''
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
  dialogTitle.value = '添加人员'
  resetForm()
  dialogVisible.value = true
}

// 查看
const handleView = async (row) => {
  try {
    const response = await getPersonnelById(row.id)
    currentDetail.value = response.data
    detailVisible.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
  }
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑人员'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除人员 "${row.name}" 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deletePersonnel(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (form.id) {
          // 编辑
          await updatePersonnel(form.id, form)
          ElMessage.success('更新成功')
        } else {
          // 添加
          await createPersonnel(form)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        console.error('操作失败:', error)
      }
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.employeeId = ''
  form.name = ''
  form.department = ''
  form.role = ''
  form.contact = ''
  form.email = ''
  form.status = '在职'
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
.personnel-management {
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
</style>