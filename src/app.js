import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { create } from 'jss';
import rtl from 'jss-rtl';
import {
  StylesProvider,
  jssPreset,
  createGenerateClassName
} from '@material-ui/styles';

import configureStore from './redux/store/configureStore';
import { startSetProvinces } from './redux/actions/provinces';
import { startSetProducts } from './redux/actions/products';
import Loading from './components/Loading';
import AppRouter from './router/AppRouter';

import './styles/styles.scss';

const jss = create({
  plugins: [...jssPreset().plugins, rtl()]
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
