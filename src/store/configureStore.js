import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import provincesReducer from '../reducers/provinces';
import productsReducer from '../reducers/products';
import customersReducer from '../reducers/customers';
import invoicesReducer from '../reducers/invoices';
import apiMiddleware from "../middlewares/api";
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      provinces: provincesReducer,
      products: productsReducer,
      customers: customersReducer,
      invoices: invoicesReducer
    }),
    // applyMiddleware(apiMiddleware)
    composeEnhancers(applyMiddleware(thunk))
  );
  return store;
};
