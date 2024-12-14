import axios from "axios";
// import { useNavigate } from "react-router-dom";

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

const ADD_URL = import.meta.env.VITE_API_URL_ADD_TRANSACTION;
const UPDATE_URL = import.meta.env.VITE_API_URL_UPDATE_TRANSACTION;
const REMOVE_URL = import.meta.env.VITE_API_URL_REMOVE_TRANSACTION;
const FETCH_ALL_TRANSACTION_URL = import.meta.env.VITE_API_URL_FETCH_ALL;
const FETCH_TRANSACTION_URL = import.meta.env.VITE_API_URL_FETCH_BY_ID;
const FILTER_TRANSACTION_URL = import.meta.env.VITE_API_URL_FILTER_TRANSACTION;

export const addTransaction = async (data) => {
  try {
    const response = await api.post(ADD_URL, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const updateTransaction = async (data) => {
  try {
    const url = `${UPDATE_URL}/${data.id}`;
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const removeTransaction = async (id) => {
  try {
    const url = `${REMOVE_URL}/${id}`;
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response?.data?.message;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};

export const fetchAllTransaction = async () => {
  try {
    const response = await api.get(FETCH_ALL_TRANSACTION_URL);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data.message;
    throw new Error(errorMessage);
  }
};

export const fetchTransactionById = async (id) => {
  try {
    const url = `${FETCH_TRANSACTION_URL}/${id}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    throw new Error(errorMessage);
  }
};

export const filterTransactions = async (query) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: query,
    };
    const url = `${FILTER_TRANSACTION_URL}`;
    const res = await axios.get(url, config);
    return res;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};
