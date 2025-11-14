import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
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
    ElMessage.error(error.message || '网络错误')
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