import * as TYPES from '../actions/types';

const INITIAL_STATE = {
    name: '',
    stock: '',
    unitPrice: ''
};

export default (state = INITIAL_STATE, action) => {  
  console.log(`action is: `);
  console.log(action);
  
  switch(action.type) {
    case TYPES.ADD_PRODUCT_DIALOG_SET_FORM_FIELDS:
        return {
            ...state,
            ...action.payload.formFields
        };
    case TYPES.ADD_PRODUCT_DIALOG_CLEAR_STATE:
        return {
            ...state,
            name: '',
            stock: '',
            unitPrice: ''
        };
    case TYPES.ADD_PRODUCT_DIALOG_SET_LOADING_STATUS:
        return {
            ...state,
            showAddProductLoading: action.payload.loadingStatus
        };
    default:
      return state;
  }
};
