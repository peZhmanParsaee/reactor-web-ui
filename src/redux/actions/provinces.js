import * as types from './actionTypes';
import * as API from '../../api';
import * as reduxHelper from '../../helpers/reduxHelper';

export const setProvinces = (provinces) => {
  return reduxHelper.action(types.SET_PROVINCES, provinces);
};

export const startSetProvinces = () => async (dispatch) => {
  const res = await API.getProvinces();
  if (res.data.status === true) {
    dispatch(setProvinces(res.data.payload));
  }
};
