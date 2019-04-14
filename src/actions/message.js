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
