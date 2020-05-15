import * as TYPES from './types';

export const invoiceFormClearState = () => {
  return {
    type: TYPES.INVOICE_FORM_CLEAR_STATE
  };
};

export const invoiceFormSetAddProductDialogOpenState = (isAddProductDialogOpen) => {
  return {
    type: TYPES.INVOICE_FORM_SET_ADD_PRODUCT_DIALOG_OPEN,
    payload: { isAddProductDialogOpen }
  };
};

export const invoiceFormSetInvoiceNo = (invoiceNo) => {
  return {
    type: TYPES.INVOICE_FORM_SET_INVOICE_NO,
    payload: { invoiceNo }
  };
};

export const invoiceFormSetCustomerId = (customerId) => {
  return {
    type: TYPES.INVOICE_FORM_SET_CUSTOMER_ID,
    payload: { customerId }
  };
};

export const invoiceFormSetSuggestions = ({ single, suggestions }) => {
  return {
    type: TYPES.INVOICE_FORM_SET_SUGGESTIONS,
    payload: { single, suggestions }
  };
};

export const invoiceFormSetSuggestion = ({ name, customerId, single }) => {
  return {
    type: TYPES.INVOICE_FORM_SET_SUGGESTION,
    payload: { name, customerId, single }
  };
};

export const invoiceFormAddNewProductToInvoice = (newInvoiceProduct) => {
  return {
    type: TYPES.INVOICE_FORM_ADD_NEW_PRODUCT_TO_INVOICE,
    payload: { newInvoiceProduct }
  };
};

export const invoiceFormSetNewProduct = ({ newProduct, newInvoiceProduct }) => {
  return {
    type: TYPES.INVOICE_FORM_SET_NEW_PRODUCT,
    payload: { newProduct, newInvoiceProduct }
  };
};

export const invoiceFormRemoveProductFromInvoiceById = (invoiceProductId) => {
  return {
    type: TYPES.INVOICE_FORM_REMOVE_PRODUCT_FROM_INVOICE_BY_ID,
    payload: { invoiceProductId }
  };
};

export const invoiceFormSetInvoiceProductCount = ({ invoiceProductId, count }) => {
  return {
    type: TYPES.INVOICE_FORM_SET_INVOICE_PRODUCT_COUNT,
    payload: {
      invoiceProductId, 
      count
    }
  };
};

export const invoiceFormSetProvinceId = (provinceId) => {
  return {
    type: TYPES.INVOICE_FORM_SET_PROVINCE_ID,
    payload: { provinceId }
  };
};


export const invoiceFormSetCityId = (cityId) => {
  return {
    type: TYPES.INVOICE_FORM_SET_CITY_ID,
    payload: { cityId }
  };
};

export const invoiceFormSetMailType = (mailType) => {
  return {
    type: TYPES.INVOICE_FORM_SET_MAIL_TYPE,
    payload: { mailType }
  };
};

export const invoiceFormSetDeliverAfter = (deliverAfter) => {
  return {
    type: TYPES.INVOICE_FORM_SET_DELIVER_AFTER,
    payload: { deliverAfter }
  };
};

export const invoiceFormSetDeliverAfterTimeUnit = (deliverAfterTimeUnit) => {
  return {
    type: TYPES.INVOICE_FORM_SET_DELIVER_AFTER_TIME_UNIT,
    payload: { deliverAfterTimeUnit }
  };
};

export const invoiceFormSetActiveStep = (activeStep) => {
  return {
    type: TYPES.INVOICE_FORM_SET_ACTIVE_STEP,
    payload: { activeStep }
  };
};
