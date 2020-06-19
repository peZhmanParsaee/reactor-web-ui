import * as types from '../actions/actionTypes';

const INITIAL_STATE = false;

export default (state = INITIAL_STATE, actoin) => {
  switch (actoin.type) {
  case types.SHOW_LOADING:
    return true;
  case types.HIDE_LOADING:
    return false;
  default:
    return state;
  }
};
