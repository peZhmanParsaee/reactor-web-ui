import { combineReducers } from 'redux';
import customersReducer from './customersReducer';
import invoicesReducer from './invoicesReducer';
import productsReducer from './productsReducer';
import provincesReducer from './provincesReducer';

export default combineReducers({
  customers: customersReducer,
  invoices: invoicesReducer,
  products: productsReducer,
  provinces: provincesReducer
});
