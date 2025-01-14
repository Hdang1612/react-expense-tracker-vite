import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const ADD_URL = import.meta.env.VITE_API_URL_ADD_RECEIPT
const UPDATE_URL = import.meta.env.VITE_API_URL_UPDATE_RECEIPT
const REMOVE_URL = import.meta.env.VITE_API_URL_DELETE_RECEIPT
// const FETCH_URL = import.meta.env.VITE_API_URL_FETCH_RECEIPT;

export const addReceipt = async (data, id) => {
  try {
    const formData = new FormData()
    formData.append('receipt', data)
    const url = `${ADD_URL}/${id}`
    console.log(url)

    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.receipt
  } catch (error) {
    const errorMessage = error.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const updateReceipt = async (data) => {
  try {
    const formData = new FormData()
    formData.append('receipt', data.receipt)
    const url = `${UPDATE_URL}/${data.id}`

    const response = await api.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.receipt
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message
    throw new Error(errorMessage)
  }
}

export const removeReceipt = async (id) => {
  try {
    const url = `${REMOVE_URL}/${id}`
    const response = await api.delete(url)
    return response.message
  } catch (error) {
    const errorMessage = error.response?.data?.message
    throw new Error(errorMessage)
  }
}
