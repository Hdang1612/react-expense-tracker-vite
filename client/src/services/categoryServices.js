import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const ADD_URL = import.meta.env.VITE_API_URL_ADD_CATEGORY;
const UPDATE_URL = import.meta.env.VITE_API_URL_UPDATE_CATEGORY;
const REMOVE_URL = import.meta.env.VITE_API_URL_DELETE_CATEGORY;
const FETCH_ALL_TRANSACTION_URL = import.meta.env.VITE_API_URL_FETCH_CATEGORY;
const FETCH_TRANSACTION_URL = import.meta.env.VITE_API_URL_FETCH_CATEGORY_BY_ID;

export const fetchAllCategories = async () => {
  try {
    const response = await api.get(FETCH_ALL_TRANSACTION_URL);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data.message;
    throw new Error(errorMessage);
  }
   
}

export const fetchCategoryById = async (id) => {
  try {
    const url = `${FETCH_TRANSACTION_URL}/${id}`;
    const response= await api.get(url);
    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    throw new Error(errorMessage);
  }
}


export const addCategory = async (data) => {
  try {
    const response = await api.post(ADD_URL, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const updateCategory = async (data) => {
  try {
    const url = `${UPDATE_URL}/${data.id}`;
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const removeCategory = async (id) => {
  try {
    const url = `${REMOVE_URL}/${id}`;
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};


