import * as TYPES from '../actions/types';

const INITIAL_STATE = '';

export default (state = INITIAL_STATE, actoin) => {
  switch(actoin.type) {
    case TYPES.SHOW_MESSAGE:
      return actoin.message;
    default:
      return state;
  }
};
