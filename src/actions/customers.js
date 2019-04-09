import * as TYPES from './types';
import axios from 'axios';

export const setCustomers = (customers) => {
  return {
    type: TYPES.SET_CUSTOMERS,
    customers
  };
};

export const startSetCustomers = () => {
  return (dispatch) => {
    return axios.get(`${API_ENDPOINT}/api/v1/customer`)
      .then(res => {
        if (res.data.status === true) {
          dispatch(setCustomers(res.data.payload));
        }
      });
  };
};

export const searchCustomers = (customerName) => {
  return {
    type: TYPES.SEARCH_CUSTOMERS,
    customerName
  };
};

export const startSearchCustomers = (customerName) => {
  return (dispatch) => {
    return axios.get(`${API_ENDPOINT}/api/v1/customer/search`, {
      params: {
        q: customerName
      }
    })
    .then(res => {
      const opStatus = res.data;

      if (opStatus.status === true) {
        dispatch(setCustomers(res.data.payload));        
      }

      return opStatus;
    });
  };
};
