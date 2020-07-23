import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './redux/store/configureStore';
import { startSetProvinces } from './redux/actions/provinces';
import { startSetProducts } from './redux/actions/products';
import Loading from './components/Loading';
import AppRouter from './router/AppRouter';

// import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));

store.dispatch(startSetProvinces()).then(() => {
  store.dispatch(startSetProducts()).then(() => {
    ReactDOM.render(jsx, document.getElementById('app'));
  });
});

store.subscribe(() => {
  const state = store.getState();
  if (state.loading === true) {
    ReactDOM.render(<Loading />, document.getElementById('app'));
  } else {
    ReactDOM.render(jsx, document.getElementById('app'));
  }
});
