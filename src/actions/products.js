import * as types from './actionTypes';
import * as API from '../api/api';
import * as reduxHelper from '../helpers/reduxHelper';

export const addProduct = (product) => reduxHelper.action(types.ADD_PRODUCT, product);

export const startAddProduct = (productData = {}) => {
  return (dispatch) => {
    const {
      name, 
      stock, 
      unitPrice
    } = productData;

    const product = { name, stock, unitPrice };

    return API.addProduct(product)
      .then((insertedProductRes) => {
        const opStatus = insertedProductRes.data;

        dispatch(addProduct(opStatus.payload));

        return opStatus;
      });
  };
};

export const setProducts = (products) => (
  reduxHelper.action(types.SET_PRODUCTS, products)
);

export const startSetProducts = () => {
  return (dispatch) => {
    return API.getProducts()
      .then((res) => {        
        if (res.data.status === true) {
          dispatch(setProducts(res.data.payload));
        }
      });
  };
};
