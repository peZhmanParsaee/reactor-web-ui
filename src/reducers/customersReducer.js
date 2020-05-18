import * as types from '../actions/actionTypes';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case types.SET_CUSTOMERS:
    return [...action.customers];
  default:
    return state;
  }
};
