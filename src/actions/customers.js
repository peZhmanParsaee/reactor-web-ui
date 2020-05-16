import * as types from './actionTypes';
import * as API from '../api/api';
import * as reduxHelper from '../helpers/reduxHelper';

export const setCustomers = customers => (
  reduxHelper.action(types.SET_CUSTOMERS, { customers })
);

export const startSetCustomers = () => {
  return dispatch => {
    return API.getCustomers()
      .then(res => {
        if (res.data.status === true) {
          dispatch(setCustomers(res.data.payload));
        }
      });
  };
};

export const searchCustomers = customerName => (
  reduxHelper.action(types.SEARCH_CUSTOMERS, { customerName })
);

export const startSearchCustomers = customerName => {
  return dispatch => {
    dispatch(searchCustomers(customerName));
        
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
