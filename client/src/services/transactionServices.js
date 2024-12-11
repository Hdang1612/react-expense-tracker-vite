import axios from "axios"

const ADD_URL = import.meta.env.VITE_API_URL_ADD_TRANSACTION;
const UPDATE_URL = import.meta.env.VITE_API_URL_UPDATE_TRANSACTION;
const REMOVE_URL = import.meta.env.VITE_API_URL_REMOVE_TRANSACTION;
const FETCH_ALL_TRANSACTION_URL = import.meta.env.VITE_API_URL_FETCH_ALL;
const FETCH_TRANSACTION_URL = import.meta.env.VITE_API_URL_FETCH_BY_ID;
const FILTER_TIME_URL = import.meta.env.VITE_API_URL_FILTER_PERIOD_TIME;

export const addTransaction = async (data) => {
    try {
      const token = localStorage.getItem('token'); 
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      const response = await axios.post(ADD_URL, data ,config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  };

  
export const updateTransaction = async (data,id) => {
    try {
      console.log(data)
      const token = localStorage.getItem('token'); 
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      const url= `${UPDATE_URL}/${id}`
      const response = await axios.put(url, data ,config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  };
export const removeTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token'); 
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      const url= `${REMOVE_URL}/${id}`
      const response = await axios.delete(url,config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  };
  
  export const fetchAllTransaction = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(FETCH_ALL_TRANSACTION_URL,config);
        // console.log('Response data:', response.data);
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message;
        console.error('Error message:', errorMessage);
        throw new Error(errorMessage);
      }
};

export const fetchTransactionById = async(id) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers : {
        Authorization:`Bearer ${token}`,
      },
    }
    const url= `${FETCH_TRANSACTION_URL}/${id}`
    const res=await axios.get(url,config)
    return res.data
  } catch (error) {
    const errorMessage = error.response?.data?.message;
      console.error('Error message:', errorMessage);
      throw new Error(errorMessage);
  }
}

  export const filterByPeriodTime =async(period) => {
    try {
      const token = localStorage.getItem('token'); 
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const url =`${FILTER_TIME_URL}?period=${period}`
        const response = await axios.get(url,config);
        return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      console.error('Error message:', errorMessage);
      throw new Error(errorMessage);
    }
  }
