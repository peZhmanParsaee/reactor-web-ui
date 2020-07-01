import * as types from './actionTypes';
import * as API from '../../api';
import * as reduxHelper from '../../helpers/reduxHelper';

export const addProduct = (product) =>
  reduxHelper.action(types.ADD_PRODUCT, product);

export const startAddProduct = (productData = {}) => async (dispatch) => {
  dispatch(reduxHelper.action(types.ADD_PRODUCT_LOADING));

  const { name, stock, unitPrice } = productData;

  const product = { name, stock, unitPrice };

  const insertedProductRes = await API.addProduct(product);
  const opStatus = insertedProductRes.data;
  dispatch(addProduct(opStatus.payload));

  return opStatus;
};

export const setProducts = (products) =>
  reduxHelper.action(types.SET_PRODUCTS, products);

export const startSetProducts = () => async (dispatch) => {
  const res = await API.getProducts();
  if (res.data.status === true) {
    dispatch(setProducts(res.data.payload));
  }
};
