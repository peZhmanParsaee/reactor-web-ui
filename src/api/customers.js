import apiCall from '../utils/api-call';

export const getCustomers = () => apiCall({ url: 'v1/customer' });

export const searchCustomers = (customerName) => {
  apiCall({
    url: 'v1/customer/search',
    params: {
      q: customerName
    }
  });
};
