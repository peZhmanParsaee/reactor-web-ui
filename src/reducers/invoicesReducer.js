import { ADD_INVOICE, SET_INVOICES } from '../actions/types';

const invoicesReducerDefaultState = [];

export default (state = invoicesReducerDefaultState, action) => {
  switch(action.type) {
    case ADD_INVOICE:
      return [
        ...state,
        action.invoice
      ];
    case SET_INVOICES:
      return action.invoices;
    default:
      return state;
  }
};
