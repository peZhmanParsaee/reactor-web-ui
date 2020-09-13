import apiCall from '../utils/api-call';

export const addProduct = (product) =>
  apiCall({
    url: 'v1/product',
    method: 'POST',
    data: product
  });

export const getProducts = () => apiCall({ url: 'v1/product' });

export const getProvinces = () => apiCall({ url: 'v1/province' });
