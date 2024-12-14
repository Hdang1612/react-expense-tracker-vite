import axios from "axios";

const LOGIN_URL = import.meta.env.VITE_API_URL_LOGIN;
const SIGNUP_URL = import.meta.env.VITE_API_URL_SIGNUP;

export const login = async (email, password) => {
  try {
    const response = await axios.post(LOGIN_URL, { email, password });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};
export const signup = async (data) => {
  try {
    const response = await axios.post(SIGNUP_URL, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;

    throw new Error(errorMessage);
  }
};
