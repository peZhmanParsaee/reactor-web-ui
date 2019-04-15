import * as TYPES from './types';

export const showGlobalMessage = ({ type, text }) => {
  return {
    type: TYPES.SHOW_MESSAGE,
    payload:{
      type,
      text
    }
  };
};

export const setMessageOpenState = ({ open }) => {
  return {
    type: TYPES.SET_MESSAGE_OPEN_STATE,
    payload: { open }
  };
};
