import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import apiMiddleware from '../middlewares/api';
import loggerMiddleware from '../middlewares/logger';
import reducers from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const middlewares = [loggerMiddleware, reduxThunk, apiMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const composedEnhancers = composeEnhancers(middlewareEnhancer);

  const store = createStore(reducers, composedEnhancers);
  return store;
};
