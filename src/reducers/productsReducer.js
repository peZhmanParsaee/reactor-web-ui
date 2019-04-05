import * as TYPES from '../actions/types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case TYPES.ADD_PRODUCT:
      return [
        ...state,
        action.product
      ];
    case TYPES.SET_PRODUCTS:
      return action.products;
    default:
      return state;
  }
};
