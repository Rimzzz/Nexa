import axios from 'axios'

declare module 'axios' {
  interface AxiosInstance {
    [key: string]: any
  }
}

export const http = axios.create({
  baseURL: '/api',
  timeout: 15000
})
