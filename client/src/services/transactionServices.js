import axios from "axios"

const ADD_URL = import.meta.env.VITE_API_URL_ADD_TRANSACTION;
const FETCH_ALL_TRANSACTION_URL = import.meta.env.VITE_API_URL_FETCH_ALL;

export const addTransaction = async (data) => {
    try {
      const response = await axios.post(ADD_URL, { data });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  };
  
  export const fetchAllTransaction = async (data) => {
      try {
        const response = await axios.post(FETCH_ALL_TRANSACTION_URL, { data });
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message;
        throw new Error(errorMessage);
      }
    };
