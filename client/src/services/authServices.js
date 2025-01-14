import axios from 'axios'

const LOGIN_URL = import.meta.env.VITE_API_URL_LOGIN
const SIGNUP_URL = import.meta.env.VITE_API_URL_SIGNUP
const FORGOT_PWD_URL = import.meta.env.VITE_API_URL_FORGOT_PWD
const RESET_PWD_URL = import.meta.env.VITE_API_URL_RESET_PWD

export const login = async (email, password) => {
  try {
    const response = await axios.post(LOGIN_URL, { email, password })
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.message
    console.log(errorMessage)
    throw new Error(errorMessage)
  }
}
export const signup = async (data) => {
  try {
    const response = await axios.post(SIGNUP_URL, data)
    console.log(response.data)
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.message

    throw new Error(errorMessage)
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(FORGOT_PWD_URL, { email })
    console.log('send')
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const resetPassword = async (password, email, token) => {
  try {
    const response = await axios.post(`${RESET_PWD_URL}/${email}/${token}`, {
      password,
    })
    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.error
    throw new Error(errorMessage)
  }
}
