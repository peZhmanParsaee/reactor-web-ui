import { ADD_INVOICE, SET_INVOICES } from './types';
import axios from 'axios';

export const addInvoice = (invoice) => {
  return {
    type: ADD_INVOICE,
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

    return axios.post(`${API_ENDPOINT}/api/v1/invoice`, invoice)
      .then(insertedInvoiceRes => {
        const opStatus = insertedInvoiceRes;

        dispatch(addInvoice(opStatus.payload));
      });

  };
};

export const setInvoices = (invoices) => {
  return {
    type: SET_INVOICES,
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
