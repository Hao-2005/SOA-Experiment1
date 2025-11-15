import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例 - 添加 baseURL
const request = axios.create({
  baseURL: 'http://localhost:8080',  // ✅ 关键：添加这一行
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    console.log('请求:', config.method.toUpperCase(), config.baseURL + config.url)
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据后端返回的code进行处理
    if (res.code === 200 || res.code === 201) {
      return res
    } else {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    console.error('响应错误:', error)
    if (error.response?.status === 405) {
      ElMessage.error('请求方法不允许，请检查后端接口')
    } else if (error.response?.status === 404) {
      ElMessage.error('接口不存在')
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

// ==================== 人员管理 API ====================

// 获取人员列表（带分页和筛选）
export const getPersonnels = (params) => {
  return request({
    url: '/api/personnels',
    method: 'get',
    params
  })
}

// 根据ID获取人员详情
export const getPersonnelById = (id) => {
  return request({
    url: `/api/personnels/${id}`,
    method: 'get'
  })
}

// 创建人员
export const createPersonnel = (data) => {
  return request({
    url: '/api/personnels',
    method: 'post',
    data
  })
}

// 更新人员信息
export const updatePersonnel = (id, data) => {
  return request({
    url: `/api/personnels/${id}`,
    method: 'put',
    data
  })
}

// 删除人员
export const deletePersonnel = (id) => {
  return request({
    url: `/api/personnels/${id}`,
    method: 'delete'
  })
}

// 搜索人员
export const searchPersonnels = (params) => {
  return request({
    url: '/api/personnels/search',
    method: 'get',
    params
  })
}

// ==================== 物资管理 API (通过 Java 网关 8080) ====================

/**
 * 获取物资列表
 * @param {Object} params - 查询参数
 */
export const getMaterials = (params) => {
  return request({
    url: '/api/materials',
    method: 'get',
    params
  })
}

/**
 * 根据ID获取物资详情
 * @param {Number} id - 物资ID
 */
export const getMaterialById = (id) => {
  return request({
    url: `/api/materials/${id}`,
    method: 'get'
  })
}

/**
 * 创建物资
 * @param {Object} data - 物资数据
 */
export const createMaterial = (data) => {
  return request({
    url: '/api/materials',
    method: 'post',
    data
  })
}

/**
 * 更新物资信息
 * @param {Number} id - 物资ID
 * @param {Object} data - 物资数据
 */
export const updateMaterial = (id, data) => {
  return request({
    url: `/api/materials/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除物资
 * @param {Number} id - 物资ID
 */
export const deleteMaterial = (id) => {
  return request({
    url: `/api/materials/${id}`,
    method: 'delete'
  })
}

/**
 * 更新物资数量（借出/归还）
 * @param {Number} id - 物资ID
 * @param {Object} data - 操作数据 {operation: 'borrow'|'return', quantity: 数量}
 */
export const updateMaterialQuantity = (id, data) => {
  return request({
    url: `/api/materials/${id}/quantity`,
    method: 'put',
    data
  })
}

/**
 * 获取可用物资列表
 * @param {Object} params - 查询参数
 */
export const getAvailableMaterials = (params) => {
  return request({
    url: '/api/materials/available',
    method: 'get',
    params
  })
}