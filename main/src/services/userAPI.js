import axios from 'axios'
import jwt from 'jsonwebtoken'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  //********** USER ****************/

  // login
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    // Simpan token ke localStorage
    localStorage.setItem('token', response.data.token)
    return response
  },

  // getall
  getUser() {
    return apiClient.get('/data/users')
  },

  // getFakultasById
  getUserById(id) {
    return apiClient.get(`/data/users/${id}`)
  },

  // create
  createUser(data) {
    return apiClient.post('/data/users', data)
  },

  // update
  updateUser(id, data) {
    return apiClient.put(`/data/users/${id}`, data)
  },

  // delete
  deleteUser(id) {
    return apiClient.delete(`/data/users/${id}`)
  },

  // user
  async getLoggedInUser() {
    const token = localStorage.getItem('token')
    if (!token) return null
    const decodedToken = jwt.decode(token)
    const response = await this.getUserById(decodedToken.id)
    return response.data
  }
}
