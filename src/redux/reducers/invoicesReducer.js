import * as types from '../actions/actionTypes';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case types.ADD_INVOICE:
    return [
      ...state,
      action.invoice
    ];
  case types.SET_INVOICES:
    return action.invoices;
  default:
    return state;
  }
};
