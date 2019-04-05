import { ADD_PRODUCT, SET_PRODUCTS } from '../actions/types';

const productsReducerDefaultState = [];

export default (state = productsReducerDefaultState, action) => {
  switch(action.type) {
    case ADD_PRODUCT:
      return [
        ...state,
        action.product
      ];
    case SET_PRODUCTS:
      return action.products;
    default:
      return state;
  }
};
