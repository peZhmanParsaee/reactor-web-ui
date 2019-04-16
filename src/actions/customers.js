import * as TYPES from './types';
import * as API from '../api/api';

export const setCustomers = (customers) => {
  return {
    type: TYPES.SET_CUSTOMERS,
    customers
  };
};

export const startSetCustomers = () => {
  return (dispatch) => {
    return API.getCustomers()
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
    dispatch({
      type: TYPES.SEARCH_CUSTOMERS,
      customerName
    });
    
    return API.searchCustomers(customerName)
      .then(res => {
        const opStatus = res.data;

        if (opStatus.status === true) {
          dispatch(setCustomers(res.data.payload));
        }

        return opStatus;
      })
      .catch(error => {
        console.error('an error was happened ', error);
      });
  };
};
