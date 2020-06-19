import * as types from './actionTypes';
import * as reduxHelper from '../../helpers/reduxHelper';

export const showLoading = () => reduxHelper.action(types.SHOW_LOADING);

export const hideLoading = () => reduxHelper.action(types.HIDE_LOADING);
