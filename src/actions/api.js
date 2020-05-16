import types from "./actionTypes";
import reduxHelper from '../helpers/reduxHelper';

export const apiStart = label => (
  reduxHelper.action(types.API_START, { label })
);

export const apiEnd = label => (
  reduxHelper.action(types.API_END, { label })
);

export const accessDenied = url => (
  reduxHelper.action(types.ACCESS_DENIED, { url })
);

export const apiError = error => (
  reduxHelper.action(types.API_ERROR, { error })
);
