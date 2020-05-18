import * as types from './actionTypes';
import * as reduxHelper from '../helpers/reduxHelper';

export const showGlobalMessage = ({ type, text }) => (
  reduxHelper.action(types.SHOW_MESSAGE, { type, text })
);

export const setMessageOpenState = ({ open }) => (
  reduxHelper.action(types.SET_MESSAGE_OPEN_STATE, { open })
);
