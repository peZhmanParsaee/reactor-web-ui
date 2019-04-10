import * as TYPES from './types';
import { showLoading, hideLoading } from './loading';
import { showGlobalMessage } from './message';
import axios from 'axios';

export const addInvoice = (invoice) => {
  return {
    type: TYPES.ADD_INVOICE,
    invoice
  };
};

export const startAddInvoice = (invoiceData = {}) => {
  return (dispatch) => {
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

    dispatch(showLoading())
      
    return axios.post(`${API_ENDPOINT}/api/v1/invoice`, invoice)
      .then(insertedInvoiceRes => {
        const opStatus = insertedInvoiceRes.data;
        dispatch(addInvoice(opStatus.payload));
        dispatch(hideLoading());
        // dispatch(showGlobalMessage(opStatus));
        return opStatus;
      });

  };
};

export const setInvoices = (invoices) => {
  return {
    type: TYPES.SET_INVOICES,
    invoices
  };
};

export const startSetInvoices = () => async dispatch => {
  try {
    const res = await axios.get(`${API_ENDPOINT}/api/v1/invoice`);      
    
    if (res.data.status === true) {
      dispatch(setInvoices(res.data.payload));
    }
      
  } catch (err) {
    // console.log(err);
  }
};
