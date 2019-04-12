import { ADD_PRODUCT, SET_PRODUCTS } from './types';
import axios from 'axios';

export const addProduct = (product) => {
  return {
    type: ADD_PRODUCT,
    product
  };
}

export const startAddProduct = (productData = {}) => {
  return (dispatch) => {
    const {
      name, 
      stock, 
      unitPrice
    } = productData;

    const product = { name, stock, unitPrice };

    return axios.post(`${API_ENDPOINT}/api/v1/product`, product)
      .then(insertedProductRes => {
        const opStatus = insertedProductRes.data;

        dispatch(addProduct(opStatus.payload));

        return opStatus;
      });
  };
};


export const setProducts = (products) => {
  return {
    type: SET_PRODUCTS,
    products
  };
};

export const startSetProducts = () => {
  return (dispatch) => {
    return axios.get(`${API_ENDPOINT}/api/v1/product`)
      .then(res => {
        
        if (res.data.status === true) {
          dispatch(setProducts(res.data.payload));
        }
      });
  };
};
