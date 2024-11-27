import axios from "axios";
// import dotenv from 'dotenv';
// dotenv.config();

// const LOGIN_URL = import.meta.env.VITE_API_LOGIN_URL;
// const SIGNUP_URL = import.meta.env.VITE_API_SIGNUP_URL;
const LOGIN_URL = "http://localhost:8000/api/user/login";
const SIGNUP_URL = "http://localhost:8000/api/user/signup";
export const login = async (email, password) => {
  try {
    const response = await axios.post(LOGIN_URL, { email, password });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;

    throw new Error(errorMessage);
  }
};
export const signup = async (data) => {
  try {
    const response = await axios.post(SIGNUP_URL, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;

    throw new Error(errorMessage);
  }
};
