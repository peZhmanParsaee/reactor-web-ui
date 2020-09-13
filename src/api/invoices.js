import apiCall from '../utils/api-call';

export const addInvoice = (invoice) =>
  apiCall({
    url: 'v1/invoice',
    method: 'POST',
    data: invoice
  });

export const getInvoices = () => apiCall({ url: 'v1/invoice' });

export const getNewInvoiceNo = () =>
  apiCall({ url: 'v1/invoice/new-invoice-no' });
