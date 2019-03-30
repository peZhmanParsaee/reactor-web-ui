import { SET_CUSTOMERS } from '../actions/types';

const defaultCustomersState = [];

export default (state = defaultCustomersState, action) => {  
  switch(action.type) {
    case SET_CUSTOMERS:
      return action.customers;
    default:
      return state;
  }
};