import * as TYPES from '../actions/types';

const INITIAL_STATE = false;

export default (state = INITIAL_STATE, actoin) => {
  switch(actoin.type) {
    case TYPES.SHOW_LOADING:
      return true;
    case TYPES.HIDE_LOADING:
      return false;
    default:
      return state;
  }
};
