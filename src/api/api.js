import axios from 'axios';

// NOTE: API_ENDPOINT is a global variable

const getUrl = (route) => `${API_ENDPOINT}/api/${route}`;

const getRequestHeaders = (withAuth) => ({
  Authorization: withAuth ? `Bearer ${localStorage.token}` : undefined,
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*'
});

const apiCall = ({
  url,
  method = 'GET',
  data = null,
  withAuth = false,
  params = null
}) => {
  return axios
    .request({
      url: getUrl(url),
      method,
      // headers: getRequestHeaders(withAuth),
      data,
      params
    })
    .catch((error) => {
      if (error.response && error.response.status === 403) {
        // dispatch(accessDenied(window.location.pathname));
      } else {
        throw error;
      }
    });
};

export const getCustomers = () => apiCall({ url: 'v1/customer' });

export const searchCustomers = (customerName) => apiCall({
  url: 'v1/customer/search',
  params: {
    q: customerName
  }
});

export const addInvoice = (invoice) => apiCall({
  url: 'v1/invoice',
  method: 'POST',
  data: invoice
});

export const getInvoices = () => apiCall({ url: 'v1/invoice' });

export const addProduct = (product) => apiCall({
  url: 'v1/product',
  method: 'POST',
  data: product
});

export const getProducts = () => apiCall({ url: 'v1/product' });

export const getProvinces = () => apiCall({ url: 'v1/province' });

export const getNewInvoiceNo = () => apiCall({ url: 'v1/invoice/new-invoice-no' });
