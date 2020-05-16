import * as types from './actionTypes';
import * as reduxHelper from '../helpers/reduxHelper';

export const showLoading = () => {
  return reduxHelper.action(types.SHOW_LOADING);
};

export const hideLoading = () => {
  return reduxHelper.action(types.HIDE_LOADING);
};
