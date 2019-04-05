import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import apiMiddleware from "../middlewares/api";
import reducers from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    reducers,
    // applyMiddleware(apiMiddleware)
    composeEnhancers(applyMiddleware(reduxThunk))
  );
  return store;
};
