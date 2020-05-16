import * as types from './actionTypes';
import * as reduxHelper from '../helpers/reduxHelper';

export const invoiceFormClearState = () => (
  reduxHelper.action(types.INVOICE_FORM_CLEAR_STATE)
)

export const invoiceFormSetAddProductDialogOpenState = isAddProductDialogOpen => (
  reduxHelper.action(types.INVOICE_FORM_SET_ADD_PRODUCT_DIALOG_OPEN, { isAddProductDialogOpen })
)

export const invoiceFormSetInvoiceNo = invoiceNo => (
  reduxHelper.action(types.INVOICE_FORM_SET_INVOICE_NO, { invoiceNo })
)

export const invoiceFormSetCustomerId = customerId => (
  reduxHelper.action(types.INVOICE_FORM_SET_CUSTOMER_ID, { customerId })
)

export const invoiceFormSetSuggestions = ({ single, suggestions }) => (
  reduxHelper.action(types.INVOICE_FORM_SET_SUGGESTIONS, { single, suggestions })
)

export const invoiceFormSetSuggestion = ({ name, customerId, single }) => (
  reduxHelper.action(types.INVOICE_FORM_SET_SUGGESTION, { name, customerId, single })
)

export const invoiceFormAddNewProductToInvoice = newInvoiceProduct => (
  reduxHelper.action(types.INVOICE_FORM_ADD_NEW_PRODUCT_TO_INVOICE, { newInvoiceProduct })
)

export const invoiceFormSetNewProduct = ({ newProduct, newInvoiceProduct }) => (
  reduxHelper.action(types.INVOICE_FORM_SET_NEW_PRODUCT, { newProduct, newInvoiceProduct })
);

export const invoiceFormRemoveProductFromInvoiceById = invoiceProductId => (
  reduxHelper.action(types.INVOICE_FORM_REMOVE_PRODUCT_FROM_INVOICE_BY_ID, { invoiceProductId })
);

export const invoiceFormSetInvoiceProductCount = ({ invoiceProductId, count }) => (
  reduxHelper.action(types.INVOICE_FORM_SET_INVOICE_PRODUCT_COUNT, { invoiceProductId, count })
);

export const invoiceFormSetProvinceId = provinceId => (
  reduxHelper.action(types.INVOICE_FORM_SET_PROVINCE_ID, { provinceId })
);

export const invoiceFormSetCityId = cityId => (
  reduxHelper.action(types.INVOICE_FORM_SET_CITY_ID, { cityId })
);

export const invoiceFormSetMailType = mailType => (
  reduxHelper.action(types.INVOICE_FORM_SET_MAIL_TYPE, { mailType })
);

export const invoiceFormSetDeliverAfter = deliverAfter => (
  reduxHelper.action(types.INVOICE_FORM_SET_DELIVER_AFTER, { deliverAfter })
);

export const invoiceFormSetDeliverAfterTimeUnit = deliverAfterTimeUnit => (
  reduxHelper.action(types.INVOICE_FORM_SET_DELIVER_AFTER_TIME_UNIT, { deliverAfterTimeUnit })
);

export const invoiceFormSetActiveStep = activeStep => (
  reduxHelper.action(types.INVOICE_FORM_SET_ACTIVE_STEP, { activeStep })
);
