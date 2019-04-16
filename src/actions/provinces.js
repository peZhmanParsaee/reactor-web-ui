import { SET_PROVINCES } from './types';
import * as API from '../api/api';

export const setProvinces = (provinces) => ({
  type: SET_PROVINCES,
  provinces
});

export const startSetProvinces = () => {
  return (dispatch) => {

    return API.getProvinces()
      .then(res => {
        if (res.data.status === true) {
          dispatch(setProvinces(res.data.payload));
        }
      });

  };
};

