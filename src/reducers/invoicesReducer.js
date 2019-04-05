import * as TYPES from '../actions/types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case TYPES.ADD_INVOICE:
      return [
        ...state,
        action.invoice
      ];
    case TYPES.SET_INVOICES:
      return action.invoices;
    default:
      return state;
  }
};
