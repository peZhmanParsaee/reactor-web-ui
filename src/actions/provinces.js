import * as types from './actionTypes';
import * as API from '../api/api';
import * as reduxHelper from '../helpers/reduxHelper';

export const setProvinces = provinces => (
  reduxHelper.action(types.SET_PROVINCES, { provinces })
);

export const startSetProvinces = () => {
  return dispatch => {
    return API.getProvinces()
      .then(res => {
        if (res.data.status === true) {
          dispatch(setProvinces(res.data.payload));
        }
      });
  };
};
