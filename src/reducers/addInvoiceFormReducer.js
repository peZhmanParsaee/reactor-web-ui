import * as TYPES from '../actions/types';
import moment from 'moment-jalaali';

const INITIAL_STATE = {
    activeStep: 0,    
    isAddProductDialogOpen: false,
    invoice: {
      no: '',
      date: moment().format('jYYYY/jMM/jDD'),
      products: [],
      customerId: 0,
      newProduct: {
        _id: 0,
        count: 1,
        unitPrice: 0,
        totalPrice: 0
      },
      address: {
        provinceId: 0,
        cityId: 0
      },
      mailType: "registered",
      deliverAfter: "",
      deliverAfterTimeUnit: "",
      totalPrice: 0
    },
    message: {
      text: "",
      show: false,
      type: "warning"
    },
    single: '',
    popper: '',
    suggestions: [],
    showAddProductLoading: false
};

export default (state = INITIAL_STATE, action) => {  
  console.log(`action is: `);
  console.log(action);
  
    switch(action.type) {
      case TYPES.INVOICE_FORM_SET_ADD_PRODUCT_DIALOG_OPEN:
        console.log(action);
        return {
          ...state,
          isAddProductDialogOpen: action.payload.isAddProductDialogOpen
        };
      case TYPES.INVOICE_FORM_SET_CUSTOMER_ID:
        return {
          ...state,
          invoice: { ...state.invoice, customerId: action.payload.customerId }
        };
      case TYPES.INVOICE_FORM_SET_SUGGESTIONS:        
        return {
          ...state,
          suggestions: [ ...action.payload.suggestions ]
        };
      case TYPES.INVOICE_FORM_SET_SUGGESTION:
        return {
          ...state,
          name: action.payload.name,
          invoice: {
            ...state.invoice,
            customerId: action.payload.customerId
          }
        };
      default:
        return state;
    }
};
