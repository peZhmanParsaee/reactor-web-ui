import { combineReducers } from 'redux';
import customersReducer from './customersReducer';
import invoicesReducer from './invoicesReducer';
import productsReducer from './productsReducer';
import provincesReducer from './provincesReducer';
import loadingReducer from './loadingReducer';
import messageReducer from './messageReducer';
import addInvoiceFormReducer from './addInvoiceFormReducer';
import salesReportFormReducer from './salesReportFormReducer';

export default combineReducers({
  customers: customersReducer,
  invoices: invoicesReducer,
  products: productsReducer,
  provinces: provincesReducer,
  loading: loadingReducer,
  message: messageReducer,
  addInvoiceForm: addInvoiceFormReducer,
  salesReportForm: salesReportFormReducer
});
