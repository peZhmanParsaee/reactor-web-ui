import * as types from '../actions/actionTypes';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
  case types.ADD_PRODUCT:
    return [
      ...state,
      action.product
    ];
  case types.SET_PRODUCTS:
    return action.products;
  default:
    return state;
  }
};
