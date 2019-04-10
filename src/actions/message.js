import * as TYPES from './types';

export const showGlobalMessage = (message) => {
    return {
        type: TYPES.SHOW_LOADING,
        message
    };
};
