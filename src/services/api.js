import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

// 🔐 Interceptor JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getTasks = () => api.get('/tasks')
export const getTask = (id) => api.get(`/tasks/${id}`)
export const createTask = (data) => api.post('/tasks', data)
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data)
export const toggleComplete = (id) => api.patch(`/tasks/${id}/toggle`)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)

export default api
