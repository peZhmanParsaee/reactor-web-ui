import * as TYPES from './types';

export const addProductDialogSetFormFields = (formFields) => {
    return {
        type: TYPES.ADD_PRODUCT_DIALOG_SET_FORM_FIELDS,
        payload: { formFields }
    };
};

export const addProductDialogClearState = () => {
    return {
        type: TYPES.ADD_PRODUCT_DIALOG_CLEAR_STATE
    };
};

export const addProductDialogSetLoadingStatus = (loadingStatus) => {
    return {
        type: TYPES.ADD_PRODUCT_DIALOG_SET_LOADING_STATUS,
        payload: { loadingStatus }
    };
};
