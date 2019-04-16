import * as TYPES from '../actions/types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {  
  
  switch(action.type) {
    case TYPES.SET_CUSTOMERS:
      return [...action.customers];
    default:
      return state;
  }
};