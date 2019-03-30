import uuid from 'uuid';
import { SET_PROVINCES } from './types';
import axios from 'axios';

export const setProvinces = (provinces) => ({
  type: SET_PROVINCES,
  provinces
});

export const startSetProvinces = () => {
  return (dispatch) => {

    return axios.get(`${API_ENDPOINT}/api/v1/province`)
              .then(res => {
                if (res.data.status === true) {
                  dispatch(setProvinces(res.data.payload));
                  console.log('disptach setProvinces');
                }
              });

  };
};

