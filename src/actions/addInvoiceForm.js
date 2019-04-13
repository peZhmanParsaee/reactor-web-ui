import * as TYPES from './types';

export const invoiceFormSetAddProductDialogOpenState = (isAddProductDialogOpen) => {
    return {
      type: TYPES.INVOICE_FORM_SET_ADD_PRODUCT_DIALOG_OPEN,
      payload: { isAddProductDialogOpen }
    };
};

export const invoiceFormSetCustomerId = (customerId) => {
    return {
      type: TYPES.INVOICE_FORM_SET_CUSTOMER_ID,
      payload: { customerId }
    };
};

export const invoiceFormSetSuggestions = (suggestions) => {
    return {
        type: TYPES.INVOICE_FORM_SET_SUGGESTIONS,
        payload: { suggestions }
    };
};

export const invoiceFormSetSuggestion = (suggestion) => {
    return {
        type: TYPES.INVOICE_FORM_SET_SUGGESTION,
        payload: { suggestion }
    };
};
