import axios from "axios";

const ADD_URL = import.meta.env.VITE_API_URL_ADD_TRANSACTION;
const FETCH_ALL_TRANSACTION_URL = import.meta.env.VITE_API_URL_FETCH_ALL;
const FILTER_TIME_URL = import.meta.env.VITE_API_URL_FILTER_PERIOD_TIME;

export const addTransaction = async (data) => {
  try {
    console.log(data);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(ADD_URL, data, config);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const fetchAllTransaction = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(FETCH_ALL_TRANSACTION_URL, config);
    // console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    console.error("Error message:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const filterByPeriodTime = async (period) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${FILTER_TIME_URL}?period=${period}`;
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message;
    console.error("Error message:", errorMessage);
    throw new Error(errorMessage);
  }
};
