import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/erp-dev/api'
})

export default api