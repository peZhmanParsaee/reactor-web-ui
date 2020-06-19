import moment from 'moment-jalaali';
import * as types from '../actions/actionTypes';

const INITIAL_STATE = {
  activeStep: 0,
  isAddProductDialogOpen: false,
  invoice: {
    no: 0,
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
      provinceId: '',
      cityId: ''
    },
    mailType: 'registered',
    deliverAfter: '',
    deliverAfterTimeUnit: '',
    totalPrice: 0
  },
  message: {
    text: '',
    show: false,
    type: 'warning'
  },
  single: '',
  popper: '',
  suggestions: [],
  showAddProductLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case types.INVOICE_FORM_CLEAR_STATE:

    return INITIAL_STATE;

  case types.INVOICE_FORM_SET_ACTIVE_STEP:

    return {
      ...state,
      activeStep: action.payload.activeStep
    };

  case types.INVOICE_FORM_SET_INVOICE_NO:
    return {
      ...state,
      invoice: {
        ...state.invoice,
        no: action.payload.invoiceNo
      }
    };

  case types.INVOICE_FORM_SET_ADD_PRODUCT_DIALOG_OPEN:
    return {
      ...state,
      isAddProductDialogOpen: action.payload.isAddProductDialogOpen
    };

  case types.INVOICE_FORM_SET_CUSTOMER_ID:
    return {
      ...state,
      invoice: { ...state.invoice, customerId: action.payload.customerId }
    };

  case types.INVOICE_FORM_SET_SUGGESTIONS:
    return {
      ...state,
      suggestions: [...action.payload.suggestions],
      // single: action.payload.single
    };

  case types.INVOICE_FORM_SET_SUGGESTION:
    return {
      ...state,
      name: action.payload.name,
      invoice: {
        ...state.invoice,
        customerId: action.payload.customerId
      },
      single: action.payload.single
    };

  case types.INVOICE_FORM_ADD_NEW_PRODUCT_TO_INVOICE:

    return {
      ...state,
      invoice: {
        ...state.invoice,
        products: [
          ...state.invoice.products,
          action.payload.newInvoiceProduct
        ],
        newProduct: {
          _id: 0,
          count: 1,
          unitPrice: 0,
          totalPrice: 0
        },
        totalPrice: state.invoice.totalPrice + action.payload.newInvoiceProduct.totalPrice
      }
    };

  case types.INVOICE_FORM_SET_NEW_PRODUCT:
    return {
      ...state,
      invoice: {
        ...state.invoice,
        newProduct: { ...action.payload.newProduct },
        products: [
          ...state.invoice.products,
          action.payload.newInvoiceProduct
        ]
      }
    };

  case types.INVOICE_FORM_REMOVE_PRODUCT_FROM_INVOICE_BY_ID:
    return {
      ...state,
      invoice: {
        ...state.invoice,
        products: state.invoice.products.filter((invoiceProduct) => invoiceProduct.id != action.payload.invoiceProductId)
      }
    };

  case types.INVOICE_FORM_SET_INVOICE_PRODUCT_COUNT:
    const tempInvoiceProducts = state.invoice.products;

    for (let i = 0; i < state.invoice.products.length; i++) {
      if (state.invoice.products[i].id === action.payload.invoiceProductId) {
        tempInvoiceProducts[i].count = action.payload.count;
        tempInvoiceProducts[i].totalPrice = action.payload.count * tempInvoiceProducts[i].unitPrice;

        break;
      }
    }

    return {
      ...state,
      invoice: {
        ...state.invoice,
        products: tempInvoiceProducts
      }
    };

  case types.INVOICE_FORM_SET_PROVINCE_ID:
    return {
      ...state,
      invoice: {
        ...state.invoice,
        address: {
          cityId: '',
          provinceId: action.payload.provinceId
        }
      }
    };

  case types.INVOICE_FORM_SET_CITY_ID:
    return {
      ...state,
      invoice: {
        ...state.invoice,
        address: {
          ...state.invoice.address,
          cityId: action.payload.cityId
        }
      }
    };

  case types.INVOICE_FORM_SET_MAIL_TYPE:
    return {
      ...state,
      invoice: {
        ...state.invoice,
        mailType: action.payload.mailType
      }
    };

  case types.INVOICE_FORM_SET_DELIVER_AFTER:
    return {
      ...state,
      invoice: {
        ...state.invoice,
        deliverAfter: action.payload.deliverAfter
      }
    };

  case types.INVOICE_FORM_SET_DELIVER_AFTER_TIME_UNIT:
    return {
      ...state,
      invoice: {
        ...state.invoice,
        deliverAfterTimeUnit: action.payload.deliverAfterTimeUnit
      }
    };

  default:
    return state;
  }
};
