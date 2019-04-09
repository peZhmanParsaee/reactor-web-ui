import * as TYPES from './types';

export const showLoading = () => {
    return {
        type: TYPES.SHOW_LOADING
    };
};

export const hideLoading = () => {
    return {
        type: TYPES.HIDE_LOADING
    };
};
