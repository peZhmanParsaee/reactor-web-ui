import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import AppRouter from './router/AppRouter';
import { startSetProvinces } from './actions/provinces';
import { startSetProducts } from './actions/products';
import { startSetCustomers } from './actions/customers';
import { startSetInvoices } from './actions/invoices';

// import Header from './components/Header';
import './styles/styles.scss';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';


const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(<p>Loading ...</p>, document.getElementById('app'));

store.dispatch(startSetProvinces()).then(() => {
  store.dispatch(startSetProducts()).then(() => {
    store.dispatch(startSetCustomers()).then(() => {
      ReactDOM.render(jsx, document.getElementById('app'));
    });
  });
});

store.subscribe((state) => {
  console.log(state);
});
