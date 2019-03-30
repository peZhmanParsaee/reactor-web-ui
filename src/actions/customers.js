import { SET_CUSTOMERS } from './types';
import axios from 'axios';

export const setCustomers = (customers) => {
  return {
    type: SET_CUSTOMERS,
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
