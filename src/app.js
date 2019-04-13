import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset, createGenerateClassName } from '@material-ui/styles';
import App1 from './playground/context/app1';
import App from './playground/App';

import configureStore from './store/configureStore';
import { startSetProvinces } from './actions/provinces';
import { startSetProducts } from './actions/products';
import Loading from './components/Loading';
import AppRouter from './router/AppRouter';

import './styles/styles.scss';


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

// ReactDOM.render(<App />, document.getElementById('app'));
// setTimeout(() => {
//   ReactDOM.unmountComponentAtNode(document.getElementById('app'));}, 10000);

// ReactDOM.render(<MainApp />, document.getElementById('app'));

// ReactDOM.render(<MainAppPureComponent />, document.getElementById('app'));


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
