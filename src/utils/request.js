import axios from 'axios'

// 禁用IE下get请求缓存
axios.defaults.headers.get['Cache-Control'] = 'no-cache'
axios.defaults.headers.get.Pragma = 'no-cache'

const service = axios.create({
  timeout: 50000,
})

service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.error(error)
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
  },
  error => {
    console.error(error)
    return Promise.reject(error)
  },
)

export default service
