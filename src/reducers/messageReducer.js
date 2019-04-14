import * as TYPES from '../actions/types';

const INITIAL_STATE = {
  type:'info',
  text: '',
  open: false
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case TYPES.SHOW_MESSAGE:
      return {
        open: true,
        type: action.payload.type,
        text: action.payload.text
      };
    default:
      return state;
  }
};
