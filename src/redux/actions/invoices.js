import * as types from './actionTypes';
import { showLoading, hideLoading } from './loading';
import * as API from '../../api';
import { invoiceFormSetInvoiceNo } from './addInvoiceForm';
import * as reduxHelper from '../../helpers/reduxHelper';

export const addInvoice = (invoice) =>
  reduxHelper.action(types.ADD_INVOICE, invoice);

export const startAddInvoice = (invoiceData = {}) => (dispatch) => {
  const {
    no,
    products,
    customerId,
    address,
    mailType,
    deliverAfter,
    deliverAfterTimeUnit,
    date,
    totalPrice
  } = invoiceData;

  const invoice = {
    no,
    products,
    customerId,
    address,
    mailType,
    deliverAfter,
    deliverAfterTimeUnit,
    date,
    totalPrice
  };

  dispatch(showLoading());

  return API.addInvoice(invoice).then((insertedInvoiceRes) => {
    const opStatus = insertedInvoiceRes.data;
    dispatch(addInvoice(opStatus.payload));
    dispatch(hideLoading());
    return opStatus;
  });
};

export const setInvoices = (invoices) =>
  reduxHelper.action(types.SET_INVOICES, { ...invoices });

export const startSetInvoices = () => async (dispatch) => {
  try {
    const res = await API.getInvoices();

    if (res.data.status === true) {
      dispatch(setInvoices(res.data.payload));
    }
  } catch (err) {
    // console.log(err);
  }
};

export const setInvoiceNo = () => async (dispatch) => {
  try {
    const res = await API.getNewInvoiceNo();
    const opStatus = res.data;
    if (opStatus.status === true) {
      const invoiceNo = opStatus.payload;
      dispatch(invoiceFormSetInvoiceNo(invoiceNo));
    }
  } catch (error) {
    // todo: handle error
  }
};
