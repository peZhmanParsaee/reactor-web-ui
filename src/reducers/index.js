import { combineReducers } from 'redux';
import customersReducer from './customersReducer';
import invoicesReducer from './invoicesReducer';
import productsReducer from './productsReducer';
import provincesReducer from './provincesReducer';
import loadingReducer from './loadingReducer';
import messageReducer from './messageReducer';

export default combineReducers({
  customers: customersReducer,
  invoices: invoicesReducer,
  products: productsReducer,
  provinces: provincesReducer,
  loading: loadingReducer,
  message: messageReducer
});
