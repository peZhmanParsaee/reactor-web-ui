import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import AppRouter from './router/AppRouter';
import { startSetProvinces } from './actions/provinces';
import { startSetProducts } from './actions/products';
import { startSetCustomers } from './actions/customers';
import { startSetInvoices } from './actions/invoices';
import { create } from 'jss';
import Loading from './components/Loading';
import { StylesProvider, jssPreset, createGenerateClassName } from '@material-ui/styles';
import rtl from 'jss-rtl'

// import Header from './components/Header';
import './styles/styles.scss';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
});

const generateClassName = createGenerateClassName();


const store = configureStore();

const jsx = (
  <StylesProvider jss={jss} generateClassName={generateClassName}>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </StylesProvider>  
);

ReactDOM.render(<Loading />, document.getElementById('app'));

store.dispatch(startSetProvinces()).then(() => {
  store.dispatch(startSetProducts()).then(() => {
    // store.dispatch(startSetCustomers()).then(() => {
      ReactDOM.render(jsx, document.getElementById('app'));
    // });
  });
});

store.subscribe(() => {
  const state = store.getState();
  if (state.loading === true) {
    ReactDOM.render(<Loading />, document.getElementById('app'));
  } else {
    ReactDOM.render(jsx, document.getElementById('app'));
  }
  console.log(state);
});
